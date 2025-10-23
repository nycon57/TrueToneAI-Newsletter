import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
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
    const { articleId, contentType, generatedContent } = await req.json();

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

    const truetoneSettings = userProfile ? {
      tone_of_voice: userProfile.tone_of_voice,
      formality: userProfile.formality,
      humor: userProfile.humor,
      emotional_expression: userProfile.emotional_expression,
      detail_orientation: userProfile.detail_orientation,
      vocabulary: userProfile.vocabulary,
      content_length: userProfile.content_length,
      engagement_style: userProfile.engagement_style
    } : null;

    // Map content type to database field name
    const fieldMap: Record<string, string> = {
      'key_insights': 'personalized_key_insights',
      'video_script': 'personalized_video_script',
      'email_template': 'personalized_email_template',
      'social_content': 'personalized_social_content'
    };

    const fieldName = fieldMap[contentType];

    // Parse content if it's JSON type
    let parsedContent = generatedContent;
    if (contentType === 'key_insights') {
      // Ensure it's an array
      if (typeof generatedContent === 'string') {
        try {
          parsedContent = JSON.parse(generatedContent);
        } catch {
          // If not valid JSON, split by newlines
          parsedContent = generatedContent
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => line.replace(/^[-*•]\s*/, '').trim());
        }
      }
    } else if (contentType === 'social_content') {
      // Ensure it's an object
      if (typeof generatedContent === 'string') {
        try {
          parsedContent = JSON.parse(generatedContent);
        } catch {
          // If not valid JSON, create default structure
          parsedContent = {
            facebook: generatedContent,
            instagram: generatedContent,
            twitter: generatedContent,
            linkedin: generatedContent
          };
        }
      }
    }

    // Check if personalization already exists
    const { data: existing } = await supabase
      .from('personalized_outputs')
      .select('id, generation_count')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .single();

    const now = new Date().toISOString();

    if (existing) {
      // For social_content, merge with existing data instead of overwriting
      let updateContent = parsedContent;
      if (contentType === 'social_content' && typeof parsedContent === 'object') {
        // Fetch existing social content to merge
        const { data: existingData } = await supabase
          .from('personalized_outputs')
          .select(fieldName)
          .eq('id', existing.id)
          .single();

        if (existingData && existingData[fieldName]) {
          // Merge new platforms with existing ones
          updateContent = {
            ...existingData[fieldName],
            ...parsedContent
          };
        }
      }

      // Update existing record
      const { data, error } = await supabase
        .from('personalized_outputs')
        .update({
          [fieldName]: updateContent,
          truetone_settings: truetoneSettings,
          last_generated_at: now,
          generation_count: (existing.generation_count || 0) + 1
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
        message: 'Generation saved successfully',
        is_update: true
      });
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('personalized_outputs')
        .insert({
          user_id: user.id,
          article_id: articleId,
          [fieldName]: parsedContent,
          truetone_settings: truetoneSettings,
          last_generated_at: now,
          created_at: now,
          generation_count: 1
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
