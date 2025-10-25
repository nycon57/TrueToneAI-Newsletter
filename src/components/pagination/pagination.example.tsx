/**
 * Pagination Components - Usage Examples
 *
 * This file demonstrates how to use both pagination options with the
 * TrueTone AI Newsletter article listing.
 */

'use client';

import { useState, useEffect } from 'react';
import { InfiniteScroll, PageControls } from './index';
import { useArticles } from '@/hooks/use-articles';
import { ArticleCard } from '@/components/article/ArticleCard';
import { motion } from 'motion/react';

// ============================================================================
// OPTION A: Infinite Scroll Example
// ============================================================================

/**
 * Example 1: Basic Infinite Scroll
 *
 * Shows a "Load More" button that loads articles incrementally.
 * Perfect for mobile-first experiences where users scroll through content.
 */
export function InfiniteScrollExample() {
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const ARTICLES_PER_PAGE = 10;

  const {
    data: articlesData,
    isLoading,
    error
  } = useArticles({
    limit: page * ARTICLES_PER_PAGE,
    enabled: true,
  });

  // Update articles when data changes
  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.total_count || 0;
  const hasMore = articles.length < totalCount;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article List */}
        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ArticleCard
                article={article}
                isAuthenticated={true}
                isPaid={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Infinite Scroll - Load More Button */}
        <InfiniteScroll
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
          error={error ? 'Failed to load articles' : null}
        />
      </div>
    </div>
  );
}

/**
 * Example 2: Infinite Scroll with Skeleton Loader
 *
 * Uses skeleton screens for better perceived performance during loading.
 */
export function InfiniteScrollWithSkeletonExample() {
  const [page, setPage] = useState(1);

  const {
    data: articlesData,
    isLoading,
  } = useArticles({
    limit: page * 10,
    enabled: true,
  });

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.total_count || 0;
  const hasMore = articles.length < totalCount;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isAuthenticated={true}
            isPaid={true}
          />
        ))}
      </div>

      <InfiniteScroll
        hasMore={hasMore}
        onLoadMore={() => setPage(prev => prev + 1)}
        isLoading={isLoading}
        showSkeleton={true}
        skeletonCount={3}
      />
    </div>
  );
}

// ============================================================================
// OPTION B: Page Controls Example
// ============================================================================

/**
 * Example 3: Traditional Pagination
 *
 * Shows numbered pages with prev/next controls.
 * Better for desktop experiences and when users need to jump to specific pages.
 */
export function PageControlsExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 10;

  const {
    data: articlesData,
    isLoading,
  } = useArticles({
    limit: ARTICLES_PER_PAGE,
    enabled: true,
  });

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.total_count || 0;
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article List */}
        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ArticleCard
                article={article}
                isAuthenticated={true}
                isPaid={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Page Controls */}
        <PageControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

/**
 * Example 4: Page Controls with Custom Settings
 *
 * Demonstrates advanced configuration options.
 */
export function PageControlsAdvancedExample() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: articlesData,
    isLoading,
  } = useArticles({
    limit: 20,
    enabled: true,
  });

  const totalPages = Math.ceil((articlesData?.total_count || 0) / 20);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Articles would go here */}
      </div>

      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        showFirstLast={true} // Show first/last page buttons
        maxPageButtons={7} // Show up to 7 page numbers
        scrollToTop={true} // Auto-scroll to top on page change
        scrollOffset={100} // Scroll to 100px from top (account for header)
      />
    </div>
  );
}

// ============================================================================
// HYBRID APPROACH: Responsive Pagination
// ============================================================================

/**
 * Example 5: Hybrid Approach - Responsive Pagination
 *
 * Uses infinite scroll on mobile and page controls on desktop.
 * This provides the best UX for each device type.
 */
export function ResponsivePaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const ARTICLES_PER_PAGE = 10;

  // Detect mobile viewport using media query
  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Update on change
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const {
    data: articlesData,
    isLoading,
  } = useArticles({
    limit: isMobile ? currentPage * ARTICLES_PER_PAGE : ARTICLES_PER_PAGE,
    enabled: true,
  });

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.total_count || 0;
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);
  const hasMore = articles.length < totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            >
              <ArticleCard
                article={article}
                isAuthenticated={true}
                isPaid={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Infinite Scroll */}
        <div className="md:hidden">
          <InfiniteScroll
            hasMore={hasMore}
            onLoadMore={() => setCurrentPage(prev => prev + 1)}
            isLoading={isLoading}
            showSkeleton={true}
          />
        </div>

        {/* Desktop: Page Controls */}
        <div className="hidden md:block">
          <PageControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
            scrollToTop={true}
            scrollOffset={80} // Account for sticky header
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTEGRATION WITH EXISTING HOME PAGE
// ============================================================================

/**
 * Example 6: Integration with Home Page Client
 *
 * Shows how to integrate pagination with the existing home-page-client.tsx
 */
export function HomePageWithPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 10;

  // Use existing useArticles hook with pagination
  const {
    data: articlesData,
    isLoading,
    error
  } = useArticles({
    limit: ARTICLES_PER_PAGE,
    enabled: true,
  });

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.total_count || 0;
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      {/* Header would go here */}

      {/* Hero Section would go here */}

      {/* Articles Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
            >
              <ArticleCard
                article={article}
                isAuthenticated={true}
                isPaid={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Choose your pagination style */}
        {/* Option A: Infinite Scroll */}
        {/* <InfiniteScroll
          hasMore={articles.length < totalCount}
          onLoadMore={() => setCurrentPage(prev => prev + 1)}
          isLoading={isLoading}
        /> */}

        {/* Option B: Page Controls */}
        <PageControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © 2024 Spark by TrueTone AI. Curated insights for sales professionals who lead.
        </div>
      </div>
    </div>
  );
}
