'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps {
  /** Whether more items are available to load */
  hasMore: boolean;
  /** Callback function to load more items */
  onLoadMore: () => void | Promise<void>;
  /** Loading state */
  isLoading?: boolean;
  /** Custom loading text */
  loadingText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Show skeleton loader instead of spinner */
  showSkeleton?: boolean;
  /** Number of skeleton items to show */
  skeletonCount?: number;
  /** Use automatic scroll detection instead of button */
  autoLoad?: boolean;
  /** Distance from bottom (in pixels) to trigger auto-load */
  threshold?: number;
}

/**
 * InfiniteScroll Component - Option A
 *
 * A mobile-first "Load More" button for pagination with smooth animations.
 * Includes loading states, error handling, and accessibility features.
 *
 * Features:
 * - Gradient button matching TrueTone AI brand (orchid to indigo)
 * - Smooth fade-in animations for new content
 * - Loading spinner with pulsing animation
 * - Error state with retry capability
 * - Fully accessible with ARIA labels
 * - Mobile-first responsive design
 *
 * @example
 * ```tsx
 * const [page, setPage] = useState(1);
 * const { data, isLoading } = useArticles({ page });
 *
 * const handleLoadMore = async () => {
 *   setPage(prev => prev + 1);
 * };
 *
 * return (
 *   <InfiniteScroll
 *     hasMore={data.hasMore}
 *     onLoadMore={handleLoadMore}
 *     isLoading={isLoading}
 *   />
 * );
 * ```
 */
export function InfiniteScroll({
  hasMore,
  onLoadMore,
  isLoading = false,
  loadingText = 'Loading more articles...',
  className,
  showSkeleton = false,
  skeletonCount = 3,
  autoLoad = true,
  threshold = 300,
}: InfiniteScrollProps) {
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const handleLoadMore = useCallback(async () => {
    if (hasTriggeredRef.current) return; // Prevent duplicate calls

    hasTriggeredRef.current = true;
    setIsLoadingLocal(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingLocal(false);
      // Reset after a small delay to allow for next trigger
      setTimeout(() => {
        hasTriggeredRef.current = false;
      }, 500);
    }
  }, [onLoadMore]);

  const loading = isLoading || isLoadingLocal;

  // Intersection Observer for auto-load
  useEffect(() => {
    if (!autoLoad || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [autoLoad, hasMore, loading, threshold, handleLoadMore]);

  return (
    <div className={cn('w-full py-8', className)} ref={observerRef}>
      <AnimatePresence mode="wait">
        {loading ? (
          // Loading State
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            {showSkeleton ? (
              // Skeleton Loader
              <div className="w-full max-w-4xl space-y-6 px-4">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {/* Header skeleton */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-2">
                          <div className="h-5 w-16 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded-full animate-pulse" />
                          <div className="h-5 w-20 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded-full animate-pulse" />
                        </div>
                      </div>
                      {/* Title skeleton */}
                      <div className="space-y-2">
                        <div className="h-6 w-3/4 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded animate-pulse" />
                        <div className="h-6 w-1/2 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded animate-pulse" />
                      </div>
                      {/* Summary skeleton */}
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gradient-to-r from-lavender/20 to-lavender/10 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gradient-to-r from-lavender/20 to-lavender/10 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-gradient-to-r from-lavender/20 to-lavender/10 rounded animate-pulse" />
                      </div>
                      {/* Buttons skeleton */}
                      <div className="flex gap-2">
                        <div className="h-8 w-24 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded-md animate-pulse" />
                        <div className="h-8 w-28 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded-md animate-pulse" />
                        <div className="h-8 w-32 bg-gradient-to-r from-lavender/30 to-lavender/20 rounded-md animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Spinner Loader
              <>
                <div className="relative">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orchid/20 to-indigo/20 animate-pulse" />
                  {/* Inner spinning loader */}
                  <Loader2 className="h-8 w-8 text-orchid animate-spin relative z-10" />
                </div>
                <p className="text-sm text-gray-600 font-medium animate-pulse">
                  {loadingText}
                </p>
              </>
            )}
          </motion.div>
        ) : !hasMore ? (
          // End of results message - only show when truly no more articles
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-lavender/30 to-lavender/20 px-6 py-3 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <p className="text-sm text-gray-600 font-medium">
                All articles shown ✨
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
