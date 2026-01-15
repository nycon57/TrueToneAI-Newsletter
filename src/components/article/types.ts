/**
 * Shared types for article components
 */

export interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  industry?: string;
  category?: string;
  tags?: string[];
  content?: string;
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  defaultKeyInsights?: string[];
  defaultVideoScript?: string;
  defaultEmailTemplate?: string;
  is_personalized: boolean;
  tier: string;
  published_at: string;
  generation_stats?: {
    total: number;
    hasKeyInsights: boolean;
    hasVideoScript: boolean;
    hasEmailTemplate: boolean;
    hasSocialMedia: boolean;
    socialPlatforms: string[];
  };
  generation_ids?: {
    keyInsights?: string;
    videoScript?: string;
    emailTemplate?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

export interface GenerationStats {
  remaining: number;
  limit: number;
  tier: 'free' | 'paid' | 'premium';
  resetDate?: string;
}

export interface ContentSectionProps {
  article: Article;
  isAuthenticated: boolean;
  isPaid: boolean;
  generationStats: GenerationStats;
  cachedContent?: string;
  onGenerationSave: (contentType: string, content: string | Record<string, unknown>) => void;
  onGenerationComplete: () => void;
}
