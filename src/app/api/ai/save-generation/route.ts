import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/utils/rateLimit';

/**
 * POST /api/ai/save-generation
 *
 * Saves AI-generated content to the Generation table.
 * Each generation is stored as a separate record for better querying.
 *
 * Request body:
 * - articleId: string - ID of the article
 * - contentType: 'key_insights' | 'video_script' | 'email_template' | 'social_content'
 * - generatedContent: string | string[] | object - The generated content
 * - platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin' - For social content
 */
export async function POST(req: NextRequest) {
  // Apply rate limiting
  const clientId = getClientIdentifier(req, 'ai-save-generation');
  if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.AI_SAVE_GENERATION)) {
    const headers = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.AI_SAVE_GENERATION);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    );
  }

  try {
    // Authenticate user
    const user = await getApiUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const { articleId, contentType, generatedContent, platform } = await req.json();

    if (!articleId || !contentType || !generatedContent) {
      return NextResponse.json(
        { error: 'articleId, contentType, and generatedContent are required' },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = ['key_insights', 'video_script', 'email_template', 'social_content'];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: `Invalid contentType. Must be one of: ${validContentTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // For social_content, platform is required
    if (contentType === 'social_content' && !platform) {
      return NextResponse.json(
        { error: 'platform is required for social_content type' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify article exists
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('id')
      .eq('id', articleId)
      .single();

    if (articleError || !article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get user's TrueTone profile for snapshot
    const { data: userProfile } = await supabase
      .from('users')
      .select('tone_of_voice, formality, humor, emotional_expression, detail_orientation, vocabulary, content_length, engagement_style')
      .eq('id', user.id)
      .single();

    const truetoneSnapshot = userProfile ? {
      tone_of_voice: userProfile.tone_of_voice,
      formality: userProfile.formality,
      humor: userProfile.humor,
      emotional_expression: userProfile.emotional_expression,
      detail_orientation: userProfile.detail_orientation,
      vocabulary: userProfile.vocabulary,
      content_length: userProfile.content_length,
      engagement_style: userProfile.engagement_style
    } : null;

    // Map content type to database enum
    const contentTypeMap: Record<string, string> = {
      'key_insights': 'KEY_INSIGHTS',
      'video_script': 'VIDEO_SCRIPT',
      'email_template': 'EMAIL_TEMPLATE',
      'social_content': 'SOCIAL_MEDIA'
    };

    const dbContentType = contentTypeMap[contentType];

    // Map platform to database enum
    const platformMap: Record<string, string> = {
      'facebook': 'FACEBOOK',
      'instagram': 'INSTAGRAM',
      'twitter': 'TWITTER',
      'linkedin': 'LINKEDIN'
    };

    const dbPlatform = platform ? platformMap[platform.toLowerCase()] : null;

    // Parse and prepare content
    let content: string | null = null;
    let contentArray: string[] = [];

    if (contentType === 'key_insights') {
      // Key insights should be an array
      if (typeof generatedContent === 'string') {
        try {
          contentArray = JSON.parse(generatedContent);
        } catch {
          // If not valid JSON, split by newlines
          contentArray = generatedContent
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => line.replace(/^[-*•]\s*/, '').trim());
        }
      } else if (Array.isArray(generatedContent)) {
        contentArray = generatedContent;
      }
    } else {
      // Other types are strings
      content = typeof generatedContent === 'string'
        ? generatedContent
        : JSON.stringify(generatedContent);
    }

    // Check if generation already exists for this user, article, content type, and platform
    const { data: existing } = await supabase
      .from('generations')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .eq('content_type', dbContentType)
      .eq('platform', dbPlatform)
      .maybeSingle();

    if (existing) {
      // Update existing generation
      const { data, error } = await supabase
        .from('generations')
        .update({
          content,
          content_array: contentArray,
          truetone_snapshot: truetoneSnapshot,
          generated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('[SaveGeneration] Update error:', error);
        return NextResponse.json(
          { error: 'Failed to save generation' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        saved_id: data.id,
        message: 'Generation updated successfully',
        is_update: true
      });
    } else {
      // Create new generation record
      const { data, error } = await supabase
        .from('generations')
        .insert({
          user_id: user.id,
          article_id: articleId,
          content_type: dbContentType,
          platform: dbPlatform,
          content,
          content_array: contentArray,
          truetone_snapshot: truetoneSnapshot,
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('[SaveGeneration] Insert error:', error);
        return NextResponse.json(
          { error: 'Failed to save generation' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        saved_id: data.id,
        message: 'Generation saved successfully',
        is_update: false
      });
    }

  } catch (error) {
    console.error('[SaveGeneration] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
