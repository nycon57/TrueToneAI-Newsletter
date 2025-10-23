/**
 * Social Media Platform Types
 *
 * Type definitions for social media content generation and management
 */

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

/**
 * Platform-specific configuration
 */
export interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  displayName: string;
  gradient: string;
  hoverGradient: string;
  maxChars: number;
  description: string;
  tone?: string;
  hashtagsRecommended?: boolean;
}

/**
 * Social media content result
 */
export interface SocialMediaContent {
  platform: SocialPlatform;
  content: string;
  charCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Generation request payload
 */
export interface SocialMediaGenerationRequest {
  articleId: string;
  platforms: SocialPlatform[];
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative';
  includeHashtags?: boolean;
  customInstructions?: string;
}

/**
 * Generation response from API
 */
export interface SocialMediaGenerationResponse {
  success: boolean;
  results: Record<SocialPlatform, string>;
  generationsRemaining: number;
  metadata?: {
    generatedAt: string;
    modelUsed: string;
    tokensUsed?: number;
  };
}

/**
 * Saved social media content in database
 */
export interface SavedSocialContent {
  id: string;
  articleId: string;
  userId: string;
  content: Record<SocialPlatform, string>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Component props for SocialPlatformSelector
 */
export interface SocialPlatformSelectorProps {
  onPlatformsChange: (platforms: SocialPlatform[]) => void;
  selectedPlatforms?: SocialPlatform[];
  disabled?: boolean;
  className?: string;
  showDescriptions?: boolean;
  compact?: boolean;
}

/**
 * Component props for SocialPlatformResults
 */
export interface SocialPlatformResultsProps {
  results: Record<SocialPlatform, string>;
  onCopy: (platform: SocialPlatform, content: string) => void;
  onRegenerate: (platform: SocialPlatform) => void;
  onSave: (platform: SocialPlatform, content: string) => Promise<void>;
  savedPlatforms?: Set<SocialPlatform>;
  regeneratingPlatforms?: Set<SocialPlatform>;
  isSaving?: boolean;
  isSaved?: boolean;
  onSaveAll?: () => void;
  className?: string;
  showCharacterCount?: boolean;
  enableEditing?: boolean;
  onEdit?: (platform: SocialPlatform, newContent: string) => void;
}

/**
 * User tier for generation limits
 */
export type UserTier = 'free' | 'paid' | 'premium';

/**
 * Generation limits by tier
 */
export interface GenerationLimits {
  tier: UserTier;
  monthlyLimit: number;
  used: number;
  remaining: number;
  resetDate: Date;
}

/**
 * Platform-specific content guidelines
 */
export const PLATFORM_GUIDELINES: Record<SocialPlatform, {
  maxChars: number;
  idealChars: number;
  tone: string[];
  features: string[];
}> = {
  facebook: {
    maxChars: 63206,
    idealChars: 250,
    tone: ['conversational', 'engaging', 'community-focused'],
    features: ['long-form', 'links', 'images', 'videos', 'polls']
  },
  instagram: {
    maxChars: 2200,
    idealChars: 150,
    tone: ['visual', 'aspirational', 'authentic'],
    features: ['hashtags', 'emojis', 'visual-first', 'stories']
  },
  twitter: {
    maxChars: 280,
    idealChars: 240,
    tone: ['concise', 'timely', 'conversational'],
    features: ['threads', 'hashtags', 'mentions', 'short-form']
  },
  linkedin: {
    maxChars: 3000,
    idealChars: 1300,
    tone: ['professional', 'thought-leadership', 'industry-focused'],
    features: ['articles', 'professional-network', 'b2b-focus']
  }
};
