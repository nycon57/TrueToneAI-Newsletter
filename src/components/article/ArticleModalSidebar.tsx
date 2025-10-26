'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PersonalizationActionCard } from './PersonalizationActionCard';
import type { Article } from '@/lib/context/ArticleModalContext';

export interface ArticleModalSidebarProps {
  article: Article;
  postId?: string;
  className?: string;
}

export function ArticleModalSidebar({ article, postId, className }: ArticleModalSidebarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Listen for scroll progress from content
  useEffect(() => {
    const handleScrollProgress = (e: Event) => {
      const customEvent = e as CustomEvent<{ progress: number }>;
      setScrollProgress(customEvent.detail.progress);
      setShowBackToTop(customEvent.detail.progress > 10);
    };

    window.addEventListener('article-scroll-progress', handleScrollProgress);

    return () => {
      window.removeEventListener('article-scroll-progress', handleScrollProgress);
    };
  }, []);

  const handleBackToTop = () => {
    const contentArea = document.querySelector('[data-article-content]');
    contentArea?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Define action cards based on available content
  const actions = [];

  if (article.videoScript) {
    actions.push({
      type: 'video' as const,
      content: article.videoScript,
    });
  }

  if (article.emailTemplate) {
    actions.push({
      type: 'email' as const,
      content: article.emailTemplate,
    });
  }

  if (article.socialContent) {
    actions.push({
      type: 'social' as const,
      content: article.socialContent,
    });
  }

  // Always add AI personalization option
  actions.push({
    type: 'ai' as const,
    content: null,
  });

  return (
    <aside
      className={cn(
        'w-80 xl:w-96 flex-shrink-0 border-l border-gray-200',
        'bg-gradient-to-b from-gray-50/50 to-white',
        className
      )}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Quick Actions</h2>
          <p className="text-sm text-gray-600">Personalize and share this content</p>
        </div>

        {/* Scrollable Action Cards */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PersonalizationActionCard
                  type={action.type}
                  content={action.content}
                  articleId={article.id}
                  postId={postId}
                />
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom Section - Reading Progress & Back to Top */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-white space-y-4">
          {/* Reading Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Reading Progress</span>
              <span className="text-xs font-semibold text-orchid">{Math.round(scrollProgress)}%</span>
            </div>
            <Progress
              value={scrollProgress}
              className="h-2 bg-gray-200"
              indicatorClassName="bg-gradient-to-r from-orchid to-indigo transition-all duration-300"
            />
          </div>

          {/* Back to Top Button */}
          <AnimatePresence>
            {showBackToTop && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={handleBackToTop}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-full',
                    'border-lavender/50 text-orchid hover:bg-lavender/20 hover:border-lavender',
                    'transition-all duration-200'
                  )}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Back to Top
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
