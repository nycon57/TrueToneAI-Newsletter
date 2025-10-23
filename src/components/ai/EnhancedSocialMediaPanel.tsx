/**
 * Enhanced Social Media Generation Panel
 *
 * Example implementation using the new /api/ai/social-generate endpoint
 * with platform-specific generation and streaming support
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Check, X, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSocialGeneration } from '@/hooks/use-social-generation';
import type { SocialPlatform } from '@/types/social-media';
import { PLATFORM_LIMITS } from '@/types/social-generation';
import { GENERATION_LIMITS } from '@/lib/constants/generation-limits';

interface EnhancedSocialMediaPanelProps {
  articleId: string;
  userTier: 'free' | 'paid';
  initialGenerationsRemaining: number;
  onSave?: (results: Partial<Record<SocialPlatform, string>>) => void;
  className?: string;
}

const PLATFORM_CONFIG: Record<SocialPlatform, {
  name: string;
  icon: string;
  color: string;
  gradient: string;
}> = {
  facebook: {
    name: 'Facebook',
    icon: '👥',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600'
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: 'pink',
    gradient: 'from-pink-500 via-purple-500 to-orange-500'
  },
  twitter: {
    name: 'Twitter/X',
    icon: '🐦',
    color: 'sky',
    gradient: 'from-sky-400 to-sky-600'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-800'
  }
};

export function EnhancedSocialMediaPanel({
  articleId,
  userTier,
  initialGenerationsRemaining,
  onSave,
  className
}: EnhancedSocialMediaPanelProps) {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(new Set());
  const [generationsRemaining, setGenerationsRemaining] = useState(initialGenerationsRemaining);
  const [copiedPlatform, setCopiedPlatform] = useState<SocialPlatform | null>(null);

  const {
    generate,
    cancel,
    reset,
    isGenerating,
    streamingContent,
    results,
    errors,
    streamingPlatforms,
    completedPlatforms
  } = useSocialGeneration({
    onPlatformComplete: (platform, content) => {
      console.log(`${platform} generated:`, content.substring(0, 50) + '...');
      toast.success(`${PLATFORM_CONFIG[platform].name} content ready!`);
    },
    onPlatformError: (platform, error) => {
      console.error(`${platform} error:`, error);
      toast.error(`Failed to generate ${PLATFORM_CONFIG[platform].name}`);
    },
    onAllComplete: (finalResults) => {
      const successCount = Object.keys(finalResults).length;
      toast.success(`Generated content for ${successCount} platform(s)!`);
    },
    onUsageUpdate: (used, remaining) => {
      setGenerationsRemaining(remaining);
    }
  });

  const togglePlatform = (platform: SocialPlatform) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleGenerate = async () => {
    if (selectedPlatforms.size === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (generationsRemaining < selectedPlatforms.size) {
      if (userTier === 'free') {
        toast.error(`Not enough generations. You need ${selectedPlatforms.size}, but only have ${generationsRemaining}.`);
        router.push('/account?tab=billing');
      } else {
        toast.error('Not enough generations remaining this month');
      }
      return;
    }

    await generate({
      articleId,
      platforms: Array.from(selectedPlatforms)
    });
  };

  const handleRegenerate = async (platform: SocialPlatform) => {
    if (generationsRemaining < 1) {
      toast.error('No generations remaining');
      return;
    }

    await generate({
      articleId,
      platforms: [platform],
      regenerate: true
    });
  };

  const handleCopy = async (platform: SocialPlatform, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPlatform(platform);
      toast.success(`${PLATFORM_CONFIG[platform].name} content copied!`);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSaveAll = async () => {
    if (!results || Object.keys(results).length === 0) {
      toast.error('No content to save');
      return;
    }

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
        throw new Error('Failed to save');
      }

      toast.success('All content saved successfully!');
      onSave?.(results);
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Platform Selector */}
      {!isGenerating && !hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Select Platforms</h3>
            <span className="text-sm text-muted-foreground">
              {generationsRemaining} generation{generationsRemaining !== 1 ? 's' : ''} remaining
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(PLATFORM_CONFIG) as [SocialPlatform, typeof PLATFORM_CONFIG[SocialPlatform]][]).map(([platform, config]) => {
              const isSelected = selectedPlatforms.has(platform);
              const limits = PLATFORM_LIMITS[platform];

              return (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    'relative p-4 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-orchid bg-orchid/10'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm">{config.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Max {limits.max} chars
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orchid flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={selectedPlatforms.size === 0 || generationsRemaining < selectedPlatforms.size}
            className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate for {selectedPlatforms.size === 0 ? 'Selected' : selectedPlatforms.size} Platform{selectedPlatforms.size !== 1 ? 's' : ''}
          </Button>

          {selectedPlatforms.size > generationsRemaining && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-xs text-yellow-800">
                You need {selectedPlatforms.size} generations but only have {generationsRemaining} remaining.
                {userTier === 'free' && ' Upgrade to Pro for more!'}
              </AlertDescription>
            </Alert>
          )}
        </motion.div>
      )}

      {/* Generation Progress */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generating Content...</h3>
              <Button onClick={cancel} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>

            {Array.from(selectedPlatforms).map((platform) => {
              const config = PLATFORM_CONFIG[platform];
              const isStreaming = streamingPlatforms.has(platform);
              const isComplete = completedPlatforms.has(platform);
              const hasError = !!errors[platform];
              const content = streamingContent[platform] || '';

              return (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'p-4 rounded-lg border-2',
                    isComplete ? 'border-green-500 bg-green-50' :
                    hasError ? 'border-red-500 bg-red-50' :
                    isStreaming ? 'border-orchid bg-orchid/5' :
                    'border-gray-200'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="font-semibold text-sm">{config.name}</span>
                    {isStreaming && <Loader2 className="w-4 h-4 animate-spin text-orchid ml-auto" />}
                    {isComplete && <Check className="w-4 h-4 text-green-600 ml-auto" />}
                    {hasError && <X className="w-4 h-4 text-red-600 ml-auto" />}
                  </div>

                  {content && (
                    <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border border-gray-100">
                      {content}
                      {isStreaming && (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="inline-block ml-1"
                        >
                          ▊
                        </motion.span>
                      )}
                    </div>
                  )}

                  {hasError && (
                    <div className="text-xs text-red-700 mt-2">
                      Error: {errors[platform]}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      {hasResults && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <Button onClick={reset} variant="outline" size="sm">
              Start Over
            </Button>
          </div>

          {(Object.entries(results) as [SocialPlatform, string][]).map(([platform, content]) => {
            const config = PLATFORM_CONFIG[platform];
            const isCopied = copiedPlatform === platform;
            const charCount = content.length;
            const limits = PLATFORM_LIMITS[platform];
            const isNearLimit = charCount > limits.ideal;
            const isOverLimit = charCount > limits.max;

            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border-2 border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="font-semibold text-sm">{config.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xs',
                      isOverLimit ? 'text-red-600 font-semibold' :
                      isNearLimit ? 'text-yellow-600' :
                      'text-gray-500'
                    )}>
                      {charCount}/{limits.max}
                    </span>
                    <Button
                      onClick={() => handleRegenerate(platform)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleCopy(platform, content)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      {isCopied ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-gray-50 rounded border border-gray-100">
                  {content}
                </div>
              </motion.div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSaveAll}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Save All Content
            </Button>
          </div>

          {generationsRemaining <= 1 && userTier === 'free' && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-xs text-yellow-800">
                {generationsRemaining === 0
                  ? `You've used all your free generations. Upgrade to Pro for ${GENERATION_LIMITS.PAID_TIER}/month!`
                  : 'This is your last free generation. Upgrade to Pro!'}
              </AlertDescription>
            </Alert>
          )}
        </motion.div>
      )}
    </div>
  );
}
