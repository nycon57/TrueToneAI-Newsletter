'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

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
}

interface UseArticlesParams {
  industry?: string | null;
  category?: string | null;
  tags?: string | null;
  saved?: string | null;
  enabled?: boolean;
}

/**
 * Custom hook to fetch articles with React Query caching
 *
 * Features:
 * - Automatic caching (1 minute stale time, 5 minutes gc time)
 * - Automatic refetching when params change
 * - Loading and error states
 * - No duplicate requests
 *
 * @param params - Filter parameters for articles
 * @returns React Query result with articles data
 */
export function useArticles(params: UseArticlesParams = {}) {
  const { isAuthenticated } = useKindeBrowserClient();

  const queryParams = new URLSearchParams();
  if (params.industry) queryParams.append('industry', params.industry);
  if (params.category) queryParams.append('category', params.category);
  if (params.tags) queryParams.append('tags', params.tags);

  // Only include saved param if authenticated
  const effectiveSaved = params.saved === 'true' && isAuthenticated ? 'true' : undefined;
  if (effectiveSaved) {
    queryParams.append('saved', 'true');
  }

  return useQuery<ArticlesResponse>({
    // Include authentication state in queryKey to prevent cache collisions
    queryKey: ['articles', params.industry, params.category, params.tags, effectiveSaved, isAuthenticated],
    queryFn: async () => {
      const response = await fetch(`/api/articles?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
    enabled: params.enabled !== false,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
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
