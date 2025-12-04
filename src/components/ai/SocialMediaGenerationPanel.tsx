'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, AlertTriangle, Facebook, Instagram, Twitter, Linkedin, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  SocialPlatformSelector,
  SocialPlatformResults,
  type SocialPlatform
} from './SocialPlatformSelector';
import { useSocialGeneration } from '@/hooks/use-social-generation';
import { GENERATION_LIMITS } from '@/lib/constants/generation-limits';

interface SocialMediaGenerationPanelProps {
  articleId: string;
  userTier: 'free' | 'paid';
  remainingGenerations: number;
  initialResults?: Record<SocialPlatform, string>;
  defaultSocialContent?: Partial<Record<SocialPlatform, string>>; // Default content from article
  onSave?: (results: Record<SocialPlatform, string>) => void;
  onGenerationComplete?: () => void;
  onContentGenerated?: (results: Record<SocialPlatform, string>) => void;
  className?: string;
}

export function SocialMediaGenerationPanel({
  articleId,
  userTier,
  remainingGenerations,
  initialResults,
  defaultSocialContent,
  onSave,
  onGenerationComplete,
  onContentGenerated,
  className
}: SocialMediaGenerationPanelProps) {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // Initialize isSaved to true if initialResults exist (content already saved in DB)
  const [isSaved, setIsSaved] = useState(() => !!(initialResults && Object.keys(initialResults).length > 0));
  // Initialize savedPlatforms with platforms from initialResults (already saved in DB)
  const [savedPlatforms, setSavedPlatforms] = useState<Set<SocialPlatform>>(
    () => new Set(initialResults ? Object.keys(initialResults) as SocialPlatform[] : [])
  );
  const [isAddingMore, setIsAddingMore] = useState(false);

  // All available platforms
  const ALL_PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin'];

  // Use the custom SSE hook for social generation
  const {
    isGenerating,
    streamingPlatforms,
    completedPlatforms,
    results,
    streamingContent,
    errors,
    generationsUsed,
    generationsRemaining: apiGenerationsRemaining,
    generate,
    cancel,
    reset
  } = useSocialGeneration({
    initialResults: initialResults,
    onPlatformStart: (platform) => {
      console.log(`[SocialMediaGenerationPanel] Started generating for ${platform}`);
    },
    onPlatformComplete: (platform, content) => {
      console.log(`[SocialMediaGenerationPanel] Completed ${platform}: ${content.length} chars`);
    },
    onPlatformError: (platform, error) => {
      console.error(`[SocialMediaGenerationPanel] Error on ${platform}:`, error);
    },
    onAllComplete: (finalResults) => {
      console.log('[SocialMediaGenerationPanel] All platforms complete:', finalResults);

      // Notify parent to cache this content
      if (onContentGenerated) {
        onContentGenerated(finalResults as Record<SocialPlatform, string>);
      }

      // Notify parent to update generation count in real-time
      // Note: Social media generation uses one credit per platform, so we notify once per platform completed
      // The API already increments the count, so we just need to update the UI
      if (onGenerationComplete) {
        // Call once for each platform that was generated
        const platformCount = Object.keys(finalResults).length;
        for (let i = 0; i < platformCount; i++) {
          onGenerationComplete();
        }
      }

      setIsSaved(false); // Reset saved state for new generation
      setIsAddingMore(false); // Exit "add more" mode after generation
      setSelectedPlatforms([]); // Clear selection
    },
    onUsageUpdate: (used, remaining) => {
      console.log(`[SocialMediaGenerationPanel] Usage update: ${used} used, ${remaining} remaining`);
    },
    onError: (error) => {
      console.error('[SocialMediaGenerationPanel] Generation error:', error);
    }
  });

  // Handle generate button click
  const handleGenerate = async () => {
    if (remainingGenerations <= 0) {
      if (userTier === 'free') {
        toast.error(`You've used all ${GENERATION_LIMITS.FREE_TIER} free AI generations. Upgrade to Pro for more!`);
        router.push('/account?tab=billing');
      } else {
        toast.error('Monthly generation limit reached. Your limit will reset next month.');
      }
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    // Check if we have enough generations
    if (selectedPlatforms.length > remainingGenerations) {
      toast.error(`You need ${selectedPlatforms.length} generations but only have ${remainingGenerations} remaining`);
      return;
    }

    // Start generation
    await generate({
      articleId,
      platforms: selectedPlatforms
    });
  };

  // Handle regenerate for a specific platform
  const handleRegenerate = async (platform: SocialPlatform) => {
    if (remainingGenerations <= 0) {
      if (userTier === 'free') {
        toast.error(`You've used all ${GENERATION_LIMITS.FREE_TIER} free AI generations. Upgrade to Pro for more!`);
        router.push('/account?tab=billing');
      } else {
        toast.error('Monthly generation limit reached. Your limit will reset next month.');
      }
      return;
    }

    // Remove this platform from saved state since we're regenerating it
    setSavedPlatforms(prev => {
      const newSet = new Set(prev);
      newSet.delete(platform);
      return newSet;
    });

    // Start regeneration for single platform
    await generate({
      articleId,
      platforms: [platform],
      regenerate: true
    });
  };

  // Handle copy
  const handleCopy = (platform: SocialPlatform, content: string) => {
    // Copy action is handled in SocialPlatformResults
    console.log(`[SocialMediaGenerationPanel] Content copied for ${platform}`);
  };

  // Handle save individual platform
  const handleSavePlatform = async (platform: SocialPlatform, content: string) => {
    try {
      const response = await fetch('/api/ai/save-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          contentType: 'social_content',
          platform: platform, // Required for social_content
          generatedContent: content
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save generation');
      }

      await response.json();

      // Mark this platform as saved
      setSavedPlatforms(prev => new Set([...prev, platform]));

      if (onSave) {
        onSave({ [platform]: content } as Record<SocialPlatform, string>);
      }
    } catch (error) {
      console.error('Save error:', error);
      throw error; // Re-throw to be handled by SocialPlatformResults
    }
  };

  // Handle save all generated content
  const handleSaveAll = async () => {
    if (!results || Object.keys(results).length === 0) {
      toast.error('No content to save');
      return;
    }

    setIsSaving(true);

    try {
      // Save each platform individually (API requires platform for social_content)
      const platforms = Object.entries(results) as [SocialPlatform, string][];
      const savePromises = platforms.map(async ([platform, content]) => {
        const response = await fetch('/api/ai/save-generation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId,
            contentType: 'social_content',
            platform: platform,
            generatedContent: content
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`${platform}: ${error.error || 'Failed to save'}`);
        }

        return platform;
      });

      const savedPlatformsList = await Promise.all(savePromises);
      setIsSaved(true);

      // Mark all platforms as saved
      setSavedPlatforms(new Set(savedPlatformsList));

      toast.success('All social media content saved successfully!');

      if (onSave) {
        onSave(results as Record<SocialPlatform, string>);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save generation');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle start over
  const handleStartOver = () => {
    reset();
    setSelectedPlatforms([]);
    setIsSaved(false);
    setSavedPlatforms(new Set());
    setIsAddingMore(false);
  };

  // Handle cancel add more
  const handleCancelAddMore = () => {
    setIsAddingMore(false);
    setSelectedPlatforms([]);
  };

  const hasResults = results && Object.keys(results).length > 0;
  const hasErrors = errors && Object.keys(errors).length > 0;

  // Calculate which platforms have been generated and which are still available
  const generatedPlatforms = Object.keys(results) as SocialPlatform[];
  const availablePlatforms = ALL_PLATFORMS.filter(p => !generatedPlatforms.includes(p));
  const hasMorePlatformsAvailable = availablePlatforms.length > 0;

  // Platform configs for rendering default content
  const PLATFORM_CONFIGS = [
    { id: 'facebook' as SocialPlatform, name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
    { id: 'instagram' as SocialPlatform, name: 'Instagram', icon: Instagram, color: 'from-pink-600 to-pink-700' },
    { id: 'twitter' as SocialPlatform, name: 'Twitter', icon: Twitter, color: 'from-blue-500 to-blue-600' },
    { id: 'linkedin' as SocialPlatform, name: 'LinkedIn', icon: Linkedin, color: 'from-indigo-600 to-indigo-700' }
  ];

  // Calculate default content to show (platforms with default content but NO AI generations)
  const defaultPlatformsToShow = PLATFORM_CONFIGS.filter(
    p => defaultSocialContent?.[p.id] && !generatedPlatforms.includes(p.id)
  );
  const hasDefaultContentToShow = defaultPlatformsToShow.length > 0;

  // Copy handler for default content
  const handleCopyDefault = (content: string, platformName: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${platformName} content copied!`);
  };

  // Show upgrade CTA if no generations remaining
  if (remainingGenerations <= 0 && !isGenerating && !hasResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('p-4 rounded-lg bg-gradient-to-br from-orchid/10 to-indigo/10 border-2 border-orchid/30', className)}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orchid to-indigo flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">
              {userTier === 'free' ? 'Upgrade to Unlock AI' : 'Monthly Limit Reached'}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {userTier === 'free'
                ? `You've used all ${GENERATION_LIMITS.FREE_TIER} free AI generations. Upgrade to Pro for ${GENERATION_LIMITS.PAID_TIER} generations per month!`
                : `You've used all ${GENERATION_LIMITS.PAID_TIER} AI generations this month. Your limit will reset next month.`}
            </p>
            {userTier === 'free' && (
              <Button
                onClick={() => router.push('/account?tab=billing')}
                size="sm"
                className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Calculate ALL default platforms (for when there are NO AI results)
  const allDefaultPlatforms = PLATFORM_CONFIGS.filter(p => defaultSocialContent?.[p.id]);
  const hasAnyDefaultContent = allDefaultPlatforms.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Default Content Section - show when NO AI results exist */}
      {!hasResults && !isGenerating && hasAnyDefaultContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <h4 className="font-bold text-gray-900">Default Social Media Content</h4>
            </div>
          </div>
          <div className="grid gap-3">
            {allDefaultPlatforms.map((platform) => {
              const Icon = platform.icon;
              const content = defaultSocialContent?.[platform.id];
              if (!content) return null;

              return (
                <div key={platform.name} className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm">{platform.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyDefault(content, platform.name)}
                      className="h-8 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy {platform.name}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{content}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Platform Selector - show if not generating and (no results OR adding more platforms) */}
      {!isGenerating && (!hasResults || isAddingMore) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isAddingMore && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Add More Platforms
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelAddMore}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          )}

          <SocialPlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
            excludePlatforms={isAddingMore ? generatedPlatforms : []}
            disabled={remainingGenerations <= 0}
          />

          {/* Generate button */}
          <div className="mt-6">
            <Button
              onClick={handleGenerate}
              disabled={selectedPlatforms.length === 0 || remainingGenerations <= 0 || selectedPlatforms.length > remainingGenerations}
              className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate for {selectedPlatforms.length === 0 ? 'Selected' : selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </Button>

            {/* Warning if not enough generations */}
            {selectedPlatforms.length > remainingGenerations && (
              <p className="text-xs text-red-600 mt-2 text-center">
                You need {selectedPlatforms.length} generations but only have {remainingGenerations} remaining
              </p>
            )}

            {/* Low generation warning */}
            {remainingGenerations <= 2 && remainingGenerations > 0 && userTier === 'free' && selectedPlatforms.length <= remainingGenerations && (
              <p className="text-xs text-yellow-600 mt-2 text-center">
                {remainingGenerations === 1 ? 'Last free generation remaining!' : `Only ${remainingGenerations} generations left`}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Loading state with streaming */}
      <AnimatePresence>
        {isGenerating && (() => {
          // Get the platforms currently being processed (streaming or completed in this generation)
          const activePlatforms = Array.from(new Set([...streamingPlatforms, ...completedPlatforms]));
          const activePlatformCount = activePlatforms.length || selectedPlatforms.length;

          // Get platform names for the message
          const platformNames = activePlatforms.length > 0
            ? activePlatforms.map(p => {
                const config = [
                  { id: 'facebook', name: 'Facebook' },
                  { id: 'instagram', name: 'Instagram' },
                  { id: 'twitter', name: 'Twitter/X' },
                  { id: 'linkedin', name: 'LinkedIn' }
                ].find(c => c.id === p);
                return config?.name;
              }).filter(Boolean)
            : [];

          // Format platform names with proper grammar
          const formatPlatformNames = (names: string[]) => {
            if (names.length === 0) return '';
            if (names.length === 1) return names[0];
            if (names.length === 2) return `${names[0]} and ${names[1]}`;
            return names.slice(0, -1).join(', ') + `, and ${names[names.length - 1]}`;
          };

          const platformsToShow = activePlatforms.length > 0 ? activePlatforms : selectedPlatforms;

          return (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Overall progress */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-lavender/30 to-lavender/10 border border-lavender/50">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-orchid" />
                  <span className="text-sm font-medium text-orchid">
                    ✨ Generating content for {platformNames.length > 0 ? formatPlatformNames(platformNames) : `${activePlatformCount} platform${activePlatformCount !== 1 ? 's' : ''}`}...
                  </span>
                </div>

                {/* Show selected platforms being generated */}
                <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                  {platformsToShow.map((platformId) => {
                    const platformConfig = [
                      { id: 'facebook', name: 'Facebook' },
                      { id: 'instagram', name: 'Instagram' },
                      { id: 'twitter', name: 'Twitter/X' },
                      { id: 'linkedin', name: 'LinkedIn' }
                    ].find(p => p.id === platformId);

                    const isStreaming = streamingPlatforms.has(platformId);
                    const isCompleted = completedPlatforms.has(platformId);
                    const hasError = errors[platformId];

                  return (
                    <motion.div
                      key={platformId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border',
                        isCompleted && !hasError && 'bg-green-50 text-green-700 border-green-200',
                        hasError && 'bg-red-50 text-red-700 border-red-200',
                        isStreaming && 'bg-white/50 text-orchid border-orchid/30 animate-pulse',
                        !isStreaming && !isCompleted && !hasError && 'bg-gray-50 text-gray-500 border-gray-200'
                      )}
                    >
                      {isCompleted && !hasError && '✓ '}
                      {hasError && '✗ '}
                      {isStreaming && '⏳ '}
                      {platformConfig?.name}
                    </motion.div>
                  );
                })}
              </div>

              {/* Streaming content preview */}
              {Object.entries(streamingContent).map(([platform, content]) => {
                if (!content || content.trim().length === 0) return null;

                return (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-white/70 rounded-md border border-orchid/20"
                  >
                    <div className="text-xs font-semibold text-orchid mb-1 capitalize">
                      {platform}:
                    </div>
                    <div className="text-xs text-gray-700 line-clamp-3">
                      {content}
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-1 h-3 bg-orchid ml-1"
                      />
                    </div>
                  </motion.div>
                );
              })}

              <Button
                onClick={cancel}
                variant="ghost"
                size="sm"
                className="mt-4 mx-auto block"
              >
                Cancel Generation
              </Button>
            </div>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Default Content Section - Show for platforms WITHOUT AI generations */}
      {hasResults && !isAddingMore && hasDefaultContentToShow && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <h4 className="font-bold text-gray-900">Default Social Media Content</h4>
            </div>
          </div>
          <div className="grid gap-3">
            {defaultPlatformsToShow.map((platform) => {
              const Icon = platform.icon;
              const content = defaultSocialContent?.[platform.id];
              if (!content) return null;

              return (
                <div key={platform.name} className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm">{platform.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyDefault(content, platform.name)}
                      className="h-8 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy {platform.name}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{content}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Platform Selector - Show for remaining platforms when results exist */}
      {hasResults && !isAddingMore && hasMorePlatformsAvailable && !isGenerating && remainingGenerations > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="pt-4 border-t border-gray-200"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Generate for More Platforms
          </h3>

          <SocialPlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
            excludePlatforms={generatedPlatforms}
            disabled={remainingGenerations <= 0}
          />

          {/* Generate button for additional platforms */}
          <div className="mt-6">
            <Button
              onClick={handleGenerate}
              disabled={selectedPlatforms.length === 0 || remainingGenerations <= 0 || selectedPlatforms.length > remainingGenerations}
              className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate for {selectedPlatforms.length === 0 ? 'Selected' : selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </Button>

            {/* Warning if not enough generations */}
            {selectedPlatforms.length > remainingGenerations && (
              <p className="text-xs text-red-600 mt-2 text-center">
                You need {selectedPlatforms.length} generations but only have {remainingGenerations} remaining
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Results display - AI Generated Content at bottom */}
      {hasResults && !isAddingMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <SocialPlatformResults
            results={results as Record<SocialPlatform, string>}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            onSave={handleSavePlatform}
            savedPlatforms={savedPlatforms}
            regeneratingPlatforms={streamingPlatforms}
            isSaving={isSaving}
            isSaved={isSaved}
            onSaveAll={handleSaveAll}
          />

          {/* Warning for low generations */}
          {remainingGenerations <= 1 && userTier === 'free' && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-xs text-yellow-800">
                {remainingGenerations === 0
                  ? `You've used all your free generations. Upgrade to Pro for ${GENERATION_LIMITS.PAID_TIER}/month!`
                  : 'This is your last free generation. Upgrade to Pro for unlimited access!'}
              </AlertDescription>
            </Alert>
          )}
        </motion.div>
      )}

      {/* Error display for platforms that failed */}
      {hasErrors && !isGenerating && (
        <motion.div
          key="errors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {Object.entries(errors).map(([platform, error]) => (
            <Alert key={platform} className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800">
                <span className="font-semibold capitalize">{platform}:</span> {error}
              </AlertDescription>
            </Alert>
          ))}
        </motion.div>
      )}
    </div>
  );
}
