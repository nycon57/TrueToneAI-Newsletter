/**
 * Social Media Platform-Specific Generation Types
 *
 * Type definitions for the new platform-specific social media content generation API
 */

import { SocialPlatform } from './social-media';

/**
 * Request schema for platform-specific social media generation
 */
export interface PlatformSpecificGenerationRequest {
  articleId: string;
  platforms: SocialPlatform[]; // 1-4 platforms to generate
  regenerate?: boolean; // If true, this is a regeneration request
  customInstructions?: string; // Optional user instructions
}

/**
 * Response schema for streaming platform-specific generation
 * Streamed as Server-Sent Events (SSE) or newline-delimited JSON
 */
export interface PlatformGenerationStreamEvent {
  type: 'platform_start' | 'platform_chunk' | 'platform_complete' | 'all_complete' | 'error' | 'usage_update';
  platform?: SocialPlatform;
  chunk?: string; // Partial content for streaming
  content?: string; // Final content when complete
  error?: string; // Error message if type is 'error'
  generationsUsed?: number; // Number of generations consumed
  generationsRemaining?: number; // Remaining generations
  timestamp: string;
}

/**
 * Final response after all platforms complete
 */
export interface PlatformGenerationResponse {
  success: boolean;
  results: Partial<Record<SocialPlatform, string>>; // Partial because some may fail
  errors: Partial<Record<SocialPlatform, string>>; // Per-platform errors
  generationsUsed: number; // Total generations consumed (1 per platform)
  generationsRemaining: number;
  metadata: {
    generatedAt: string;
    modelUsed: string;
    tokensUsed: number;
    platformsRequested: number;
    platformsSucceeded: number;
    platformsFailed: number;
  };
}

/**
 * Platform-specific generation configuration
 */
export interface PlatformGenerationConfig {
  platform: SocialPlatform;
  maxChars: number;
  idealChars: number;
  tone: string;
  style: string;
  specialInstructions: string;
}

/**
 * Platform character limits and guidelines
 */
export const PLATFORM_LIMITS: Record<SocialPlatform, {
  max: number;
  ideal: number;
  hard: number; // Hard limit that should never be exceeded
}> = {
  facebook: {
    max: 500, // Practical limit for engagement
    ideal: 250,
    hard: 63206
  },
  instagram: {
    max: 300, // Practical limit for captions
    ideal: 150,
    hard: 2200
  },
  twitter: {
    max: 280,
    ideal: 240,
    hard: 280
  },
  linkedin: {
    max: 1300, // Practical limit for engagement
    ideal: 700,
    hard: 3000
  }
};

/**
 * Platform-specific style guidelines
 */
export const PLATFORM_STYLES: Record<SocialPlatform, {
  tone: string;
  hook: string;
  cta: string;
  emojis: 'none' | 'minimal' | 'moderate' | 'frequent';
  hashtags: boolean;
  hashtagCount?: string;
}> = {
  facebook: {
    tone: 'Conversational and community-focused',
    hook: 'Start with a question or relatable statement',
    cta: 'Encourage comments, shares, or reaching out',
    emojis: 'moderate',
    hashtags: false
  },
  instagram: {
    tone: 'Visual-first, authentic, and aspirational',
    hook: 'Engaging opening that complements visuals',
    cta: 'Call to action in bio link or DM',
    emojis: 'moderate',
    hashtags: true,
    hashtagCount: '5-10 relevant hashtags'
  },
  twitter: {
    tone: 'Punchy, direct, and timely',
    hook: 'Hook in first 7 words',
    cta: 'Drive engagement with questions or strong statements',
    emojis: 'minimal',
    hashtags: true,
    hashtagCount: '1-2 hashtags max'
  },
  linkedin: {
    tone: 'Professional, thought leadership, and industry-focused',
    hook: 'Lead with insights or data',
    cta: 'End with thought-provoking question',
    emojis: 'minimal',
    hashtags: true,
    hashtagCount: '3-5 professional hashtags'
  }
};

/**
 * Generation queue item for parallel processing
 */
export interface GenerationQueueItem {
  platform: SocialPlatform;
  articleId: string;
  userProfile: Record<string, unknown>;
  article: Record<string, unknown>;
  attempt: number;
  maxAttempts: number;
}

/**
 * Generation result for internal tracking
 */
export interface GenerationResult {
  platform: SocialPlatform;
  success: boolean;
  content?: string;
  error?: string;
  tokensUsed?: number;
  generatedAt: string;
  duration: number; // Generation time in ms
}

/**
 * Usage tracking for multi-platform generation
 */
export interface MultiPlatformUsageTrack {
  userId?: string;
  sessionId?: string;
  platformsRequested: SocialPlatform[];
  platformsProcessed: SocialPlatform[];
  generationsConsumed: number;
  startedAt: string;
  completedAt?: string;
  errors: string[];
}
