'use client';

import { useQuery } from '@tanstack/react-query';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useMemo } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  industry?: string;
  category?: string;
  tags?: string[];
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  is_personalized: boolean;
  tier: string;
  is_saved?: boolean;
  published_at: string;
  generation_stats?: {
    total: number;
    hasKeyInsights: boolean;
    hasVideoScript: boolean;
    hasEmailTemplate: boolean;
    hasSocialMedia: boolean;
    socialPlatforms: string[];
  };
}

interface ArticlesResponse {
  articles: Article[];
  user_tier: string;
  subscription_status: string | null;
  monthly_generations_used: number;
  monthly_generation_limit: number;
  saved_article_ids: string[];
  total_count: number;
  requires_upgrade?: boolean;
  has_more?: boolean;
  next_cursor?: string | null;
  page_size?: number;
}

interface UseArticlesParams {
  // Legacy filter params (backward compatibility)
  industry?: string | null;
  category?: string | null;
  tags?: string | null;
  saved?: string | null;

  // New filter params (from ArticleFilterBar)
  search?: string | null;
  sort?: string | null;
  categories?: string | null;
  personalizations?: string | null;

  // Pagination params
  page_size?: number;
  cursor?: string | null;

  // Control params
  enabled?: boolean;
  limit?: number;
}

/**
 * Custom hook to fetch articles with React Query caching
 *
 * Features:
 * - Automatic caching (1 minute stale time, 5 minutes gc time)
 * - Automatic refetching when params change
 * - Race condition handling via React Query
 * - Loading and error states
 * - No duplicate requests
 * - Memoized search params to prevent unnecessary fetches
 *
 * @param params - Filter parameters for articles
 * @returns React Query result with articles data
 *
 * @example
 * // Basic usage
 * const { data, isLoading, error } = useArticles();
 *
 * @example
 * // With filters
 * const { data, isLoading } = useArticles({
 *   search: 'mortgage',
 *   sort: 'newest',
 *   categories: 'mortgage,leadership',
 *   tags: 'rates,market',
 *   personalizations: 'video_script,email_template'
 * });
 */
export function useArticles(params: UseArticlesParams = {}) {
  const { isAuthenticated } = useKindeBrowserClient();

  // Memoize search params to prevent unnecessary fetches
  const searchParamsString = useMemo(() => {
    const queryParams = new URLSearchParams();

    // Legacy params (backward compatibility)
    if (params.industry) queryParams.append('industry', params.industry);
    if (params.category) queryParams.append('category', params.category);
    if (params.tags) queryParams.append('tags', params.tags);

    // Only include saved param if authenticated
    if (params.saved === 'true' && isAuthenticated) {
      queryParams.append('saved', 'true');
    }

    // New filter params
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.personalizations) queryParams.append('personalizations', params.personalizations);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    // Pagination params
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params.cursor) queryParams.append('cursor', params.cursor);

    return queryParams.toString();
  }, [
    params.industry,
    params.category,
    params.tags,
    params.saved,
    params.search,
    params.sort,
    params.categories,
    params.personalizations,
    params.limit,
    params.page_size,
    params.cursor,
    isAuthenticated,
  ]);

  // Memoize query key to prevent unnecessary re-renders
  const queryKey = useMemo(
    () => [
      'articles',
      params.industry,
      params.category,
      params.tags,
      params.saved,
      params.search,
      params.sort,
      params.categories,
      params.personalizations,
      params.limit,
      params.page_size,
      params.cursor,
      isAuthenticated,
    ],
    [
      params.industry,
      params.category,
      params.tags,
      params.saved,
      params.search,
      params.sort,
      params.categories,
      params.personalizations,
      params.limit,
      params.page_size,
      params.cursor,
      isAuthenticated,
    ]
  );

  return useQuery<ArticlesResponse>({
    queryKey,
    queryFn: async ({ signal }) => {
      // React Query passes an AbortSignal for automatic race condition handling
      const response = await fetch(`/api/articles?${searchParamsString}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      return response.json();
    },
    enabled: params.enabled !== false,
    staleTime: 60 * 1000, // 1 minute - data stays fresh
    gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time
  });
}

/**
 * Custom hook to fetch user data with React Query caching
 *
 * Features:
 * - Automatic caching (5 minutes stale time)
 * - Only fetches when user is authenticated
 * - Loading and error states
 * - Automatic retry on failure
 *
 * @param isAuthenticated - Whether the user is authenticated
 * @returns React Query result with user data
 */
export function useUser(isAuthenticated: boolean) {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) {
        if (response.status === 401) {
          return null; // Not authenticated
        }
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - user data changes infrequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once for user data
  });
}

export type { Article, ArticlesResponse };
