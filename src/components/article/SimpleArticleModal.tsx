'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/context/ArticleModalContext';

export interface SimpleArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleArticleModal({ article, isOpen, onClose }: SimpleArticleModalProps) {
  // Handle ESC key press
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Add ESC key listener and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!article) return null;

  // Use article content or create from summary and insights
  const articleContent = article.content || `## Overview\n\n${article.summary || 'No content available.'}\n\n## Key Insights\n\n${article.keyInsights?.map(insight => `- ${insight}`).join('\n') || 'No insights available.'}`;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'relative z-10 flex flex-col',
              'w-full h-full',
              'md:w-[95vw] md:h-[95vh] md:max-w-4xl md:rounded-2xl',
              'bg-white shadow-2xl overflow-hidden'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-4 right-4 z-30',
                'w-10 h-10 rounded-full',
                'bg-white/90 backdrop-blur-sm',
                'border border-gray-200',
                'flex items-center justify-center',
                'text-gray-600 hover:text-gray-900',
                'transition-colors duration-200',
                'shadow-md hover:shadow-lg'
              )}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {article.title}
                  </h1>
                  {article.summary && (
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                      {article.summary}
                    </p>
                  )}
                </motion.div>

                {/* Key Insights Callout */}
                {article.keyInsights && article.keyInsights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                  >
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-amber-100 rounded-xl">
                          <Lightbulb className="w-6 h-6 text-amber-700" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Quick Takeaways</h3>
                      </div>

                      <div className="space-y-4">
                        {article.keyInsights.map((insight, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-gray-800 leading-relaxed text-base sm:text-lg font-medium">
                              {insight}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Main Article Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="article-content"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleContent}</ReactMarkdown>
                </motion.div>

                {/* Bottom Spacing */}
                <div className="h-20" />
              </article>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
