'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '@/lib/motion';
import { Card, CardContent } from '@/components/ui/card';
import { useArticleModal } from '@/lib/context';
import { ArticleCardHeader } from './ArticleCardHeader';
import { ContentToolsGrid, type ContentSection } from './ContentToolsGrid';
import { KeyInsightsSection } from './KeyInsightsSection';
import { VideoScriptSection } from './VideoScriptSection';
import { EmailTemplateSection } from './EmailTemplateSection';
import { SocialContentSection } from './SocialContentSection';
import type { Article, GenerationStats } from './types';

// Re-export types for backwards compatibility
export type { Article } from './types';

interface ArticleCardProps {
  article: Article;
  isAuthenticated: boolean;
  isPaid: boolean;
  userGenerationStats?: GenerationStats;
  onGenerationComplete?: () => void;
}

export const ArticleCard = memo(function ArticleCard({
  article,
  isAuthenticated,
  isPaid,
  userGenerationStats,
  onGenerationComplete,
}: ArticleCardProps) {
  const [activeSection, setActiveSection] = useState<ContentSection>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { openArticle } = useArticleModal();

  // Cache generated content for each section
  const [cachedGenerations, setCachedGenerations] = useState<Record<string, string>>({});

  const handleReadFullArticle = useCallback(() => {
    openArticle(article.id, article);
  }, [openArticle, article]);

  // Default generation stats if not provided
  const generationStats: GenerationStats = userGenerationStats || {
    remaining: isPaid ? 25 : 3,
    limit: isPaid ? 25 : 3,
    tier: isPaid ? 'paid' : 'free',
    resetDate: undefined,
  };

  const handleGenerationComplete = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    onGenerationComplete?.();
  }, [onGenerationComplete]);

  const handleGenerationSave = useCallback((contentType: string, content: string | Record<string, unknown>) => {
    const stringValue = typeof content === 'string' ? content : JSON.stringify(content);
    setCachedGenerations(prev => ({
      ...prev,
      [contentType]: stringValue,
    }));
  }, []);

  // Shared props for content sections
  const contentSectionProps = {
    article,
    isAuthenticated,
    isPaid,
    generationStats,
    onGenerationSave: handleGenerationSave,
    onGenerationComplete: handleGenerationComplete,
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={springs.card}
    >
      <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <ArticleCardHeader
            article={article}
            onReadFullArticle={handleReadFullArticle}
          />

          <ContentToolsGrid
            article={article}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Render active section with AnimatePresence */}
          <AnimatePresence mode="wait">
            {activeSection === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <KeyInsightsSection
                  {...contentSectionProps}
                  cachedContent={cachedGenerations['key_insights']}
                />
              </motion.div>
            )}
            {activeSection === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <VideoScriptSection
                  {...contentSectionProps}
                  cachedContent={cachedGenerations['video_script']}
                />
              </motion.div>
            )}
            {activeSection === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <EmailTemplateSection
                  {...contentSectionProps}
                  cachedContent={cachedGenerations['email_template']}
                />
              </motion.div>
            )}
            {activeSection === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <SocialContentSection
                  {...contentSectionProps}
                  cachedContent={cachedGenerations['social_platforms']}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ArticleCard.displayName = 'ArticleCard';
