'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Video, Mail, Share2, Sparkles, Tag, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCategoryById } from '@/lib/constants/categories';
import { ArticleStickyFooter } from './ArticleStickyFooter';
import { ArticleContentView } from './ArticleContentView';
import { VideoContentView } from './VideoContentView';
import { EmailContentView } from './EmailContentView';
import { SocialContentView } from './SocialContentView';

type ContentView = 'article' | 'video' | 'email' | 'social' | 'ai';

interface Article {
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
}

interface MorphingArticleCardProps {
  article: Article;
  isAuthenticated: boolean;
  isPaid: boolean;
  userGenerationStats?: {
    remaining: number;
    limit: number;
    tier: 'free' | 'paid' | 'premium';
    resetDate?: string;
  };
}

export function MorphingArticleCard({
  article,
  isAuthenticated,
  isPaid,
  userGenerationStats,
}: MorphingArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<ContentView>('article');
  const [cachedGenerations, setCachedGenerations] = useState<Record<string, string>>({});

  // Default generation stats if not provided
  const generationStats = userGenerationStats || {
    remaining: isPaid ? 25 : 3,
    limit: isPaid ? 25 : 3,
    tier: (isPaid ? 'paid' : 'free') as 'free' | 'paid' | 'premium',
    resetDate: undefined
  };

  // Handle expanding the card to show full article
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setActiveView('article');
  }, []);

  // Handle collapsing the card
  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setActiveView('article');
  }, []);

  // Handle ESC key press
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleCollapse();
      }
    },
    [isExpanded, handleCollapse]
  );

  // Handle backdrop click (mobile only)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && isExpanded) {
        handleCollapse();
      }
    },
    [isExpanded, handleCollapse]
  );

  // Add ESC key listener and prevent body scroll on mobile when expanded
  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll on mobile
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded, handleEscape]);

  // Handle saving generated content to cache
  const handleGenerationSave = (contentType: string, content: string | Record<string, any>) => {
    const stringValue = typeof content === 'string' ? content : JSON.stringify(content);
    setCachedGenerations(prev => ({
      ...prev,
      [contentType]: stringValue
    }));
  };

  // Category styling
  const getCategoryStyle = () => {
    return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
  };

  // Determine content to display based on active view
  const renderContentView = () => {
    switch (activeView) {
      case 'article':
        return (
          <ArticleContentView
            title={article.title}
            summary={article.summary}
            content={article.content}
            keyInsights={article.keyInsights}
          />
        );
      case 'video':
        return (
          <VideoContentView
            articleId={article.id}
            initialContent={cachedGenerations['video_script'] || article.videoScript}
            hasExistingGeneration={article.generation_stats?.hasVideoScript || false}
            userTier={generationStats.tier}
            remainingGenerations={generationStats.remaining}
            onContentGenerated={(content) => handleGenerationSave('video_script', content)}
          />
        );
      case 'email':
        return (
          <EmailContentView
            articleId={article.id}
            initialContent={cachedGenerations['email_template'] || article.emailTemplate}
            hasExistingGeneration={article.generation_stats?.hasEmailTemplate || false}
            userTier={generationStats.tier}
            remainingGenerations={generationStats.remaining}
            onContentGenerated={(content) => handleGenerationSave('email_template', content)}
          />
        );
      case 'social':
        return (
          <SocialContentView
            articleId={article.id}
            initialResults={
              cachedGenerations['social_platforms']
                ? JSON.parse(cachedGenerations['social_platforms'])
                : article.socialContent
            }
            userTier={generationStats.tier}
            remainingGenerations={generationStats.remaining}
            onContentGenerated={(results) => handleGenerationSave('social_platforms', JSON.stringify(results))}
          />
        );
      case 'ai':
        return (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="p-4 bg-gradient-to-r from-indigo to-orchid rounded-2xl inline-block mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Personalization</h3>
              <p className="text-gray-600">
                Coming soon: Chat with AI to customize content to your unique voice and audience.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Backdrop (only when expanded on mobile) */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={handleBackdropClick}
        />
      )}

      {/* Morphing Card */}
      <motion.div
        layoutId={`article-card-${article.id}`}
        className={cn(
          'relative bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300',
          !isExpanded && 'hover:shadow-xl',
          isExpanded && 'lg:max-w-4xl lg:mx-auto',
          // Mobile: Fixed fullscreen when expanded
          isExpanded && 'lg:relative fixed inset-4 lg:inset-auto z-50',
        )}
        transition={{
          type: 'spring',
          bounce: 0.05,
          duration: 0.4,
        }}
      >
        {/* Collapsed State - Original Card */}
        {!isExpanded && (
          <CardContent className="p-6">
            {/* Header with categories and badges */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {article.category && (() => {
                    const categoryData = getCategoryById(article.category);
                    const CategoryIcon = categoryData?.icon;
                    return (
                      <Badge className={`border text-xs gap-1 ${getCategoryStyle()}`}>
                        {CategoryIcon && <CategoryIcon className="h-3 w-3" />}
                        {article.category}
                      </Badge>
                    );
                  })()}
                  {article.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {article.is_personalized && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs shrink-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              )}
            </div>

            {/* Title and summary */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {article.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {article.summary}
            </p>

            {/* Content sections - Quick action buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.keyInsights && article.keyInsights.length > 0 && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  {article.generation_stats?.hasKeyInsights && (
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  )}
                  <Lightbulb className="h-3 w-3" />
                  Key Insights
                </Badge>
              )}

              {article.videoScript && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  {article.generation_stats?.hasVideoScript && (
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  )}
                  <Video className="h-3 w-3" />
                  Video Script
                </Badge>
              )}

              {article.emailTemplate && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  {article.generation_stats?.hasEmailTemplate && (
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  )}
                  <Mail className="h-3 w-3" />
                  Email Template
                </Badge>
              )}

              {article.socialContent && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  {article.generation_stats?.hasSocialMedia && (
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  )}
                  <Share2 className="h-3 w-3" />
                  Social Media
                </Badge>
              )}
            </div>

            {/* Read Full Article Button */}
            {article.content && (
              <Button
                onClick={handleExpand}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                size="lg"
              >
                <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Read Full Article
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.div>
              </Button>
            )}
          </CardContent>
        )}

        {/* Expanded State - Full Article View */}
        {isExpanded && (
          <div className="flex flex-col h-full">
            {/* Close Button (Mobile) */}
            <button
              onClick={handleCollapse}
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
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Close Button (Desktop) */}
            <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {article.category && (() => {
                  const categoryData = getCategoryById(article.category);
                  const CategoryIcon = categoryData?.icon;
                  return (
                    <Badge className={`border text-xs gap-1 ${getCategoryStyle()}`}>
                      {CategoryIcon && <CategoryIcon className="h-3 w-3" />}
                      {article.category}
                    </Badge>
                  );
                })()}
              </div>
              <button
                onClick={handleCollapse}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {renderContentView()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sticky Footer with Actions */}
            <ArticleStickyFooter
              activeView={activeView}
              onViewChange={setActiveView}
              hasVideo={!!article.videoScript}
              hasEmail={!!article.emailTemplate}
              hasSocial={!!article.socialContent}
              hasAIGenerated={{
                video: article.generation_stats?.hasVideoScript || !!cachedGenerations['video_script'],
                email: article.generation_stats?.hasEmailTemplate || !!cachedGenerations['email_template'],
                social: article.generation_stats?.hasSocialMedia || !!cachedGenerations['social_platforms'],
              }}
            />
          </div>
        )}
      </motion.div>
    </>
  );
}
