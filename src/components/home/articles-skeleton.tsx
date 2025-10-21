import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for articles feed
 * Shown while server component is loading data
 */
export function ArticlesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
