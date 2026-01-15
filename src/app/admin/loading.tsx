import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r p-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={`stat-${i}`} className="bg-white p-6 rounded-lg shadow">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={`row-${i}`} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
