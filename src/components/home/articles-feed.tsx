import { Suspense } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArticlesList } from './articles-list';
import { ArticlesSkeleton } from './articles-skeleton';

interface ArticlesFeedProps {
  searchParams: {
    industry?: string;
    category?: string;
    tags?: string;
    saved?: string;
  };
}

/**
 * Server component that fetches articles data
 * Uses Suspense for streaming - shows skeleton while loading
 */
async function ArticlesData({ searchParams }: ArticlesFeedProps) {
  // Get user authentication
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const isAuthenticated = !!kindeUser;

  // Fetch articles from API
  const params = new URLSearchParams();
  if (searchParams.industry) params.append('industry', searchParams.industry);
  if (searchParams.category) params.append('category', searchParams.category);
  if (searchParams.tags) params.append('tags', searchParams.tags);
  if (searchParams.saved === 'true' && isAuthenticated) {
    params.append('saved', 'true');
  }

  // Fetch from API (with ISR caching)
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/articles?${params.toString()}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  const data = await response.json();

  return (
    <ArticlesList
      articles={data.articles}
      isAuthenticated={isAuthenticated}
      isFreeUser={!isAuthenticated || data.user_tier === 'FREE'}
    />
  );
}

/**
 * Articles feed with Suspense streaming
 * Shows skeleton immediately while data loads in the background
 */
export function ArticlesFeed({ searchParams }: ArticlesFeedProps) {
  return (
    <Suspense fallback={<ArticlesSkeleton />}>
      <ArticlesData searchParams={searchParams} />
    </Suspense>
  );
}
