import { Suspense } from 'react';
import { Sparkles, FileText } from 'lucide-react';
import Image from 'next/image';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// UI Components
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Server Components
import { ArticlesListServer } from './articles-list-server';
import { UserHeaderServer } from './user-header-server';

/**
 * Server Component Homepage
 * Benefits:
 * - Initial HTML sent from server (faster FCP)
 * - Parallel data fetching
 * - Streaming with Suspense boundaries
 * - Better SEO
 */
export default async function HomePageServer({
  searchParams
}: {
  searchParams: { industry?: string; category?: string; tags?: string; saved?: string }
}) {
  // Check authentication on server
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();
  const user = authenticated ? await getUser() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      {/* Header with Suspense boundary */}
      <Suspense fallback={<HeaderSkeleton />}>
        <UserHeaderServer />
      </Suspense>

      {/* Hero Section - Immediately visible */}
      <div className="relative overflow-hidden py-16">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div>
            {authenticated && user && (
              <div className="inline-flex items-center gap-2 bg-lavender/30 text-orchid px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Welcome back, {user.given_name || 'there'}!</span>
              </div>
            )}
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {authenticated ? 'Your Market Intelligence' : 'Market Intelligence'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {authenticated
                ? 'AI-personalized mortgage market insights, crafted for your unique voice and style.'
                : 'Stay ahead with real-time mortgage market insights and professionally crafted content. Sign up for personalized AI content.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Articles with streaming */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <Suspense fallback={<ArticlesSkeletonLoader />}>
          <ArticlesListServer searchParams={searchParams} />
        </Suspense>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © 2024 TrueTone AI. Built for ambitious, top-producing, hyper-growth Loan Officers.
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for header
 */
function HeaderSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for articles
 */
function ArticlesSkeletonLoader() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <Card key={i} className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}