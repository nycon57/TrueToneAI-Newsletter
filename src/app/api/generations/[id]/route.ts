import { NextRequest, NextResponse } from 'next/server';
import { getCachedApiUserSafe } from '@/lib/api/auth-cached';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/generations/[id]
 *
 * Updates an existing generation record with edited content.
 * Users can only update their own generations.
 *
 * Request body:
 * - content?: string - For VIDEO_SCRIPT, EMAIL_TEMPLATE, SOCIAL_MEDIA
 * - content_array?: string[] - For KEY_INSIGHTS
 * - platform?: string - For SOCIAL_MEDIA (facebook, linkedin, twitter, instagram)
 *
 * Response:
 * - success: boolean
 * - generation: { id, content, content_array, updated_at }
 *
 * Error codes:
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 403: Not authorized (generation doesn't belong to user)
 * - 404: Generation not found
 * - 500: Database error
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const user = await getCachedApiUserSafe();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract generation ID from route params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { content, content_array } = body;

    // Validate that at least one field is being updated
    if (content === undefined && content_array === undefined) {
      return NextResponse.json(
        { error: 'Either content or content_array must be provided' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the existing generation to verify ownership and content type
    const { data: existingGeneration, error: fetchError } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingGeneration) {
      console.error('[UpdateGeneration] Generation not found:', { id, error: fetchError });
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Verify user owns this generation
    if (existingGeneration.user_id !== user.id) {
      console.warn('[UpdateGeneration] Unauthorized access attempt:', {
        generationId: id,
        userId: user.id,
        ownerId: existingGeneration.user_id
      });
      return NextResponse.json(
        { error: 'Not authorized to update this generation' },
        { status: 403 }
      );
    }

    // Validate content based on content type
    const contentType = existingGeneration.content_type;

    // Prepare update data
    const updateData: {
      content?: string | null;
      content_array?: string[];
    } = {};

    // Validate and set content based on type
    if (contentType === 'KEY_INSIGHTS') {
      // KEY_INSIGHTS requires content_array
      if (content_array !== undefined) {
        if (!Array.isArray(content_array)) {
          return NextResponse.json(
            { error: 'content_array must be an array for KEY_INSIGHTS type' },
            { status: 400 }
          );
        }

        if (content_array.length === 0) {
          return NextResponse.json(
            { error: 'content_array cannot be empty' },
            { status: 400 }
          );
        }

        // Validate each insight is a non-empty string
        const invalidInsights = content_array.filter(
          insight => typeof insight !== 'string' || !insight.trim()
        );

        if (invalidInsights.length > 0) {
          return NextResponse.json(
            { error: 'All insights must be non-empty strings' },
            { status: 400 }
          );
        }

        updateData.content_array = content_array.map(insight => insight.trim());
      } else {
        return NextResponse.json(
          { error: 'content_array is required for KEY_INSIGHTS type' },
          { status: 400 }
        );
      }
    } else {
      // VIDEO_SCRIPT, EMAIL_TEMPLATE, SOCIAL_MEDIA require content string
      if (content !== undefined) {
        if (typeof content !== 'string') {
          return NextResponse.json(
            { error: 'content must be a string' },
            { status: 400 }
          );
        }

        const trimmedContent = content.trim();

        if (!trimmedContent) {
          return NextResponse.json(
            { error: 'content cannot be empty' },
            { status: 400 }
          );
        }

        // Validate character limits for social media
        if (contentType === 'SOCIAL_MEDIA') {
          const platform = existingGeneration.platform?.toLowerCase();
          const characterLimits: Record<string, number> = {
            twitter: 280,
            facebook: 63206,
            instagram: 2200,
            linkedin: 3000
          };

          const limit = platform && characterLimits[platform];
          if (limit && trimmedContent.length > limit) {
            return NextResponse.json(
              {
                error: `Content exceeds ${platform} character limit of ${limit}`,
                current_length: trimmedContent.length,
                max_length: limit
              },
              { status: 400 }
            );
          }
        }

        updateData.content = trimmedContent;
      } else {
        return NextResponse.json(
          { error: `content is required for ${contentType} type` },
          { status: 400 }
        );
      }
    }

    // Update the generation
    const { data: updatedGeneration, error: updateError } = await supabase
      .from('generations')
      .update(updateData)
      .eq('id', id)
      .select('id, content, content_array, generated_at')
      .single();

    if (updateError) {
      console.error('[UpdateGeneration] Database update error:', {
        generationId: id,
        error: updateError.message,
        code: updateError.code
      });

      return NextResponse.json(
        { error: 'Failed to update generation' },
        { status: 500 }
      );
    }

    // Log successful update for analytics
    console.log('[UpdateGeneration] Successfully updated generation:', {
      generationId: id,
      userId: user.id,
      contentType,
      hasContent: !!updateData.content,
      hasContentArray: !!updateData.content_array,
      contentLength: updateData.content?.length,
      arrayLength: updateData.content_array?.length
    });

    return NextResponse.json({
      success: true,
      generation: {
        id: updatedGeneration.id,
        content: updatedGeneration.content,
        content_array: updatedGeneration.content_array,
        updated_at: updatedGeneration.generated_at
      }
    });

  } catch (error) {
    console.error('[UpdateGeneration] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
