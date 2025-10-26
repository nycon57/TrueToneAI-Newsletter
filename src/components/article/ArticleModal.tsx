'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArticleModalHeader } from './ArticleModalHeader';
import { ArticleModalContent } from './ArticleModalContent';
import { ArticleModalSidebar } from './ArticleModalSidebar';
import type { Article } from '@/lib/context/ArticleModalContext';

export interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
}

export function ArticleModal({ article, isOpen, onClose, postId }: ArticleModalProps) {
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

  // Add ESC key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!article) return null;

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
              'md:w-[95vw] md:h-[95vh] md:max-w-7xl md:rounded-2xl',
              'bg-white shadow-2xl overflow-hidden'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
          >
            {/* Header */}
            <ArticleModalHeader article={article} onClose={onClose} />

            {/* Content Area - Desktop: 2-column, Mobile: Full width */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <ArticleModalContent article={article} />
              </div>

              {/* Sidebar - Desktop: Sticky sidebar, Tablet/Mobile: Hidden (use bottom sheet) */}
              <ArticleModalSidebar article={article} postId={postId} className="hidden lg:flex" />
            </div>

            {/* Mobile/Tablet Floating Action Button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-20">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'w-14 h-14 rounded-full',
                  'bg-gradient-to-r from-orchid to-indigo',
                  'text-white shadow-lg hover:shadow-xl',
                  'flex items-center justify-center',
                  'transition-all duration-200 hover:scale-110'
                )}
                onClick={() => {
                  // TODO: Implement mobile action sheet
                  console.log('Open mobile action sheet');
                }}
                aria-label="View actions"
              >
                <span className="text-2xl font-bold">+</span>
              </motion.button>
            </div>

            {/* Close button for mobile (X in top right) */}
            <button
              onClick={onClose}
              className={cn(
                'lg:hidden absolute top-4 right-4 z-30',
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
