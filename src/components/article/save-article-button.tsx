'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface SaveArticleButtonProps {
  articleId: string;
  initialSaved?: boolean;
  initialSaveCount?: number;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
  className?: string;
}

export function SaveArticleButton({
  articleId,
  initialSaved = false,
  initialSaveCount = 0,
  variant = 'ghost',
  size = 'icon',
  showCount = false,
  className,
}: SaveArticleButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saveCount, setSaveCount] = useState(initialSaveCount);
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = async () => {
    // Optimistic UI update
    const wasInitiallySaved = isSaved;
    const previousCount = saveCount;

    setIsSaved(!isSaved);
    setSaveCount(prev => wasInitiallySaved ? prev - 1 : prev + 1);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: wasInitiallySaved ? 'unsave' : 'save',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save article');
        }

        const data = await response.json();

        // Update with server response
        setIsSaved(data.saved);
        if (data.saveCount !== undefined) {
          setSaveCount(data.saveCount);
        }

        // Show toast notification
        toast.success(
          data.saved ? 'Article saved successfully' : 'Article removed from saved',
          {
            description: data.saved
              ? 'You can find this article in your saved collection.'
              : 'The article has been removed from your saved collection.',
          }
        );
      } catch (error) {
        // Revert optimistic update on error
        setIsSaved(wasInitiallySaved);
        setSaveCount(previousCount);

        toast.error('Failed to save article', {
          description: 'Please try again later.',
        });

        console.error('Error saving article:', error);
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isPending}
      className={cn('relative group', className)}
      aria-label={isSaved ? 'Remove from saved articles' : 'Save article'}
    >
      <motion.div
        className="relative"
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.1 }}
      >
        <HeartIcon
          className={cn(
            'h-5 w-5 transition-all duration-200',
            isSaved
              ? 'fill-red-500 stroke-red-500'
              : 'fill-none stroke-current group-hover:stroke-red-400'
          )}
        />

        {/* Animated heart pop effect */}
        <AnimatePresence>
          {isSaved && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeartIcon className="h-5 w-5 fill-red-500 stroke-red-500 opacity-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showCount && saveCount > 0 && (
        <motion.span
          key={saveCount}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-2 text-sm font-medium tabular-nums"
        >
          {saveCount}
        </motion.span>
      )}
    </Button>
  );
}

// Compact variant for use in article cards
export function SaveArticleButtonCompact({
  articleId,
  initialSaved = false,
  className,
}: Omit<SaveArticleButtonProps, 'variant' | 'size' | 'showCount'>) {
  return (
    <SaveArticleButton
      articleId={articleId}
      initialSaved={initialSaved}
      variant="ghost"
      size="icon"
      showCount={false}
      className={cn('h-8 w-8', className)}
    />
  );
}

// Full variant with count for article detail pages
export function SaveArticleButtonFull({
  articleId,
  initialSaved = false,
  initialSaveCount = 0,
  className,
}: Omit<SaveArticleButtonProps, 'variant' | 'size'>) {
  return (
    <SaveArticleButton
      articleId={articleId}
      initialSaved={initialSaved}
      initialSaveCount={initialSaveCount}
      variant="outline"
      size="default"
      showCount={true}
      className={className}
    />
  );
}
