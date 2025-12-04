'use client';

import { useState, useTransition, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  fadeInUp,
  staggeredContainer,
  staggeredItem,
  springs,
  stagger,
} from '@/lib/motion';
import { Sparkles, UserPlus, FileText } from 'lucide-react';
import Image from 'next/image';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useArticles } from '@/hooks/use-articles';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NavUser } from '@/components/ui/nav-user';
import { GenerationLimitBadge } from '@/components/ai/GenerationLimitBadge';

// Article Modal
import { useArticleModal } from '@/lib/context';

// Filter Components
import { ArticleFilterBar, type ArticleFilters } from '@/components/filters';
import type { PersonalizationType } from '@/components/filters/PersonalizationsMultiselect';

// Custom Components - Lazy load non-critical components
import dynamic from 'next/dynamic';
import { InfiniteScroll } from '@/components/pagination/InfiniteScroll';

const ArticleCard = dynamic(() => import('@/components/article/ArticleCard').then(mod => ({ default: mod.ArticleCard })), {
  ssr: true,
});

const SimpleArticleModal = dynamic(() => import('@/components/article/SimpleArticleModal').then(mod => ({ default: mod.SimpleArticleModal })), {
  ssr: true,
});

const UpgradePrompt = dynamic(() => import('@/components/upgrade/UpgradePrompt').then(mod => ({ default: mod.UpgradePrompt })), {
  ssr: true,
});

const LockedGenerationsCard = dynamic(() => import('@/components/upgrade/LockedGenerationsCard').then(mod => ({ default: mod.LockedGenerationsCard })), {
  ssr: true,
});

interface HomePageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialArticles: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialUser: any;
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kindeUser: any;
  filters: {
    industry: string | null;
    category: string | null;
    tags: string | null;
    saved: string | null;
  };
}

/**
 * Client component for the home page
 * Receives server-fetched data as props to minimize client-side loading
 */
