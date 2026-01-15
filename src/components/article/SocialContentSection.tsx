'use client';

import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';
import type { ContentSectionProps } from './types';

export function SocialContentSection({
  article,
  isAuthenticated,
  isPaid,
  generationStats,
  cachedContent,
  onGenerationSave,
  onGenerationComplete,
}: ContentSectionProps) {
  // Get platforms that have AI generations (from stats or cache)
  const aiPlatforms = article.generation_stats?.socialPlatforms || [];

  // Parse cached content if it's a string
  const cachedParsed: Record<string, string> = cachedContent
    ? (typeof cachedContent === 'string' ? JSON.parse(cachedContent) : cachedContent)
    : {};

  // Combine: AI platforms from stats + any newly cached platforms
  const allAIPlatforms = new Set([...aiPlatforms, ...Object.keys(cachedParsed)]);

  // Build AI content object - only include platforms that have AI generations
  const aiContent: Record<string, string> = {};
  allAIPlatforms.forEach(platform => {
    const platformKey = platform.toLowerCase() as keyof typeof article.socialContent;
    const content = cachedParsed[platform] || cachedParsed[platformKey] || article.socialContent?.[platformKey];
    if (content) {
      aiContent[platformKey] = content;
    }
  });

  const hasAIContent = Object.keys(aiContent).length > 0;

  return (
    <div className="mt-6 space-y-4">
      {isAuthenticated && (
        <SocialMediaGenerationPanel
          articleId={article.id}
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialResults={hasAIContent ? aiContent : undefined}
          defaultSocialContent={article.socialContent}
          onContentGenerated={(results) => onGenerationSave('social_platforms', JSON.stringify(results))}
          onGenerationComplete={onGenerationComplete}
        />
      )}
    </div>
  );
}
