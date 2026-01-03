'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  springs,
  staggeredContainer,
  staggeredItem,
  expandableContent,
} from '@/lib/motion';
import { CheckIcon, Lightbulb, Video, Mail, Share2, Sparkles, Tag, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from './CopyButton';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';
import { SocialMediaGenerationPanel } from '@/components/ai/SocialMediaGenerationPanel';
import { EditableContentSection, EditableKeyInsights } from '@/components/article';
import { updateVideoScript, updateEmailTemplate, updateKeyInsights, handleGenerationUpdateError } from '@/lib/api/generations-client';
import { getCategoryById } from '@/lib/constants/categories';
import { cn } from '@/lib/utils';
import { useArticleModal } from '@/lib/context';
import { toast } from 'sonner';

/**
 * Safely format a published date string.
 * Returns formatted date or fallback if invalid.
 */
function formatPublishedDate(dateString: string | undefined | null): string | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Invalid date, return null to hide the element
  }

  return format(date, 'MMMM d, yyyy');
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  industry?: string;
  category?: string;
  tags?: string[];
  content?: string; // Full article content for modal
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  // Default content (always available, separate from AI-generated)
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
  // Generation IDs for editing
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
  onGenerationComplete?: () => void;
}

export function ArticleCard({ article, isAuthenticated, isPaid, userGenerationStats, onGenerationComplete }: ArticleCardProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { openArticle } = useArticleModal();

  // Cache generated content for each section
  const [cachedGenerations, setCachedGenerations] = useState<Record<string, string>>({});

  // Track regeneration mode for each content type
  const [isRegeneratingKeyInsights, setIsRegeneratingKeyInsights] = useState(false);
  const [isRegeneratingVideoScript, setIsRegeneratingVideoScript] = useState(false);
  const [isRegeneratingEmailTemplate, setIsRegeneratingEmailTemplate] = useState(false);

  // Handle opening the article modal
  const handleReadFullArticle = () => {
    openArticle(article.id, article);
  };

  // Default generation stats if not provided
  const generationStats = userGenerationStats || {
    remaining: isPaid ? 25 : 3,
    limit: isPaid ? 25 : 3,
    tier: (isPaid ? 'paid' : 'free') as 'free' | 'paid' | 'premium',
    resetDate: undefined
  };

  // Callback when generation completes to refresh stats
  const handleGenerationCompleteLocal = () => {
    setRefreshKey(prev => prev + 1);
    // Call parent's callback to update generation count in real-time
    if (onGenerationComplete) {
      onGenerationComplete();
    }
  };

  // Handle saving generated content to cache - ensure all values are stringified
  const handleGenerationSave = (contentType: string, content: string | Record<string, any>) => {
    const stringValue = typeof content === 'string' ? content : JSON.stringify(content);
    setCachedGenerations(prev => ({
      ...prev,
      [contentType]: stringValue
    }));
  };

  // All categories use consistent purple/magenta styling to match filters
  const getCategoryStyle = () => {
    return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
  };

  const renderKeyInsights = () => {
    // Use defaultKeyInsights for the default section, keyInsights for AI-generated
    const defaultInsights = article.defaultKeyInsights || article.keyInsights || [];
    const defaultInsightsText = defaultInsights.join('\n• ') || '';
    const fullDefaultInsightsText = `Key Insights:\n\n• ${defaultInsightsText}`;
    const generationId = article.generation_ids?.keyInsights;
    const hasGeneration = article.generation_stats?.hasKeyInsights && !isRegeneratingKeyInsights;

    // Handle saving edited insights
    const handleSaveInsights = async (insights: string[]) => {
      if (!generationId) {
        toast.error('Cannot save: No generation ID found');
        return;
      }

      try {
        await updateKeyInsights(generationId, insights);
        toast.success('Key Insights saved successfully!');
      } catch (error) {
        const errorMessage = handleGenerationUpdateError(error);
        toast.error(errorMessage);
        throw error; // Re-throw to let component handle UI state
      }
    };

    // Handle regeneration request
    const handleRegenerateKeyInsights = () => {
      setIsRegeneratingKeyInsights(true);
    };

    // Handle when regeneration completes
    const handleKeyInsightsGenerationComplete = () => {
      setIsRegeneratingKeyInsights(false);
      handleGenerationCompleteLocal();
    };

    return (
      <div className="mt-6 space-y-4">
        {/* Default Key Insights - Always show first */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              <h4 className="font-bold text-gray-900">Default Key Insights</h4>
            </div>
            <CopyButton
              content={fullDefaultInsightsText}
              label="Insights"
              variant="default"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            />
          </div>
          <div className="space-y-2">
            {defaultInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckIcon className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Generation Panel - Show if no generation yet OR regenerating */}
        {isAuthenticated && !hasGeneration && (
          <AIGenerationPanel
            articleId={article.id}
            contentType="key_insights"
            userTier={isPaid ? 'paid' : 'free'}
            remainingGenerations={generationStats.remaining}
            initialContent={cachedGenerations['key_insights']}
            hasExistingGeneration={article.generation_stats?.hasKeyInsights || false}
            onContentGenerated={(content) => handleGenerationSave('key_insights', content)}
            onGenerationComplete={handleKeyInsightsGenerationComplete}
          />
        )}

        {/* AI Generated Key Insights - Show if user has generated personalized content */}
        {isAuthenticated && hasGeneration && generationId && (
          <EditableKeyInsights
            insights={article.keyInsights || []}
            onSave={handleSaveInsights}
            onRegenerate={handleRegenerateKeyInsights}
            maxInsights={6}
            maxLength={500}
          />
        )}
      </div>
    );
  };

  const renderVideoScript = () => {
    // Use defaultVideoScript for the default section, videoScript for AI-generated
    const defaultScript = article.defaultVideoScript || article.videoScript || '';
    const generationId = article.generation_ids?.videoScript;
    const hasGeneration = article.generation_stats?.hasVideoScript && !isRegeneratingVideoScript;

    // Handle saving edited video script
    const handleSaveVideoScript = async (content: string) => {
      if (!generationId) {
        toast.error('Cannot save: No generation ID found');
        return;
      }

      try {
        await updateVideoScript(generationId, content);
        toast.success('Video Script saved successfully!');
      } catch (error) {
        const errorMessage = handleGenerationUpdateError(error);
        toast.error(errorMessage);
        throw error;
      }
    };

    // Handle regeneration request
    const handleRegenerateVideoScript = () => {
      setIsRegeneratingVideoScript(true);
    };

    // Handle when regeneration completes
    const handleVideoScriptGenerationComplete = () => {
      setIsRegeneratingVideoScript(false);
      handleGenerationCompleteLocal();
    };

    return (
      <div className="mt-6 space-y-4">
        {/* Default Video Script - Always show first */}
        <div className="p-6 bg-gradient-to-br from-red-50 to-red-50/50 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Video className="h-5 w-5 text-red-600" />
              <h4 className="font-bold text-gray-900">Default Video Script</h4>
              <Badge className="bg-red-100 text-red-700 border-0 text-xs">30-60 sec</Badge>
            </div>
            <CopyButton
              content={defaultScript}
              label="Script"
              variant="default"
              className="bg-red-600 hover:bg-red-700 text-white"
            />
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {defaultScript}
          </div>
        </div>

        {/* AI Generation Panel - Show if no generation yet OR regenerating */}
        {isAuthenticated && !hasGeneration && (
          <AIGenerationPanel
            articleId={article.id}
            contentType="video_script"
            userTier={isPaid ? 'paid' : 'free'}
            remainingGenerations={generationStats.remaining}
            initialContent={cachedGenerations['video_script']}
            hasExistingGeneration={article.generation_stats?.hasVideoScript || false}
            onContentGenerated={(content) => handleGenerationSave('video_script', content)}
            onGenerationComplete={handleVideoScriptGenerationComplete}
          />
        )}

        {/* AI Generated Video Script - Show if user has generated personalized content */}
        {isAuthenticated && hasGeneration && generationId && (
          <EditableContentSection
            title="AI Generated Content"
            content={article.videoScript || ''}
            onSave={handleSaveVideoScript}
            onRegenerate={handleRegenerateVideoScript}
            icon={Video}
            iconColor="text-red-600"
            bgColor="from-red-50 to-red-50/50"
            borderColor="border-red-200"
            buttonColor="bg-red-600 hover:bg-red-700"
            multiline={true}
            contentType="video_script"
          />
        )}
      </div>
    );
  };

  const renderEmailTemplate = () => {
    // Use defaultEmailTemplate for the default section, emailTemplate for AI-generated
    const defaultEmail = article.defaultEmailTemplate || article.emailTemplate || '';
    const generationId = article.generation_ids?.emailTemplate;
    const hasGeneration = article.generation_stats?.hasEmailTemplate && !isRegeneratingEmailTemplate;

    // Handle saving edited email template
    const handleSaveEmailTemplate = async (content: string) => {
      if (!generationId) {
        toast.error('Cannot save: No generation ID found');
        return;
      }

      try {
        await updateEmailTemplate(generationId, content);
        toast.success('Email Template saved successfully!');
      } catch (error) {
        const errorMessage = handleGenerationUpdateError(error);
        toast.error(errorMessage);
        throw error;
      }
    };

    // Handle regeneration request
    const handleRegenerateEmailTemplate = () => {
      setIsRegeneratingEmailTemplate(true);
    };

    // Handle when regeneration completes
    const handleEmailTemplateGenerationComplete = () => {
      setIsRegeneratingEmailTemplate(false);
      handleGenerationCompleteLocal();
    };

    return (
      <div className="mt-6 space-y-4">
        {/* Default Email Template - Always show first */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-700" />
              <h4 className="font-bold text-gray-900">Default Email Template</h4>
            </div>
            <CopyButton
              content={defaultEmail}
              label="Email"
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
            />
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {defaultEmail}
          </div>
        </div>

        {/* AI Generation Panel - Show if no generation yet OR regenerating */}
        {isAuthenticated && !hasGeneration && (
          <AIGenerationPanel
            articleId={article.id}
            contentType="email_template"
            userTier={isPaid ? 'paid' : 'free'}
            remainingGenerations={generationStats.remaining}
            initialContent={cachedGenerations['email_template']}
            hasExistingGeneration={article.generation_stats?.hasEmailTemplate || false}
            onContentGenerated={(content) => handleGenerationSave('email_template', content)}
            onGenerationComplete={handleEmailTemplateGenerationComplete}
          />
        )}

        {/* AI Generated Email Template - Show if user has generated personalized content */}
        {isAuthenticated && hasGeneration && generationId && (
          <EditableContentSection
            title="AI Generated Content"
            content={article.emailTemplate || ''}
            onSave={handleSaveEmailTemplate}
            onRegenerate={handleRegenerateEmailTemplate}
            icon={Mail}
            iconColor="text-green-700"
            bgColor="from-green-50 to-emerald-50/50"
            borderColor="border-green-200"
            buttonColor="bg-green-600 hover:bg-green-700"
            multiline={true}
            contentType="email_template"
          />
        )}
      </div>
    );
  };

  const renderSocialContent = () => {
    // Get platforms that have AI generations (from stats or cache)
    const aiPlatforms = article.generation_stats?.socialPlatforms || [];
    const newContent = cachedGenerations['social_platforms'];

    // Parse cached content if it's a string
    const cachedParsed: Record<string, string> = newContent
      ? (typeof newContent === 'string' ? JSON.parse(newContent) : newContent)
      : {};

    // Combine: AI platforms from stats + any newly cached platforms
    const allAIPlatforms = new Set([...aiPlatforms, ...Object.keys(cachedParsed)]);

    // Build AI content object - only include platforms that have AI generations
    const aiContent: Record<string, string> = {};
    allAIPlatforms.forEach(platform => {
      // Normalize platform to lowercase for consistent key access
      const platformKey = platform.toLowerCase() as keyof typeof article.socialContent;
      // Prefer cached content, then fall back to saved content
      const content = cachedParsed[platform] || cachedParsed[platformKey] || article.socialContent?.[platformKey];
      if (content) {
        aiContent[platformKey] = content;
      }
    });

    const hasAIContent = Object.keys(aiContent).length > 0;

    return (
      <div className="mt-6 space-y-4">
        {/* AI Generation Panel - handles AI results, default content, and platform selector */}
        {isAuthenticated && (
          <SocialMediaGenerationPanel
            articleId={article.id}
            userTier={isPaid ? 'paid' : 'free'}
            remainingGenerations={generationStats.remaining}
            initialResults={hasAIContent ? aiContent : undefined}
            defaultSocialContent={article.socialContent}
            onContentGenerated={(results) => handleGenerationSave('social_platforms', JSON.stringify(results))}
            onGenerationComplete={handleGenerationCompleteLocal}
          />
        )}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={springs.card}
    >
      <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
        {/* Header with categories, generation badge, and save button */}
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
        <p className="text-gray-600 leading-relaxed mb-3">
          {article.summary}
        </p>

        {/* Published date */}
        {(() => {
          const formattedDate = formatPublishedDate(article.published_at);
          return formattedDate ? (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          ) : null;
        })()}

        {/* Small Read Full Article link */}
        <button
          onClick={handleReadFullArticle}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 group mb-6"
        >
          Read full article
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Action Buttons Section - Full Width Card Bottom */}
        <div className="border-t border-gray-200 -mx-6 px-6 pt-6 mt-6 bg-gray-50/50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Content Tools
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {article.keyInsights && article.keyInsights.length > 0 && (
              <Button
                onClick={() => setActiveSection(activeSection === 'insights' ? null : 'insights')}
                variant={activeSection === 'insights' ? 'default' : 'outline'}
                className={cn(
                  "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
                  activeSection === 'insights'
                    ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                    : "bg-white hover:bg-purple-50 border-gray-300"
                )}
              >
                {article.generation_stats?.hasKeyInsights && (
                  <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
                )}
                <Lightbulb className={cn("h-5 w-5", activeSection === 'insights' ? "text-white" : "text-purple-600")} />
                <span className={cn("text-sm font-semibold", activeSection === 'insights' ? "text-white" : "text-gray-900")}>
                  Key Insights
                </span>
              </Button>
            )}

            {article.videoScript && (
              <Button
                onClick={() => setActiveSection(activeSection === 'video' ? null : 'video')}
                variant={activeSection === 'video' ? 'default' : 'outline'}
                className={cn(
                  "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
                  activeSection === 'video'
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                    : "bg-white hover:bg-red-50 border-gray-300"
                )}
              >
                {article.generation_stats?.hasVideoScript && (
                  <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
                )}
                <Video className={cn("h-5 w-5", activeSection === 'video' ? "text-white" : "text-red-600")} />
                <span className={cn("text-sm font-semibold", activeSection === 'video' ? "text-white" : "text-gray-900")}>
                  Video Script
                </span>
              </Button>
            )}

            {article.emailTemplate && (
              <Button
                onClick={() => setActiveSection(activeSection === 'email' ? null : 'email')}
                variant={activeSection === 'email' ? 'default' : 'outline'}
                className={cn(
                  "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
                  activeSection === 'email'
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                    : "bg-white hover:bg-green-50 border-gray-300"
                )}
              >
                {article.generation_stats?.hasEmailTemplate && (
                  <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
                )}
                <Mail className={cn("h-5 w-5", activeSection === 'email' ? "text-white" : "text-green-600")} />
                <span className={cn("text-sm font-semibold", activeSection === 'email' ? "text-white" : "text-gray-900")}>
                  Email Template
                </span>
              </Button>
            )}

            {article.socialContent && (
              <Button
                onClick={() => setActiveSection(activeSection === 'social' ? null : 'social')}
                variant={activeSection === 'social' ? 'default' : 'outline'}
                className={cn(
                  "h-auto py-4 px-4 flex-col items-start gap-1.5 relative",
                  activeSection === 'social'
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : "bg-white hover:bg-blue-50 border-gray-300"
                )}
              >
                {article.generation_stats?.hasSocialMedia && (
                  <Sparkles className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-500" />
                )}
                <Share2 className={cn("h-5 w-5", activeSection === 'social' ? "text-white" : "text-blue-600")} />
                <span className={cn("text-sm font-semibold", activeSection === 'social' ? "text-white" : "text-gray-900")}>
                  Social Media
                </span>
              </Button>
            )}
          </div>
        </div>

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
              {renderKeyInsights()}
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
              {renderVideoScript()}
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
              {renderEmailTemplate()}
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
              {renderSocialContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
    </motion.div>
  );
}
