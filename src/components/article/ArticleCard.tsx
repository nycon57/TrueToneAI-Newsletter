'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, Lightbulb, Video, Mail, Share2, Facebook, Instagram, Twitter, Linkedin, Sparkles, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SaveButton } from './SaveButton';
import { CopyButton } from './CopyButton';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';
import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';
import { GenerationLimitBadge } from '@/components/ai/GenerationLimitBadge';
import { GenerationCountBadge, ContentTypeIndicators } from './GenerationCountBadge';
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  industry?: string;
  category?: string;
  tags?: string[];
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
  is_saved?: boolean;
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

interface ArticleCardProps {
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

export function ArticleCard({ article, isAuthenticated, isPaid, userGenerationStats }: ArticleCardProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cache generated content for each section
  const [cachedGenerations, setCachedGenerations] = useState<Record<string, string>>({});

  // Default generation stats if not provided
  const generationStats = userGenerationStats || {
    remaining: isPaid ? 25 : 3,
    limit: isPaid ? 25 : 3,
    tier: (isPaid ? 'paid' : 'free') as 'free' | 'paid' | 'premium',
    resetDate: undefined
  };

  // Callback when generation completes to refresh stats
  const handleGenerationComplete = () => {
    setRefreshKey(prev => prev + 1);
    // In a real app, this would trigger a refetch of user stats from parent
    // For now, we'll just trigger a re-render
  };

  // Handle saving generated content to cache - ensure all values are stringified
  const handleGenerationSave = (contentType: string, content: string | Record<string, any>) => {
    const stringValue = typeof content === 'string' ? content : JSON.stringify(content);
    setCachedGenerations(prev => ({
      ...prev,
      [contentType]: stringValue
    }));
  };

  const getCategoryStyle = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mortgage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'leadership':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'marketing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderKeyInsights = () => {
    const insightsText = article.keyInsights?.join('\n• ') || '';
    const fullInsightsText = `Key Insights:\n\n• ${insightsText}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-4"
      >
        {/* Current Content Display */}
        <div className="p-6 bg-gradient-to-br from-lavender/20 to-lavender/10 rounded-xl border border-lavender/50">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orchid" />
              <h4 className="font-bold text-gray-900">Key Insights</h4>
              {article.is_personalized && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              )}
            </div>
            <CopyButton
              content={fullInsightsText}
              label="Insights"
              variant="default"
              className="bg-orchid hover:bg-orchid/90 text-white"
            />
          </div>
          <div className="space-y-2">
            {article.keyInsights?.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckIcon className="h-4 w-4 text-orchid mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Generation Panel - Only show for authenticated users */}
        {isAuthenticated && (
          <AIGenerationPanel
            articleId={article.id}
            contentType="key_insights"
            userTier={isPaid ? 'paid' : 'free'}
            remainingGenerations={generationStats.remaining}
            initialContent={cachedGenerations['key_insights']}
            onContentGenerated={(content) => handleGenerationSave('key_insights', content)}
          />
        )}
      </motion.div>
    );
  };

  const renderVideoScript = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      {/* Current Content Display */}
      <div className="p-6 bg-gradient-to-br from-red-50 to-red-50/50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Video className="h-5 w-5 text-red-600" />
            <h4 className="font-bold text-gray-900">Video Script</h4>
            <Badge className="bg-red-100 text-red-700 border-0 text-xs">30-60 sec</Badge>
            {article.is_personalized && (
              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            )}
          </div>
          <CopyButton
            content={article.videoScript || ''}
            label="Script"
            variant="default"
            className="bg-red-600 hover:bg-red-700 text-white"
          />
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {article.videoScript}
        </div>
      </div>

      {/* AI Generation Panel - Only show for authenticated users */}
      {isAuthenticated && (
        <AIGenerationPanel
          articleId={article.id}
          contentType="video_script"
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialContent={cachedGenerations['video_script']}
          onContentGenerated={(content) => handleGenerationSave('video_script', content)}
        />
      )}
    </motion.div>
  );

  const renderEmailTemplate = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      {/* Current Content Display */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-700" />
            <h4 className="font-bold text-gray-900">Email Template</h4>
            {article.is_personalized && (
              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            )}
          </div>
          <CopyButton
            content={article.emailTemplate || ''}
            label="Email"
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {article.emailTemplate}
        </div>
      </div>

      {/* AI Generation Panel - Only show for authenticated users */}
      {isAuthenticated && (
        <AIGenerationPanel
          articleId={article.id}
          contentType="email_template"
          userTier={isPaid ? 'paid' : 'free'}
          remainingGenerations={generationStats.remaining}
          initialContent={cachedGenerations['email_template']}
          onContentGenerated={(content) => handleGenerationSave('email_template', content)}
        />
      )}
    </motion.div>
  );

  const renderSocialContent = () => {
    const platforms = [
      { name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', content: article.socialContent?.facebook },
      { name: 'Instagram', icon: Instagram, color: 'from-pink-600 to-pink-700', content: article.socialContent?.instagram },
      { name: 'Twitter', icon: Twitter, color: 'from-blue-500 to-blue-600', content: article.socialContent?.twitter },
      { name: 'LinkedIn', icon: Linkedin, color: 'from-indigo-600 to-indigo-700', content: article.socialContent?.linkedin }
    ];

    // Check if we have existing social content to display
    const hasExistingSocialContent = platforms.some(p => p.content);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-4"
      >
        {/* Current Content Display - Only show if exists */}
        {hasExistingSocialContent && (
          <div className="p-6 bg-gradient-to-br from-lavender/20 to-pink-50/50 rounded-xl border border-lavender/50">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-orchid" />
                <h4 className="font-bold text-gray-900">Default Social Media Content</h4>
                {article.is_personalized && (
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Personalized
                  </Badge>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return platform.content && (
                  <div key={platform.name} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-sm">{platform.name}</span>
                      </div>
                      <CopyButton
                        content={platform.content}
                        label={platform.name}
                        variant="outline"
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-gray-700">{platform.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New Platform-Specific AI Generation Panel - Only show for authenticated users */}
        {isAuthenticated && (
          <SocialMediaGenerationPanel
            articleId={article.id}
            userTier={isPaid ? 'paid' : 'free'}
            remainingGenerations={generationStats.remaining}
            initialResults={
              cachedGenerations['social_platforms']
                ? (typeof cachedGenerations['social_platforms'] === 'string'
                    ? JSON.parse(cachedGenerations['social_platforms'])
                    : cachedGenerations['social_platforms'])
                : undefined
            }
            onContentGenerated={(results) => handleGenerationSave('social_platforms', JSON.stringify(results))}
          />
        )}
      </motion.div>
    );
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header with categories, generation badge, and save button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {article.industry && (
                <Badge variant="outline" className="text-xs">
                  {article.industry}
                </Badge>
              )}
              {article.category && (
                <Badge className={`border text-xs ${getCategoryStyle(article.category)}`}>
                  {article.category}
                </Badge>
              )}
              {article.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {article.is_personalized && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              )}

              {/* Generation Count Badge - Show total generations */}
              {isPaid && article.generation_stats && article.generation_stats.total > 0 && (
                <GenerationCountBadge
                  count={article.generation_stats.total}
                  className="ml-auto"
                />
              )}

              {/* Generation Limit Badge */}
              {isAuthenticated && (
                <GenerationLimitBadge
                  remaining={generationStats.remaining}
                  limit={generationStats.limit}
                  tier={generationStats.tier}
                  resetDate={generationStats.resetDate}
                />
              )}
            </div>

            {/* Content Type Indicators - Show which types have been generated */}
            {isPaid && article.generation_stats && article.generation_stats.total > 0 && (
              <ContentTypeIndicators
                hasKeyInsights={article.generation_stats.hasKeyInsights}
                hasVideoScript={article.generation_stats.hasVideoScript}
                hasEmailTemplate={article.generation_stats.hasEmailTemplate}
                hasSocialMedia={article.generation_stats.hasSocialMedia}
                socialPlatformCount={article.generation_stats.socialPlatforms?.length || 0}
                className="mt-2"
              />
            )}
          </div>
          {isPaid && (
            <SaveButton
              articleId={article.id}
              initialSaved={article.is_saved || false}
              isPaid={isPaid}
            />
          )}
        </div>

        {/* Title and summary */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          {article.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          {article.summary}
        </p>

        {/* Content sections */}
        <div className="space-y-4">
          {article.keyInsights && article.keyInsights.length > 0 && (
            <Button
              onClick={() => setActiveSection(activeSection === 'insights' ? null : 'insights')}
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start",
                activeSection === 'insights' && "bg-lavender/20 border-orchid"
              )}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Key Insights
            </Button>
          )}

          {article.videoScript && (
            <Button
              onClick={() => setActiveSection(activeSection === 'video' ? null : 'video')}
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start",
                activeSection === 'video' && "bg-red-50 border-red-300"
              )}
            >
              <Video className="h-4 w-4 mr-2" />
              Video Script
            </Button>
          )}

          {article.emailTemplate && (
            <Button
              onClick={() => setActiveSection(activeSection === 'email' ? null : 'email')}
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start",
                activeSection === 'email' && "bg-green-50 border-green-300"
              )}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Template
            </Button>
          )}

          {article.socialContent && (
            <Button
              onClick={() => setActiveSection(activeSection === 'social' ? null : 'social')}
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start",
                activeSection === 'social' && "bg-pink-50 border-pink-300"
              )}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Social Media
            </Button>
          )}
        </div>

        {/* Render active section */}
        {activeSection === 'insights' && renderKeyInsights()}
        {activeSection === 'video' && renderVideoScript()}
        {activeSection === 'email' && renderEmailTemplate()}
        {activeSection === 'social' && renderSocialContent()}
      </CardContent>
    </Card>
  );
}
