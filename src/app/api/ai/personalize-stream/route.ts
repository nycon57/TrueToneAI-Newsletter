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

    // Fetch extended user profile for authenticated users (for better personalization)
    let enrichedUser = user;
    if (isAuthenticated && user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('tone_of_voice, formality, humor, emotional_expression, detail_orientation, vocabulary, content_length, engagement_style, user_persona, communication_style, speech_patterns, professional_indicators, unique_voice_markers')
        .eq('id', user.id)
        .single();

      if (userProfile) {
        enrichedUser = { ...user, ...userProfile };
      }
    }

    // Build prompt based on contentType and user profile
    const prompt = buildPersonalizationPrompt(article, enrichedUser, contentType);

    // Stream response using Vercel AI SDK
    // Note: We removed auto-save logic from onFinish - users now manually save generations they want to keep
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
      onFinish: async (completion) => {
        // Log completion for analytics (optional)
        console.log('[AI Generation] Completed:', {
          userId: user?.id || sessionId,
          articleId,
          contentType,
          tokensUsed: completion.usage?.totalTokens || 0,
          tier: usageCheck.tier
        });

        // Note: No automatic saving here - users must explicitly save via /api/ai/save-generation
        // This gives users control to review and approve generated content before saving
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

// Helper function to build enhanced personalization prompts
function buildPersonalizationPrompt(article: Record<string, unknown>, user: Record<string, unknown> | null, contentType: string): string {
  // Build comprehensive TrueTone profile context
  const truetoneContext = user ? `
AUTHENTIC VOICE PROFILE:
- Persona: ${user.user_persona || 'Professional loan officer'}
- Tone of Voice: ${user.tone_of_voice || 'professional'}
- Formality Level: ${user.formality || 'semi-formal'}
- Humor Style: ${user.humor || 'minimal'}
- Emotional Expression: ${user.emotional_expression || 'moderate'}
- Detail Orientation: ${user.detail_orientation || 'balanced'}
- Vocabulary Level: ${user.vocabulary || 'professional'}
- Content Length Preference: ${user.content_length || 'medium'}
- Engagement Style: ${user.engagement_style || 'informative'}

COMMUNICATION PATTERNS:
${user.communication_style ? JSON.stringify(user.communication_style, null, 2) : 'Standard professional communication'}

SPEECH PATTERNS:
${user.speech_patterns ? JSON.stringify(user.speech_patterns, null, 2) : 'Standard professional speech patterns'}

PROFESSIONAL MARKERS:
${user.professional_indicators ? JSON.stringify(user.professional_indicators, null, 2) : 'Mortgage and real estate industry terminology'}

UNIQUE VOICE MARKERS:
${user.unique_voice_markers ? JSON.stringify(user.unique_voice_markers, null, 2) : 'Professional and client-focused approach'}
` : `
USER PROFILE:
- Tone: professional
- Formality: semi-formal
- Style: informative
`;

  const articleContext = `
ARTICLE CONTEXT:
Title: ${article.title}
Summary: ${article.summary}
Topic: ${article.article_topic || 'General'}
Category: ${article.category || 'Mortgage Industry'}
`;

  // Content-type specific prompts
  switch (contentType) {
    case 'key_insights':
      return `You are personalizing mortgage industry content for a loan officer.

${truetoneContext}

${articleContext}

TASK: Generate 4 actionable key insights from this article.

REQUIREMENTS:
1. Match the user's detail orientation (${user?.detail_orientation || 'balanced'})
2. Use their professional terminology and vocabulary level
3. Each insight should be specific, actionable, and valuable for their business
4. Length: 15-25 words per insight
5. Focus on what matters to mortgage professionals and their clients

OUTPUT FORMAT:
Return ONLY a JSON array of 4 strings, nothing else:
["Insight 1 here", "Insight 2 here", "Insight 3 here", "Insight 4 here"]

Do not include any explanations, meta-commentary, or additional text outside the JSON array.`;

    case 'video_script':
      return `You are personalizing mortgage industry content for a loan officer.

${truetoneContext}

${articleContext}

TASK: Write a 30-60 second video script for this article.

VOICE REQUIREMENTS:
1. Match the user's speaking style and energy level (${user?.engagement_style || 'informative'})
2. Use their typical phrases: ${user?.speech_patterns?.common_phrases?.join(', ') || 'professional and client-focused language'}
3. Humor level: ${user?.humor || 'minimal'} - adjust accordingly
4. Formality: ${user?.formality || 'semi-formal'} - this affects greeting and tone

STRUCTURE:
- Hook (5 seconds): Attention-grabbing opening
- Context (15 seconds): Explain the news/topic
- Value (25 seconds): Why this matters to clients
- CTA (5 seconds): Clear call-to-action

CONSTRAINTS:
- Reading time: 30-60 seconds (~150-300 words)
- Sound natural and conversational, not scripted
- Use "you" language to engage viewers
- End with specific action they can take

Return only the script text, ready to read aloud. No stage directions or meta-commentary.`;

    case 'email_template':
      return `You are personalizing mortgage industry content for a loan officer.

${truetoneContext}

${articleContext}

TASK: Create a professional email template about this article.

TONE REQUIREMENTS:
1. Formality: ${user?.formality || 'semi-formal'} - adjust greeting and language
2. Emotional expression: ${user?.emotional_expression || 'moderate'} - affects warmth and enthusiasm
3. Professional indicators: Use appropriate mortgage industry terminology
4. Vocabulary: ${user?.vocabulary || 'professional'} level

EMAIL STRUCTURE:
1. Subject Line (under 50 characters, compelling, ${user?.humor === 'frequent' ? 'can be slightly playful' : 'professional'})
2. Preview Text (under 100 characters, creates curiosity)
3. Greeting (match formality: "${user?.formality === 'very-formal' ? 'Dear [Client Name]' : user?.formality === 'casual' ? 'Hey [Client Name]!' : 'Hi [Client Name],'}")
4. Body (2-3 short paragraphs, scannable, mobile-optimized)
5. CTA (clear action step with urgency if appropriate)
6. Signature (professional closing)

PERSONALIZATION TOKENS:
- Use [Client Name] for personalization
- Use [Your Name] for signature
- Include [Your Phone] or [Schedule Link] placeholders

CONSTRAINTS:
- Lead with value/benefit to recipient
- Short paragraphs (2-3 sentences max)
- One clear CTA
- Professional but warm tone

Return the complete email template, ready to use.`;

    case 'social_content':
      return `You are personalizing mortgage industry content for a loan officer.

${truetoneContext}

${articleContext}

TASK: Generate platform-specific social media posts for this article.

PLATFORM REQUIREMENTS:

FACEBOOK (up to 500 characters):
- Tone: Conversational and community-focused
- Can use ${user?.humor === 'minimal' ? 'minimal emojis' : user?.humor === 'frequent' ? '3-5 relevant emojis' : '1-2 emojis'}
- Include context and why it matters
- End with soft CTA (comment, share, reach out)

INSTAGRAM (caption ~300 characters + 5-10 hashtags):
- Visual and concise
- Emoji usage: ${user?.humor === 'minimal' ? 'minimal (1-2)' : user?.humor === 'frequent' ? 'moderate (3-4)' : 'light (2-3)'}
- Engaging opening line
- Mix branded + trending + niche hashtags

TWITTER/X (up to 280 characters):
- Punchy and direct
- Hook in first 7 words
- Use thread if needed for complex topics
- ${user?.humor === 'frequent' ? 'Can be slightly witty' : 'Professional and clear'}

LINKEDIN (up to 700 characters):
- Professional and insightful
- Thought leadership angle
- Industry terminology welcome
- End with question to drive engagement

VOICE CONSISTENCY:
- Vocabulary level: ${user?.vocabulary || 'professional'}
- Engagement style: ${user?.engagement_style || 'informative'}
- All posts should feel authentic to this person

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure, no additional text:
{
  "facebook": "Facebook post here",
  "instagram": "Instagram caption here",
  "twitter": "Twitter/X post here",
  "linkedin": "LinkedIn post here"
}

Do not include explanations or meta-commentary outside the JSON object.`;

    default:
      return `${truetoneContext}\n\n${articleContext}`;
  }
}
