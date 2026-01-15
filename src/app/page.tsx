import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { prefetchArticles } from '@/lib/data/articles-server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getCachedApiUserSafe, CrossProductAccessError } from '@/lib/api/auth-cached';
import { HomePageClient } from './home-page-client';
import { ArticlesFeedSkeleton } from '@/components/home/articles-feed-skeleton';

/**
 * Server Component - Home Page
 * Fetches data on the server for optimal performance
 * Uses Suspense streaming for instant loading
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get search params
  const params = await searchParams;
  const industry = typeof params.industry === 'string' ? params.industry : null;
  const category = typeof params.category === 'string' ? params.category : null;
  const tags = typeof params.tags === 'string' ? params.tags : null;
  const saved = typeof params.saved === 'string' ? params.saved : null;

  // Get authentication status
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  const kindeUser = isAuth ? await getUser() : null;

  // Fetch user data from database (includes avatar)
  // Handle cross-product access (TrueTone user trying to access Newsletter)
  let user = null;
  if (isAuth) {
    try {
      user = await getCachedApiUserSafe();
    } catch (error) {
      if (error instanceof CrossProductAccessError) {
        const upgradeUrl = new URL('/upgrade-to-newsletter', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        upgradeUrl.searchParams.set('source', error.sourceProduct);
        if (error.email) {
          upgradeUrl.searchParams.set('email', error.email);
        }
        redirect(upgradeUrl.pathname + upgradeUrl.search);
      }
      // For other errors, continue without user
      console.error('[HomePage] Error fetching user:', error);
    }
  }

  // Fetch articles on the server
  const articlesData = await prefetchArticles({
    industry,
    category,
    tags,
    saved,
    isAuthenticated: isAuth,
  });

  return (
    <Suspense fallback={<ArticlesFeedSkeleton />}>
      <HomePageClient
        initialArticles={articlesData}
        initialUser={user}
        isAuthenticated={isAuth}
        kindeUser={kindeUser}
        filters={{ industry, category, tags, saved }}
      />
    </Suspense>
  );
}

// Enable static generation for better performance
export const dynamic = 'force-dynamic'; // Required for auth
export const revalidate = 60; // Revalidate every 60 seconds