export function HomePageClient({
  initialArticles,
  initialUser,
  isAuthenticated: serverAuth,
  kindeUser: serverKindeUser,
  filters,
}: HomePageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Client-only hydration flag to prevent auth mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use server data as initial state - with setter for real-time updates
  const [user, setUser] = useState(initialUser);

  // Article Modal state
  const { isOpen, article, closeArticle} = useArticleModal();

  // Pagination state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allArticles, setAllArticles] = useState<any[]>(initialArticles?.articles || []);
  const [cursor, setCursor] = useState<string | null>(initialArticles?.next_cursor || null);
  const [hasMore, setHasMore] = useState<boolean>(initialArticles?.has_more || false);

  // URL state management for all filters
  const [searchParam, setSearchParam] = useQueryState('search');
  const [sortParam, setSortParam] = useQueryState('sort');
  const [categoriesParam, setCategoriesParam] = useQueryState('categories');
  const [tagsParam, setTagsParam] = useQueryState('tags');
  const [personalizationsParam, setPersonalizationsParam] = useQueryState('personalizations');

  // Valid personalization types
  const VALID_PERSONALIZATIONS: PersonalizationType[] = ['default', 'key_insights', 'video_script', 'email_template', 'social_media'];

  // Parse URL params into filter object (memoized to prevent infinite loops)
  const articleFilters: ArticleFilters = useMemo(() => {
    // Validate personalizations from URL
    const validatedPersonalizations: PersonalizationType[] = personalizationsParam
      ? personalizationsParam
          .split(',')
          .filter((value): value is PersonalizationType =>
            VALID_PERSONALIZATIONS.includes(value as PersonalizationType)
          )
      : [];

    return {
      search: searchParam || '',
      sort: sortParam || 'newest',
      categories: categoriesParam ? categoriesParam.split(',') : [],
      tags: tagsParam ? tagsParam.split(',') : [],
      personalizations: validatedPersonalizations,
    };
  }, [searchParam, sortParam, categoriesParam, tagsParam, personalizationsParam]);

  // Client-side Kinde hooks for logout only
  // We trust the server auth status completely to avoid 1+ second delay
  const kindeClient = useKindeBrowserClient();

  // Create a proper logout handler
  const handleLogout = async () => {
    console.log('[HomePageClient] handleLogout called');
    try {
      // Kinde logout is done via a redirect to /api/auth/logout
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error('[HomePageClient] Logout error:', error);
    }
  };

  // Use server auth status (authoritative and instant)
  const isAuthenticated = serverAuth;
  const kindeUser = serverKindeUser;

  const normalizedTier = user?.subscription_tier?.toUpperCase() || 'FREE';
  const isPaid = normalizedTier === 'PAID' || normalizedTier === 'PREMIUM';
  const isFreeUser = !isAuthenticated || normalizedTier === 'FREE';

  // Locked generations count for free users
  const [lockedGenerationsCount, setLockedGenerationsCount] = useState<number>(0);

  // Fetch locked generations count for free users
  useEffect(() => {
    if (isAuthenticated && isFreeUser) {
      fetch('/api/user/locked-generations')
        .then(res => res.json())
        .then(data => {
          if (data.count) {
            setLockedGenerationsCount(data.count);
          }
        })
        .catch(err => console.error('Error fetching locked generations:', err));
    }
  }, [isAuthenticated, isFreeUser]);

  // Calculate generation stats from user data
  const userGenerationStats = isAuthenticated && user ? {
    remaining: Math.max(0, (user.monthly_generation_limit || 25) - (user.monthly_generations_used || 0)),
    limit: user.monthly_generation_limit || 25,
    tier: normalizedTier.toLowerCase() as 'free' | 'paid' | 'premium',
    resetDate: user.generation_reset_date || undefined
  } : undefined;

  // Callback to update generation count in real-time when a generation completes
  const handleGenerationComplete = useCallback(() => {
    setUser((prevUser: typeof initialUser) => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        monthly_generations_used: (prevUser.monthly_generations_used || 0) + 1
      };
    });
  }, []);

  // Use the enhanced useArticles hook for data fetching
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
    refetch
  } = useArticles({
    // Legacy filters from server props
    industry: filters.industry,
    saved: filters.saved,
    // New filter params from ArticleFilterBar
    search: searchParam,
    sort: sortParam,
    categories: categoriesParam,
    tags: tagsParam,
    personalizations: personalizationsParam,
    // Pagination params
    page_size: 9, // Load 9 articles at a time for paid users
    cursor: cursor, // Use the current cursor
    // Enable automatic fetching when filters change
    enabled: true,
  });

  // Reset pagination when filter params change
  useEffect(() => {
    setCursor(null);
    setHasMore(false);
  }, [searchParam, sortParam, categoriesParam, tagsParam, personalizationsParam]);

  // Update articles when filter results come in
  useEffect(() => {
    if (articlesData?.articles) {
      // Check if we're paginating (have existing articles) or filtering (starting fresh)
      if (allArticles.length > 0 && cursor !== null) {
        // Pagination: append new articles, avoiding duplicates
        setAllArticles(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newArticles = articlesData.articles.filter((a: any) => !existingIds.has(a.id));
          return [...prev, ...newArticles];
        });
      } else {
        // Initial load or filter change: replace articles
        setAllArticles(articlesData.articles);
      }
      setHasMore(articlesData.has_more || false);
    }
  }, [articlesData, cursor, allArticles.length]);

  // Always display accumulated articles (starting with initial articles)
  const articles = allArticles;

  // Handle loading more articles
  const handleLoadMore = useCallback(async () => {
    if (!isPaid || !hasMore || isLoadingArticles || !articlesData?.next_cursor) return;

    try {
      // Update cursor to trigger automatic refetch with next page
      // The useEffect above will handle appending the new articles
      setCursor(articlesData.next_cursor);
    } catch (error) {
      console.error('Error loading more articles:', error);
    }
  }, [isPaid, hasMore, isLoadingArticles, articlesData]);

  // Handle all filter changes (memoized to prevent infinite loops)
  const handleFiltersChange = useCallback((newFilters: ArticleFilters) => {
    // Validate personalizations before writing to URL
    const validatedPersonalizations = newFilters.personalizations.filter((value) =>
      VALID_PERSONALIZATIONS.includes(value)
    );

    // Update URL params (this will trigger a refetch via useArticles)
    // The useEffect will handle updating the articles when new data arrives
    setSearchParam(newFilters.search || null);
    setSortParam(newFilters.sort !== 'newest' ? newFilters.sort : null);
    setCategoriesParam(newFilters.categories.length > 0 ? newFilters.categories.join(',') : null);
    setTagsParam(newFilters.tags.length > 0 ? newFilters.tags.join(',') : null);
    setPersonalizationsParam(validatedPersonalizations.length > 0 ? validatedPersonalizations.join(',') : null);
  }, [setSearchParam, setSortParam, setCategoriesParam, setTagsParam, setPersonalizationsParam]);

  // Handle filter changes with transitions for smooth updates (for old filters)
  const handleFilterChange = (newFilters: Record<string, string>) => {
    startTransition(() => {
      const params = new URLSearchParams();
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-lavender/30" suppressHydrationWarning>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="relative h-10">
              <Image
                src="/logo/landscape/TrueToneAI-Landscape-Logo-Full-Color.png"
                alt="TrueTone AI"
                width={200}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-3" suppressHydrationWarning>
              {mounted ? (
                <>
                  {/* AI Generation Limit Badge - Show for ALL authenticated users */}
                  {isAuthenticated && user && userGenerationStats && (
                    <GenerationLimitBadge
                      remaining={userGenerationStats.remaining}
                      limit={userGenerationStats.limit}
                      tier={userGenerationStats.tier}
                      resetDate={userGenerationStats.resetDate}
                    />
                  )}

                  {isAuthenticated ? (
                    <NavUser
                      user={{
                        name: `${kindeUser?.given_name || user?.firstName || 'User'} ${kindeUser?.family_name || user?.lastName || ''}`.trim(),
                        email: kindeUser?.email || user?.email || '',
                        avatar: user?.avatar || kindeUser?.picture || '',
                        subscription_tier: user?.subscription_tier?.toUpperCase() || 'FREE',
                        role: user?.role || 'user'
                      }}
                      onLogout={handleLogout}
                    />
                  ) : (
                    <div className="flex items-center gap-4">
                      <LoginLink
                        postLoginRedirectURL="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        Login
                      </LoginLink>
                      <RegisterLink postLoginRedirectURL="/onboarding">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </RegisterLink>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-10 w-32" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {isAuthenticated && (
              <motion.div
                variants={staggeredItem}
                className="inline-flex items-center gap-2 bg-lavender/30 text-orchid px-4 py-2 rounded-full text-sm font-medium"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                <span>Welcome back, {kindeUser?.given_name || user?.firstName || user?.name || 'there'}!</span>
              </motion.div>
            )}
            <motion.h1
              variants={staggeredItem}
              className="text-5xl font-bold text-gray-900 leading-tight"
            >
              {isAuthenticated
                ? (isPaid ? 'Your Spark Content' : 'Spark Newsletter')
                : 'Spark Newsletter for Sales Pros'
              }
            </motion.h1>
            <motion.p
              variants={staggeredItem}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              {!isAuthenticated
                ? 'Curated market insights for sales professionals. Subscribe to Spark and turn industry news into content you can share with your audience.'
                : (isPaid
                    ? 'Your weekly Spark content, ready to personalize with AI. Copy scripts, transform articles for your voice, and share with your audience in seconds.'
                    : 'Your weekly Spark newsletter with curated market insights. Upgrade to unlock AI personalization and create content in your unique voice.'
                  )
              }
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Filter and Sort Controls - Only show for paid users */}
      {isPaid && (
        <div className="max-w-4xl mx-auto px-4 pb-6">
          {/* Article Filters */}
          <ArticleFilterBar
            filters={articleFilters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      )}

      {/* Articles - Optimized with minimal animations */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="space-y-6" style={{ opacity: isPending || isLoadingArticles ? 0.6 : 1 }}>
          {isLoadingArticles && isPaid ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orchid" />
                  <span className="text-gray-600">Loading articles...</span>
                </div>
              </CardContent>
            </Card>
          ) : articles.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles available</h3>
                <p className="text-gray-600">Check back later for new content.</p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="popLayout">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {articles.map((article: any, index: number) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={{
                    ...springs.gentle,
                    delay: Math.min(index * stagger.fast, 0.25),
                  }}
                >
                  <ArticleCard
                    article={article}
                    isAuthenticated={isAuthenticated}
                    isPaid={isPaid}
                    userGenerationStats={userGenerationStats}
                    onGenerationComplete={handleGenerationComplete}
                  />
                </motion.div>
              ))}

              {/* Show locked generations card for free users with saved content */}
              {isFreeUser && isAuthenticated && lockedGenerationsCount > 0 && (
                <motion.div
                  key="locked-generations"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springs.gentle}
                >
                  <LockedGenerationsCard lockedCount={lockedGenerationsCount} />
                </motion.div>
              )}

              {/* Show upgrade prompt after 3rd article for free users */}
              {isFreeUser && articles.length >= 3 && (
                <motion.div
                  key="upgrade-prompt"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springs.gentle}
                >
                  <UpgradePrompt />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Infinite Scroll - Only for paid users */}
          {isPaid && (
            <InfiniteScroll
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              isLoading={isLoadingArticles}
              showSkeleton={true}
              skeletonCount={2}
              autoLoad={true}
              threshold={400}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © 2024 Spark by TrueTone AI. Curated insights for sales professionals who lead.
        </div>
      </div>

      {/* Simple Article Reading Modal */}
      <SimpleArticleModal
        isOpen={isOpen}
        onClose={closeArticle}
        article={article}
      />
    </div>
  );
}