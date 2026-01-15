import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Pricing cards skeleton */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <Card key={`price-${i}`} className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Skeleton className="h-6 w-20 mx-auto mb-2" />
                <Skeleton className="h-10 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features skeleton */}
                {[...Array(5)].map((_, j) => (
                  <div key={`feature-${i}-${j}`} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
