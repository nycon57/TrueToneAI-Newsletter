'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/context/ArticleModalContext';

export interface ArticleModalHeaderProps {
  article: Article;
  onClose: () => void;
}

export function ArticleModalHeader({ article, onClose }: ArticleModalHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

  // Monitor scroll to make header sticky
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop > 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    const contentArea = document.querySelector('[data-article-content]');
    contentArea?.addEventListener('scroll', handleScroll);

    return () => {
      contentArea?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
        toast.success('Article shared!');
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share article');
      }
    }
  };

  const getCategoryInfo = () => {
    const topic = article.articleTopic?.toLowerCase() || '';

    if (topic.includes('rate')) {
      return { label: 'Rate Alert', color: 'bg-red-100 text-red-700 border-red-200' };
    } else if (topic.includes('program')) {
      return { label: 'Program Update', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    } else if (topic.includes('credit')) {
      return { label: 'Credit Update', color: 'bg-green-100 text-green-700 border-green-200' };
    } else if (topic.includes('market')) {
      return { label: 'Market News', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    }

    return { label: 'Market Update', color: 'bg-lavender/30 text-orchid border-lavender/50' };
  };

  const category = getCategoryInfo();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex-shrink-0 border-b border-gray-200 transition-all duration-200',
        isSticky ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Row - Navigation and Actions */}
        <div className="flex items-center justify-between mb-3">
          {/* Left - Back Button (Mobile) */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="lg:hidden -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Center - Title (Mobile, truncated) */}
          <h1
            id="article-modal-title"
            className={cn(
              'lg:hidden flex-1 mx-4 text-center',
              'text-base font-semibold text-gray-900 truncate'
            )}
          >
            {article.title}
          </h1>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Share article"
            >
              <Share2 className="w-5 h-5" />
            </Button>

            {/* Desktop Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="hidden lg:flex text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Title Row */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1
                id="article-modal-title"
                className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2"
              >
                {article.title}
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                {article.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mt-3 flex items-center gap-2">
          <Badge className={cn('px-3 py-1 text-xs font-medium border', category.color)}>
            {category.label}
          </Badge>

          {article.keyInsights && article.keyInsights.length > 0 && (
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {article.keyInsights.length} Key Insights
            </Badge>
          )}
        </div>
      </div>
    </motion.header>
  );
}
