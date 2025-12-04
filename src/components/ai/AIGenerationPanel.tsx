'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompletion } from '@ai-sdk/react';
import { Sparkles, Loader2, Save, RotateCw, Copy, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GENERATION_LIMITS } from '@/lib/constants/generation-limits';

interface AIGenerationPanelProps {
  articleId: string;
  contentType: 'key_insights' | 'video_script' | 'email_template' | 'social_content';
  userTier: 'free' | 'paid';
  remainingGenerations: number;
  initialContent?: string; // Pre-existing generated content from cache
  hasExistingGeneration?: boolean; // Whether this article already has generated content for this type
  onSave?: (content: string) => void;
  onGenerationComplete?: () => void; // Callback to refresh parent state
  onContentGenerated?: (content: string) => void; // Callback when new content is generated
  className?: string;
}

export function AIGenerationPanel({
  articleId,
  contentType,
  userTier,
  remainingGenerations,
  initialContent,
  hasExistingGeneration = false,
  onSave,
  onGenerationComplete,
  onContentGenerated,
  className
}: AIGenerationPanelProps) {
  const router = useRouter();
  const [generatedContent, setGeneratedContent] = useState<string>(initialContent || '');
  const [isSaving, setIsSaving] = useState(false);
  // If we have existing saved content, initialize isSaved to true
  const [isSaved, setIsSaved] = useState(hasExistingGeneration && !!initialContent);

  // Get color scheme based on content type
  const getColorScheme = () => {
    switch (contentType) {
      case 'key_insights':
        return {
          bg: 'from-purple-50 to-purple-50/50',
          border: 'border-purple-200',
          text: 'text-purple-600',
          heading: 'text-purple-900',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'video_script':
        return {
          bg: 'from-red-50 to-red-50/50',
          border: 'border-red-200',
          text: 'text-red-600',
          heading: 'text-red-900',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'email_template':
        return {
          bg: 'from-green-50 to-emerald-50/50',
          border: 'border-green-200',
          text: 'text-green-600',
          heading: 'text-green-900',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'social_content':
        return {
          bg: 'from-blue-50 to-blue-50/50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          heading: 'text-blue-900',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          bg: 'from-green-50 to-emerald-50/50',
          border: 'border-green-200',
          text: 'text-green-600',
          heading: 'text-green-900',
          button: 'bg-green-600 hover:bg-green-700'
        };
    }
  };

  const colors = getColorScheme();

  const {
    completion,
    complete,
    isLoading,
    error,
    stop
  } = useCompletion({
    api: '/api/ai/personalize-stream',
    streamProtocol: 'text',
    body: {
      articleId,
      contentType
    },
    onFinish: (prompt, completion) => {
      console.log('[AIGenerationPanel] onFinish called with completion length:', completion?.length);
      setGeneratedContent(completion);
      // Notify parent to cache this content
      if (onContentGenerated) {
        onContentGenerated(completion);
      }
      // Notify parent to update generation count in real-time
      if (onGenerationComplete) {
        onGenerationComplete();
      }
    },
    onError: (error) => {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    }
  });

  // Debug logging
  console.log('[AIGenerationPanel] State:', {
    isLoading,
    completionLength: completion?.length,
    generatedContentLength: generatedContent?.length
  });

  // Handle generate button click
  const handleGenerate = async () => {
    if (remainingGenerations <= 0) {
      if (userTier === 'free') {
        toast.error('You\'ve used all 3 free AI generations. Upgrade to Pro for more!');
        router.push('/account?tab=billing');
      } else {
        toast.error('Monthly generation limit reached. Your limit will reset next month.');
      }
      return;
    }

    // Reset state
    setGeneratedContent('');
    setIsSaved(false);

    // Start generation
    await complete('');
  };

  // Handle save generation
  const handleSave = async () => {
    if (!generatedContent && !completion) {
      toast.error('No content to save');
      return;
    }

    setIsSaving(true);

    try {
      const contentToSave = generatedContent || completion;

      const response = await fetch('/api/ai/save-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          contentType,
          generatedContent: contentToSave
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save generation');
      }

      await response.json();
      setIsSaved(true);
      toast.success('Generation saved successfully!');

      // Call onSave callback if provided
      if (onSave) {
        onSave(contentToSave);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save generation');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    const contentToCopy = generatedContent || completion;
    if (!contentToCopy) return;

    navigator.clipboard.writeText(contentToCopy);
    toast.success('Copied to clipboard!');
  };

  // Handle regenerate
  const handleRegenerate = () => {
    handleGenerate();
  };

  // Show upgrade CTA if no generations remaining
  if (remainingGenerations <= 0 && !isLoading && !completion) {
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
    <div className={cn('space-y-4', className)}>
      {/* Generate/Regenerate Button (idle state) - Only show if no content exists yet */}
      {!isLoading && !completion && !generatedContent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={remainingGenerations <= 0}
            className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white shadow-md hover:shadow-lg transition-all"
          >
            {hasExistingGeneration ? (
              <>
                <RotateCw className="h-4 w-4 mr-2" />
                Regenerate with AI
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
          {remainingGenerations <= 2 && remainingGenerations > 0 && userTier === 'free' && (
            <p className="text-xs text-yellow-600 mt-2 text-center">
              {remainingGenerations === 1 ? 'Last free generation remaining!' : `Only ${remainingGenerations} generations left`}
            </p>
          )}
        </motion.div>
      )}

      {/* Loading state with streaming content */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-gradient-to-br from-lavender/30 to-lavender/10 border border-lavender/50"
          >
            {/* Loading indicator */}
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="h-4 w-4 animate-spin text-orchid" />
              <span className="text-sm font-medium text-orchid">✨ AI is generating...</span>
              <Button
                onClick={stop}
                variant="ghost"
                size="sm"
                className="ml-auto h-8"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>

            {/* Streaming content */}
            {completion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-sm max-w-none"
              >
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {completion}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1 h-4 bg-orchid ml-1"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Completed state with actions */}
        {!isLoading && (completion || generatedContent) && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Generated content display */}
            <div className={cn('p-4 rounded-lg bg-gradient-to-br border', colors.bg, colors.border)}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={cn('h-4 w-4', colors.text)} />
                <span className={cn('text-sm font-semibold', colors.heading)}>
                  AI Generated Content
                </span>
                {isSaved && (
                  <span className={cn('text-xs ml-auto', colors.text)}>✓ Saved</span>
                )}
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {generatedContent || completion}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                variant="default"
                size="sm"
                className={cn(
                  'text-white',
                  colors.button,
                  isSaved && colors.button
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : isSaved ? (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save this generation
                  </>
                )}
              </Button>

              <Button
                onClick={handleRegenerate}
                variant="outline"
                size="sm"
                disabled={remainingGenerations <= 0}
              >
                <RotateCw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>

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

        {/* Error state */}
        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800">
                Failed to generate content. Please try again.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleGenerate}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
