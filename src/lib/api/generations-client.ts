/**
 * Client-side API helpers for Generation endpoints
 */

import type {
  UpdateGenerationRequest,
  UpdateGenerationResponse,
  UpdateGenerationErrorResponse
} from '@/types/api/generations';

/**
 * Updates a generation record with edited content
 *
 * @param generationId - The ID of the generation to update
 * @param data - The update data (content or content_array)
 * @returns The updated generation data
 * @throws Error if the request fails
 *
 * @example
 * // Update video script
 * const result = await updateGeneration('gen-123', {
 *   content: 'Updated video script content'
 * });
 *
 * @example
 * // Update key insights
 * const result = await updateGeneration('gen-456', {
 *   content_array: ['Insight 1', 'Insight 2', 'Insight 3']
 * });
 */
export async function updateGeneration(
  generationId: string,
  data: UpdateGenerationRequest
): Promise<UpdateGenerationResponse> {
  const response = await fetch(`/api/generations/${generationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as UpdateGenerationErrorResponse;
    throw new Error(error.error || 'Failed to update generation');
  }

  return result as UpdateGenerationResponse;
}

/**
 * Updates a video script generation
 *
 * @param generationId - The ID of the generation to update
 * @param content - The updated video script content
 * @returns The updated generation data
 *
 * @example
 * const result = await updateVideoScript('gen-123', 'Hey everyone! Breaking news...');
 */
export async function updateVideoScript(
  generationId: string,
  content: string
): Promise<UpdateGenerationResponse> {
  return updateGeneration(generationId, { content });
}

/**
 * Updates an email template generation
 *
 * @param generationId - The ID of the generation to update
 * @param content - The updated email template content
 * @returns The updated generation data
 *
 * @example
 * const result = await updateEmailTemplate('gen-123', 'Subject: Great News!\n\nDear...');
 */
export async function updateEmailTemplate(
  generationId: string,
  content: string
): Promise<UpdateGenerationResponse> {
  return updateGeneration(generationId, { content });
}

/**
 * Updates a social media post generation
 *
 * @param generationId - The ID of the generation to update
 * @param content - The updated social media post content
 * @returns The updated generation data
 *
 * @example
 * const result = await updateSocialMediaPost('gen-123', 'BREAKING: The Fed just cut rates...');
 */
export async function updateSocialMediaPost(
  generationId: string,
  content: string
): Promise<UpdateGenerationResponse> {
  return updateGeneration(generationId, { content });
}

/**
 * Updates key insights generation
 *
 * @param generationId - The ID of the generation to update
 * @param insights - Array of key insights
 * @returns The updated generation data
 *
 * @example
 * const result = await updateKeyInsights('gen-123', [
 *   'First key insight',
 *   'Second key insight',
 *   'Third key insight'
 * ]);
 */
export async function updateKeyInsights(
  generationId: string,
  insights: string[]
): Promise<UpdateGenerationResponse> {
  return updateGeneration(generationId, { content_array: insights });
}

/**
 * Type-safe error handler for generation updates
 *
 * @param error - The error to handle
 * @returns A user-friendly error message
 *
 * @example
 * try {
 *   await updateGeneration('gen-123', { content: '...' });
 * } catch (error) {
 *   const message = handleGenerationUpdateError(error);
 *   toast.error(message);
 * }
 */
export function handleGenerationUpdateError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('authentication required')) {
      return 'Please log in to edit this content';
    }

    if (message.includes('not authorized')) {
      return 'You do not have permission to edit this content';
    }

    if (message.includes('not found')) {
      return 'Content not found. Please refresh and try again.';
    }

    if (message.includes('character limit')) {
      return error.message; // Return the specific character limit error
    }

    if (message.includes('empty')) {
      return 'Content cannot be empty';
    }

    return error.message;
  }

  return 'Failed to save changes. Please try again.';
}

/**
 * Validates content before sending to API
 * Useful for client-side validation before making API calls
 *
 * @param content - Content to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * const validation = validateContentBeforeSave(editorContent);
 * if (!validation.valid) {
 *   toast.error(validation.error);
 *   return;
 * }
 * await updateGeneration('gen-123', { content: editorContent });
 */
export function validateContentBeforeSave(content: string | string[]): {
  valid: boolean;
  error?: string;
} {
  if (typeof content === 'string') {
    const trimmed = content.trim();
    if (!trimmed) {
      return { valid: false, error: 'Content cannot be empty' };
    }
    return { valid: true };
  }

  if (Array.isArray(content)) {
    if (content.length === 0) {
      return { valid: false, error: 'At least one insight is required' };
    }

    const hasEmptyInsight = content.some(
      insight => typeof insight !== 'string' || !insight.trim()
    );

    if (hasEmptyInsight) {
      return { valid: false, error: 'All insights must have content' };
    }

    return { valid: true };
  }

  return { valid: false, error: 'Invalid content format' };
}
