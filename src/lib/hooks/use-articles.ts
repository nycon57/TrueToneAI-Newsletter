import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ArticleFilters {
  industry?: string;
  category?: string;
  tags?: string;
  saved?: string;
}

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

/**
 * Custom hook for fetching articles with caching
 */
export function useArticles(filters: ArticleFilters = {}) {
  const params = new URLSearchParams();

  if (filters.industry) params.append('industry', filters.industry);
  if (filters.category) params.append('category', filters.category);
  if (filters.tags) params.append('tags', filters.tags);
  if (filters.saved) params.append('saved', filters.saved);

  return useQuery<ArticlesResponse>({
    queryKey: ['articles', filters],
    queryFn: async () => {
      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      return response.json();
    },
    // Cache configuration
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: 'always', // Refetch when reconnecting
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Custom hook for fetching a single article
 */
export function useArticle(articleId: string | null) {
  return useQuery<Article>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      if (!articleId) throw new Error('Article ID required');

      const response = await fetch(`/api/articles/${articleId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      return response.json();
    },
    enabled: !!articleId, // Only run query if articleId exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Custom hook for saving/unsaving articles
 */
export function useSaveArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, saved }: { articleId: string; saved: boolean }) => {
      const response = await fetch(`/api/articles/${articleId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved }),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData<ArticlesResponse>(
        ['articles'],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            articles: oldData.articles.map((article) =>
              article.id === variables.articleId
                ? { ...article, is_saved: variables.saved }
                : article
            ),
            saved_article_ids: variables.saved
              ? [...oldData.saved_article_ids, variables.articleId]
              : oldData.saved_article_ids.filter((id) => id !== variables.articleId),
          };
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

/**
 * Custom hook for user data with caching
 */
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/user');

      if (!response.ok) {
        if (response.status === 401) {
          return null; // User not authenticated
        }
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: false, // Don't retry auth failures
  });
}

/**
 * Prefetch articles for faster navigation
 */
export function usePrefetchArticles() {
  const queryClient = useQueryClient();

  return (filters: ArticleFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: ['articles', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters.industry) params.append('industry', filters.industry);
        if (filters.category) params.append('category', filters.category);
        if (filters.tags) params.append('tags', filters.tags);
        if (filters.saved) params.append('saved', filters.saved);

        const response = await fetch(`/api/articles?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch articles');
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}