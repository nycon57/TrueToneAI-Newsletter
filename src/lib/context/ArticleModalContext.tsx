'use client';

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsString } from 'nuqs';

// ============================================================================
// Types
// ============================================================================

/**
 * Article data structure matching the API response
 */
export interface Article {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null; // Full markdown content for article modal
  content_type: string;
  industry?: string | null;
  category?: string | null;
  tags: string[];
  published_at: string;
  keyInsights: string[];
  videoScript: string;
  emailTemplate: string;
  socialContent: Record<string, string>;
  is_personalized: boolean;
  tier?: string;
  generation_stats?: {
    total: number;
    hasKeyInsights: boolean;
    hasVideoScript: boolean;
    hasEmailTemplate: boolean;
    hasSocialMedia: boolean;
    socialPlatforms: string[];
  };
}

/**
 * Article modal state
 */
export interface ArticleModalState {
  isOpen: boolean;
  articleId: string | null;
  article: Article | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Article modal context value
 */
export interface ArticleModalContextValue {
  // State
  isOpen: boolean;
  articleId: string | null;
  article: Article | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  openArticle: (articleId: string, article?: Article) => void;
  closeArticle: () => void;

  // Utilities
  isArticleOpen: (articleId: string) => boolean;
}

// ============================================================================
// Context
// ============================================================================

const ArticleModalContext = createContext<ArticleModalContextValue | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

export interface ArticleModalProviderProps {
  children: React.ReactNode;
  /**
   * Optional callback when article modal opens
   */
  onArticleOpen?: (articleId: string) => void;
  /**
   * Optional callback when article modal closes
   */
  onArticleClose?: () => void;
  /**
   * Optional custom article fetcher
   * If not provided, will fetch from /api/articles/[id]
   */
  fetchArticle?: (articleId: string) => Promise<Article>;
  /**
   * Whether to preserve scroll position when closing modal
   * @default true
   */
  preserveScrollPosition?: boolean;
}

// ============================================================================
// Provider Component
// ============================================================================

export function ArticleModalProvider({
  children,
  onArticleOpen,
  onArticleClose,
  fetchArticle,
  preserveScrollPosition = true,
}: ArticleModalProviderProps) {
  // URL state management using nuqs
  const [articleIdParam, setArticleIdParam] = useQueryState('article', parseAsString);

  // Internal state
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for scroll position preservation
  const scrollPositionRef = useRef<number>(0);
  const isModalOpenRef = useRef(false);

  // Derived state
  const isOpen = !!articleIdParam;
  const articleId = articleIdParam;

  /**
   * Default article fetcher - fetches from API
   */
  const defaultFetchArticle = useCallback(async (id: string): Promise<Article> => {
    const response = await fetch(`/api/articles/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    const data = await response.json();
    return data.article;
  }, []);

  const articleFetcher = fetchArticle || defaultFetchArticle;

  /**
   * Open article modal
   */
  const openArticle = useCallback((id: string, existingArticle?: Article) => {
    // Save scroll position before opening
    if (preserveScrollPosition) {
      scrollPositionRef.current = window.scrollY;
    }

    // If article data is provided, use it immediately
    if (existingArticle) {
      setArticle(existingArticle);
      setError(null);
    } else {
      // Otherwise, will fetch in useEffect
      setArticle(null);
    }

    // Update URL to open modal
    setArticleIdParam(id);
    isModalOpenRef.current = true;

    // Call callback
    onArticleOpen?.(id);
  }, [setArticleIdParam, onArticleOpen, preserveScrollPosition]);

  /**
   * Close article modal
   */
  const closeArticle = useCallback(() => {
    // Clear URL parameter
    setArticleIdParam(null);

    // Clear state
    setArticle(null);
    setError(null);
    setIsLoading(false);

    // Restore scroll position
    if (preserveScrollPosition && isModalOpenRef.current) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }

    isModalOpenRef.current = false;

    // Call callback
    onArticleClose?.();
  }, [setArticleIdParam, onArticleClose, preserveScrollPosition]);

  /**
   * Check if a specific article is currently open
   */
  const isArticleOpen = useCallback((id: string): boolean => {
    return isOpen && articleId === id;
  }, [isOpen, articleId]);

  /**
   * Fetch article data when articleId changes
   */
  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // If we already have article data, don't refetch
    if (article && article.id === articleId) {
      return;
    }

    // Fetch article data
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await articleFetcher(articleId);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to load article');
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, articleFetcher]);

  /**
   * Handle browser back button
   */
  useEffect(() => {
    const handlePopState = () => {
      // If modal was open and URL changed to close it, restore scroll
      if (isModalOpenRef.current && !articleIdParam && preserveScrollPosition) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
        isModalOpenRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articleIdParam, preserveScrollPosition]);

  /**
   * Prevent body scroll when modal is open
   */
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent scroll on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Context value
  const value: ArticleModalContextValue = {
    isOpen,
    articleId,
    article,
    isLoading,
    error,
    openArticle,
    closeArticle,
    isArticleOpen,
  };

  return (
    <ArticleModalContext.Provider value={value}>
      {children}
    </ArticleModalContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access article modal context
 *
 * @throws Error if used outside ArticleModalProvider
 *
 * @example
 * ```tsx
 * function ArticleCard({ article }) {
 *   const { openArticle, isArticleOpen } = useArticleModal();
 *
 *   return (
 *     <div onClick={() => openArticle(article.id, article)}>
 *       <h3>{article.title}</h3>
 *       {isArticleOpen(article.id) && <Badge>Open</Badge>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ArticleModal() {
 *   const { isOpen, article, isLoading, error, closeArticle } = useArticleModal();
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <Dialog open={isOpen} onOpenChange={closeArticle}>
 *       {isLoading && <Spinner />}
 *       {error && <Error message={error} />}
 *       {article && (
 *         <div>
 *           <h1>{article.title}</h1>
 *           <p>{article.summary}</p>
 *         </div>
 *       )}
 *     </Dialog>
 *   );
 * }
 * ```
 */
export function useArticleModal(): ArticleModalContextValue {
  const context = useContext(ArticleModalContext);

  if (!context) {
    throw new Error('useArticleModal must be used within ArticleModalProvider');
  }

  return context;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Get article URL with query parameter
 * Useful for generating shareable links
 *
 * @example
 * ```tsx
 * const shareUrl = getArticleUrl(article.id, '/feed');
 * // Returns: /feed?article=abc-123
 * ```
 */
export function getArticleUrl(articleId: string, basePath = ''): string {
  const params = new URLSearchParams();
  params.set('article', articleId);
  return `${basePath}?${params.toString()}`;
}

/**
 * Parse article ID from URL
 * Useful for server-side rendering or initial state
 *
 * @example
 * ```tsx
 * const articleId = parseArticleIdFromUrl(window.location.search);
 * ```
 */
export function parseArticleIdFromUrl(search: string): string | null {
  const params = new URLSearchParams(search);
  return params.get('article');
}
