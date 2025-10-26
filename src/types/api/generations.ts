/**
 * API types for Generation endpoints
 * Used for updating AI-generated content
 */

/**
 * PATCH /api/generations/[id]
 * Update an existing generation record with edited content
 */

export interface UpdateGenerationRequest {
  /** Text content for VIDEO_SCRIPT, EMAIL_TEMPLATE, SOCIAL_MEDIA */
  content?: string;

  /** Array content for KEY_INSIGHTS */
  content_array?: string[];

  /** Social media platform (only used for validation, cannot be changed) */
  platform?: string;
}

export interface UpdateGenerationResponse {
  success: true;
  generation: {
    id: string;
    content: string | null;
    content_array: string[] | null;
    updated_at: string;
  };
}

export interface UpdateGenerationErrorResponse {
  error: string;
  current_length?: number;
  max_length?: number;
}

/**
 * Social media character limits by platform
 */
export const SOCIAL_MEDIA_CHARACTER_LIMITS = {
  twitter: 280,
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
} as const;

export type SocialPlatform = keyof typeof SOCIAL_MEDIA_CHARACTER_LIMITS;

/**
 * Generation content types
 */
export type GenerationContentType =
  | 'KEY_INSIGHTS'
  | 'VIDEO_SCRIPT'
  | 'EMAIL_TEMPLATE'
  | 'SOCIAL_MEDIA';

/**
 * Validation helpers
 */

export function validateKeyInsights(insights: unknown): insights is string[] {
  if (!Array.isArray(insights)) return false;
  if (insights.length === 0) return false;
  return insights.every(insight =>
    typeof insight === 'string' && insight.trim().length > 0
  );
}

export function validateContent(content: unknown): content is string {
  return typeof content === 'string' && content.trim().length > 0;
}

export function validateSocialMediaContent(
  content: string,
  platform: string
): { valid: boolean; error?: string; currentLength?: number; maxLength?: number } {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return { valid: false, error: 'Content cannot be empty' };
  }

  const platformLower = platform.toLowerCase() as SocialPlatform;
  const limit = SOCIAL_MEDIA_CHARACTER_LIMITS[platformLower];

  if (!limit) {
    return { valid: true }; // Unknown platform, skip validation
  }

  if (trimmedContent.length > limit) {
    return {
      valid: false,
      error: `Content exceeds ${platform} character limit of ${limit}`,
      currentLength: trimmedContent.length,
      maxLength: limit
    };
  }

  return { valid: true };
}

/**
 * Type guards
 */

export function isUpdateGenerationRequest(data: unknown): data is UpdateGenerationRequest {
  if (typeof data !== 'object' || data === null) return false;

  const req = data as UpdateGenerationRequest;

  // At least one field must be present
  if (req.content === undefined && req.content_array === undefined) {
    return false;
  }

  // If content is present, it must be a string
  if (req.content !== undefined && typeof req.content !== 'string') {
    return false;
  }

  // If content_array is present, it must be an array of strings
  if (req.content_array !== undefined && !validateKeyInsights(req.content_array)) {
    return false;
  }

  return true;
}
