'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
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
  onSave,
  onGenerationComplete,
  onContentGenerated,
  className
}: SocialMediaGenerationPanelProps) {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedPlatforms, setSavedPlatforms] = useState<Set<SocialPlatform>>(new Set());

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

      setIsSaved(false); // Reset saved state for new generation
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
      // Create a single-platform object to save
      const platformContent = { [platform]: content };

      const response = await fetch('/api/ai/save-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          contentType: 'social_content',
          generatedContent: JSON.stringify(platformContent)
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
        onSave(platformContent as Record<SocialPlatform, string>);
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
      const response = await fetch('/api/ai/save-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          contentType: 'social_content',
          generatedContent: JSON.stringify(results)
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save generation');
      }

      await response.json();
      setIsSaved(true);

      // Mark all platforms as saved
      setSavedPlatforms(new Set(Object.keys(results) as SocialPlatform[]));

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
  };

  const hasResults = results && Object.keys(results).length > 0;
  const hasErrors = errors && Object.keys(errors).length > 0;

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

  return (
    <div className={cn('space-y-6', className)}>
      {/* Platform Selector - only show if not currently generating/hasn't generated */}
      {!isGenerating && !hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SocialPlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
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

      {/* Results display */}
      {hasResults && (
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
