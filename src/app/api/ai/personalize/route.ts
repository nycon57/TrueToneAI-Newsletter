import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { buildPersonalizationPrompt } from '@/lib/ai/personalize';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/utils/rateLimit';
import { checkBotId } from 'botid/server';

export async function POST(req: NextRequest) {
  // Bot protection check
  const botVerification = await checkBotId();
  if (botVerification.isBot) {
    return Response.json({ error: 'Access denied' }, { status: 403 });
  }

  // Apply rate limiting
  const clientId = getClientIdentifier(req, 'ai-personalize');
  if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.AI_PERSONALIZE)) {
    const headers = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.AI_PERSONALIZE);
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    );
  }

  try {
    const user = await getApiUser();

    // Check if user has completed onboarding
    if (!user.has_completed_onboarding) {
      return Response.json(
        { error: 'Please complete voice onboarding first' },
        { status: 400 }
      );
    }

    const { articleContent, contentType, articleId, postId } = await req.json();

    if (!articleContent || !contentType) {
      return Response.json(
        { error: 'Article content and content type are required' },
        { status: 400 }
      );
    }

    // Build the personalization prompt
    const prompt = buildPersonalizationPrompt(articleContent, user, contentType);

    // Create streaming response with GPT-5-nano
    const result = await streamText({
      model: openai('gpt-5-nano'),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
      onFinish: async (completion) => {
        try {
          // Save the generation to the database
          const supabase = createClient();

          const truetoneSnapshot = {
            tone_of_voice: user.tone_of_voice,
            formality: user.formality,
            humor: user.humor,
            emotional_expression: user.emotional_expression,
            detail_orientation: user.detail_orientation,
            vocabulary: user.vocabulary,
            content_length: user.content_length,
            engagement_style: user.engagement_style
          };

          await supabase.from('user_content_generations').insert({
            user_id: user.id,
            organization_id: user.organization_id,
            post_id: postId || null,
            article_id: articleId || null,
            content_type: contentType,
            original_content: articleContent,
            personalized_content: { text: completion.text },
            truetone_settings: truetoneSnapshot,
            tokens_used: completion.usage?.totalTokens || 0
          });

          // Update user's last active timestamp
          await supabase
            .from('users')
            .update({ last_active: new Date().toISOString() })
            .eq('id', user.id);

        } catch (error) {
          console.error('Error saving content generation:', error);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('AI personalization error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}