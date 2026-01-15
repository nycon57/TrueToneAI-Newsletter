import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender/20 via-white to-lavender/20 p-4">
      <Card className="max-w-xl w-full shadow-lg border-0">
        <CardHeader className="text-center">
          {/* Logo skeleton */}
          <Skeleton className="h-10 w-40 mx-auto mb-4" />
          {/* Progress bar skeleton */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={`step-${i}`} className="h-2 w-16 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form fields skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
          {/* Buttons skeleton */}
          <div className="flex justify-between pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
