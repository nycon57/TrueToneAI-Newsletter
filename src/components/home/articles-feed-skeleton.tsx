import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for articles feed
 * Provides instant visual feedback while data loads
 */
export function ArticlesFeedSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      {/* Header Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
      </div>

      {/* Articles Skeleton */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton className="h-7 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-5/6 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}