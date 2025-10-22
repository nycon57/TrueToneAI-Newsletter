import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementAIUsage, setAnonymousSessionCookie } from '@/lib/ai/usage-limits';
import { getOrCreateAnonymousSession } from '@/lib/ai/anonymous-session';
import { getUserSubscriptionStatus, checkAndResetGenerationQuota } from '@/lib/stripe/subscription-guards';

export async function POST(req: NextRequest) {
  try {
    // Try to get authenticated user
    let user = null;
    let isAuthenticated = false;

    try {
      user = await getApiUser();
      isAuthenticated = true;
    } catch {
      // User not authenticated - continue as anonymous
      console.log('Anonymous AI generation request');
    }

    // Atomically check and increment generation limits
    let usageCheck;
    let sessionId: string | undefined;
    let ipAddress: string | null = null;

    if (isAuthenticated && user) {
      // Check and reset quota if needed (monthly reset)
      await checkAndResetGenerationQuota(user.id);

      // Atomic check and increment for authenticated user
      usageCheck = await checkAndIncrementAIUsage({ userId: user.id });

      // Get subscription status for additional context
      const subscriptionStatus = await getUserSubscriptionStatus(user.id);

      // Add subscription info to response (convert tier to lowercase for compatibility)
      usageCheck.tier = subscriptionStatus.tier.toLowerCase() as 'free' | 'paid' | 'anonymous';
      usageCheck.limit = subscriptionStatus.monthlyGenerationLimit;
      usageCheck.used = subscriptionStatus.monthlyGenerationsUsed;
      usageCheck.remaining = subscriptionStatus.generationsRemaining;
    } else {
      // Get or create anonymous session
      const session = await getOrCreateAnonymousSession();
      sessionId = session.sessionId;
      ipAddress = session.ipAddress;

      // Atomic check and increment for anonymous user
      usageCheck = await checkAndIncrementAIUsage({
        sessionId,
        ipAddress: ipAddress || undefined
      });

      // Set session cookie if not already set
      await setAnonymousSessionCookie(sessionId);
    }

    // Check if generation was allowed (counter already incremented if allowed)
    if (!usageCheck.allowed) {
      return Response.json({
        error: usageCheck.message || 'Generation limit reached',
        remaining: usageCheck.remaining,
        limit: usageCheck.limit,
        used: usageCheck.used,
        tier: usageCheck.tier
      }, { status: 429 });
    }

    // Parse and validate request body
    let articleId: string;
    let contentType: string;

    try {
      const body = await req.json();
      articleId = body.articleId;
      contentType = body.contentType;
    } catch (error) {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!articleId || !contentType) {
      return Response.json({ error: 'articleId and contentType required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .eq('status', 'published')
      .single();

    if (articleError || !article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    // Build prompt based on contentType and user profile
    const prompt = buildPersonalizationPrompt(article, user, contentType);

    // Stream response using Vercel AI SDK
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
      onFinish: async (completion) => {
        try {
          // Only save personalization for authenticated users
          if (isAuthenticated && user) {
            const fieldMap: Record<string, string> = {
              'key_insights': 'personalized_key_insights',
              'video_script': 'personalized_video_script',
              'email_template': 'personalized_email_template',
              'social_content': 'personalized_social_content'
            };

            const fieldName = fieldMap[contentType];
            if (!fieldName) return;

            let parsedContent = completion.text;

            // Parse JSON for key_insights and social_content
            if (contentType === 'key_insights') {
              try {
                parsedContent = JSON.parse(completion.text);
              } catch {
                // If parsing fails, split by newlines and clean up
                parsedContent = completion.text
                  .split('\n')
                  .filter(line => line.trim())
                  .map(line => line.replace(/^[-*•]\s*/, '').trim());
              }
            } else if (contentType === 'social_content') {
              try {
                parsedContent = JSON.parse(completion.text);
              } catch {
                // Default structure if parsing fails
                parsedContent = {
                  facebook: completion.text,
                  instagram: completion.text,
                  twitter: completion.text,
                  linkedin: completion.text
                };
              }
            }

            const tokensToAdd = completion.usage?.totalTokens || 0;
            const now = new Date().toISOString();

            // Use atomic upsert with database-side increment to prevent race conditions
            const personalizedData: any = {
              user_id: user.id,
              article_id: articleId,
              [fieldName]: parsedContent,
              last_generated_at: now,
              truetone_settings: {
                tone_of_voice: user.tone_of_voice,
                formality: user.formality,
                humor: user.humor
              }
            };

            // Perform atomic upsert using Postgres ON CONFLICT
            await supabase.rpc('upsert_personalized_output', {
              p_user_id: user.id,
              p_article_id: articleId,
              p_field_name: fieldName,
              p_field_value: parsedContent,
              p_tokens_used: tokensToAdd,
              p_last_generated_at: now,
              p_truetone_settings: {
                tone_of_voice: user.tone_of_voice,
                formality: user.formality,
                humor: user.humor
              }
            });
          }

          // Note: Usage counter was already atomically incremented at the start
          // No need to increment again here - this prevents race conditions

        } catch (error) {
          console.error('Error saving personalization:', error);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('AI personalization error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to build prompt
function buildPersonalizationPrompt(article: any, user: any | null, contentType: string): string {
  const baseContext = `
Article Title: ${article.title}
Article Summary: ${article.summary}

User Profile:
- Tone: ${user?.tone_of_voice || 'professional'}
- Formality: ${user?.formality || 'semi-formal'}
- Humor: ${user?.humor || 'minimal'}
`;

  switch (contentType) {
    case 'key_insights':
      return `${baseContext}

Generate 4 key insights from this article, personalized for this user's tone and style.
Return ONLY a JSON array of strings, nothing else. Example format:
["Insight 1", "Insight 2", "Insight 3", "Insight 4"]`;

    case 'video_script':
      return `${baseContext}

Write a 30-60 second video script for this article, matching the user's communication style.
Make it engaging and conversational. Return only the script text, ready to read.`;

    case 'email_template':
      return `${baseContext}

Create an email template about this article for the user to send to their clients.
Include a compelling subject line and clear call-to-action.
Format it as a complete, ready-to-send email.`;

    case 'social_content':
      return `${baseContext}

Generate social media posts for Facebook, Instagram, Twitter, and LinkedIn.
Match the user's tone and keep within platform character limits.
Return ONLY a JSON object with this exact structure:
{"facebook": "post text", "instagram": "post text", "twitter": "post text", "linkedin": "post text"}`;

    default:
      return baseContext;
  }
}
