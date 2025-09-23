import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check subscription tier
    if (user.subscription_tier === 'free') {
      return NextResponse.json({
        error: 'Premium feature',
        message: 'Upgrade to a paid plan to access AI personalization',
        upgrade_required: true
      }, { status: 403 });
    }

    // Check monthly limits
    if (user.monthly_generations_used >= user.monthly_generation_limit) {
      return NextResponse.json({
        error: 'Monthly limit reached',
        message: `You've reached your monthly limit of ${user.monthly_generation_limit} personalizations`,
        limit_reached: true
      }, { status: 429 });
    }

    const { article_id, output_type, regenerate = false } = await req.json();

    if (!article_id || !output_type) {
      return NextResponse.json(
        { error: 'article_id and output_type are required' },
        { status: 400 }
      );
    }

    // Validate output_type
    const validOutputTypes = ['key_insights', 'video_script', 'email_template', 'social_content'];
    if (!validOutputTypes.includes(output_type)) {
      return NextResponse.json(
        { error: `Invalid output_type. Must be one of: ${validOutputTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', article_id)
      .eq('status', 'published')
      .single();

    if (articleError || !article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get user's TrueTone settings (assuming they're in the users table)
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('tone_of_voice, formality, humor, emotional_expression, detail_orientation, vocabulary, content_length, engagement_style, user_persona, communication_style, speech_patterns, professional_indicators, unique_voice_markers')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User TrueTone profile not found. Please complete voice onboarding first.' },
        { status: 400 }
      );
    }

    // Check if user has completed TrueTone onboarding
    if (!userProfile.tone_of_voice) {
      return NextResponse.json(
        { error: 'TrueTone profile incomplete. Please complete voice onboarding first.' },
        { status: 400 }
      );
    }

    // Get existing personalization or create new one
    let { data: existingPersonalization } = await supabase
      .from('personalized_outputs')
      .select('*')
      .eq('user_id', user.id)
      .eq('article_id', article_id)
      .single();

    // If not regenerating and personalization exists, return it
    if (!regenerate && existingPersonalization && existingPersonalization[`personalized_${output_type}`]) {
      return NextResponse.json({
        personalized_content: existingPersonalization[`personalized_${output_type}`],
        is_cached: true,
        generation_count: existingPersonalization.generation_count,
        last_generated_at: existingPersonalization.last_generated_at
      });
    }

    // Build the original content based on output type
    let originalContent = '';
    switch (output_type) {
      case 'key_insights':
        originalContent = article.default_key_insights?.join('\n• ') || '';
        break;
      case 'video_script':
        originalContent = article.default_video_script || '';
        break;
      case 'email_template':
        originalContent = article.default_email_template || '';
        break;
      case 'social_content':
        originalContent = JSON.stringify(article.default_social_content || {}, null, 2);
        break;
    }

    if (!originalContent) {
      return NextResponse.json(
        { error: `No default ${output_type} content available for this article` },
        { status: 400 }
      );
    }

    // Build personalization prompt
    const truetoneSettings = {
      tone_of_voice: userProfile.tone_of_voice,
      formality: userProfile.formality,
      humor: userProfile.humor,
      emotional_expression: userProfile.emotional_expression,
      detail_orientation: userProfile.detail_orientation,
      vocabulary: userProfile.vocabulary,
      content_length: userProfile.content_length,
      engagement_style: userProfile.engagement_style
    };

    const systemPrompt = `You are an AI assistant that personalizes ${output_type} content to match a user's unique communication style and TrueTone profile.

USER'S TRUETONE PROFILE:
- Tone of Voice: ${truetoneSettings.tone_of_voice}
- Formality: ${truetoneSettings.formality}
- Humor: ${truetoneSettings.humor}
- Emotional Expression: ${truetoneSettings.emotional_expression}
- Detail Orientation: ${truetoneSettings.detail_orientation}
- Vocabulary: ${truetoneSettings.vocabulary}
- Content Length: ${truetoneSettings.content_length}
- Engagement Style: ${truetoneSettings.engagement_style}

VOICE ANALYSIS INSIGHTS:
- User Persona: ${userProfile.user_persona || 'Not available'}
- Communication Style: ${JSON.stringify(userProfile.communication_style || {})}
- Speech Patterns: ${JSON.stringify(userProfile.speech_patterns || {})}
- Professional Indicators: ${JSON.stringify(userProfile.professional_indicators || {})}
- Unique Voice Markers: ${JSON.stringify(userProfile.unique_voice_markers || {})}

INSTRUCTIONS:
1. Rewrite the ${output_type} to match the user's authentic voice and communication style
2. Maintain all factual information and key points
3. Use their typical vocabulary and professional terminology
4. Match their sentence structure and communication patterns
5. Adjust formality, humor, and emotional expression as specified
6. Return only the personalized content, no explanations or meta-commentary
7. Keep the same format as the original (for social_content, return valid JSON)`;

    const userPrompt = `Please personalize this ${output_type} content for the mortgage/real estate industry:

ORIGINAL CONTENT:
${originalContent}

ARTICLE CONTEXT:
Title: ${article.title}
Summary: ${article.summary}
Topic: ${article.article_topic || 'General'}`;

    // Generate personalized content using streaming
    const result = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 2000,
      onFinish: async (completion) => {
        try {
          // Parse social_content as JSON if needed
          let personalizedContent = completion.text;
          if (output_type === 'social_content') {
            try {
              personalizedContent = JSON.parse(completion.text);
            } catch (e) {
              console.warn('Failed to parse social_content as JSON, storing as text');
            }
          }

          // Parse key_insights as array if needed
          if (output_type === 'key_insights') {
            // Convert bullet points back to array
            personalizedContent = completion.text
              .split('\n')
              .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
              .filter(line => line.length > 0);
          }

          // Create or update personalization record
          const updateData = {
            [`personalized_${output_type}`]: personalizedContent,
            truetone_settings: truetoneSettings,
            last_generated_at: new Date().toISOString(),
            tokens_used: completion.usage?.totalTokens || 0
          };

          if (existingPersonalization) {
            // Update existing
            updateData.generation_count = (existingPersonalization.generation_count || 0) + 1;

            await supabase
              .from('personalized_outputs')
              .update(updateData)
              .eq('id', existingPersonalization.id);
          } else {
            // Create new
            await supabase
              .from('personalized_outputs')
              .insert({
                user_id: user.id,
                article_id: article_id,
                generation_count: 1,
                created_at: new Date().toISOString(),
                ...updateData
              });
          }

          // Increment user's monthly usage
          await supabase
            .from('users')
            .update({
              monthly_generations_used: (user.monthly_generations_used || 0) + 1
            })
            .eq('id', user.id);

        } catch (error) {
          console.error('Failed to save personalization:', error);
        }
      }
    });

    return result.toAIStreamResponse();

  } catch (error) {
    console.error('Personalization API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}