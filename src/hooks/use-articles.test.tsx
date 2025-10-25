/**
 * Unit tests for useArticles hook
 *
 * Run with: npm test src/hooks/use-articles.test.tsx
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArticles } from './use-articles';

// Mock fetch globally
global.fetch = jest.fn();

// Create a wrapper component with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Disable cache for testing
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useArticles', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch articles successfully', async () => {
    const mockData = {
      articles: [
        {
          id: '1',
          title: 'Test Article',
          summary: 'Test summary',
          content_type: 'article',
          is_personalized: false,
          tier: 'FREE',
          published_at: '2025-01-01',
        },
      ],
      user_tier: 'FREE',
      subscription_status: null,
      monthly_generations_used: 0,
      monthly_generation_limit: 3,
      saved_article_ids: [],
      total_count: 1,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    });

    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the data
    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.articles).toHaveLength(1);
    expect(result.current.data?.articles[0].title).toBe('Test Article');
  });

  it('should handle errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });

  it('should build correct search params for filters', async () => {
    const mockData = {
      articles: [],
      user_tier: 'PAID',
      subscription_status: 'active',
      monthly_generations_used: 5,
      monthly_generation_limit: 25,
      saved_article_ids: [],
      total_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    renderHook(
      () =>
        useArticles({
          search: 'mortgage',
          sort: 'newest',
          categories: 'mortgage,leadership',
          tags: 'rates',
          generations: 'video_script',
          limit: 10,
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(fetchCall).toContain('search=mortgage');
    expect(fetchCall).toContain('sort=newest');
    expect(fetchCall).toContain('categories=mortgage%2Cleadership');
    expect(fetchCall).toContain('tags=rates');
    expect(fetchCall).toContain('generations=video_script');
    expect(fetchCall).toContain('limit=10');
  });

  it('should not fetch when enabled is false', async () => {
    renderHook(() => useArticles({ enabled: false }), {
      wrapper: createWrapper(),
    });

    // Wait a bit to ensure fetch is not called
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should deduplicate requests with same params', async () => {
    const mockData = {
      articles: [],
      user_tier: 'PAID',
      subscription_status: 'active',
      monthly_generations_used: 0,
      monthly_generation_limit: 25,
      saved_article_ids: [],
      total_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    // Render the hook twice with the same params
    const { result: result1 } = renderHook(
      () => useArticles({ search: 'test' }),
      {
        wrapper: createWrapper(),
      }
    );

    const { result: result2 } = renderHook(
      () => useArticles({ search: 'test' }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    // Should only have called fetch once due to deduplication
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should support race condition handling via AbortSignal', async () => {
    const mockData = {
      articles: [],
      user_tier: 'PAID',
      subscription_status: 'active',
      monthly_generations_used: 0,
      monthly_generation_limit: 25,
      saved_article_ids: [],
      total_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Verify fetch was called with signal parameter
    const fetchCallArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchCallArgs[1]).toHaveProperty('signal');
    expect(fetchCallArgs[1].signal).toBeInstanceOf(AbortSignal);
  });
});

describe('useArticles - Memoization', () => {
  it('should not refetch when params do not change', async () => {
    const mockData = {
      articles: [],
      user_tier: 'PAID',
      subscription_status: 'active',
      monthly_generations_used: 0,
      monthly_generation_limit: 25,
      saved_article_ids: [],
      total_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { rerender } = renderHook(
      ({ search }) => useArticles({ search }),
      {
        wrapper: createWrapper(),
        initialProps: { search: 'test' },
      }
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Rerender with same params
    rerender({ search: 'test' });

    // Should not trigger another fetch
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should refetch when params change', async () => {
    const mockData = {
      articles: [],
      user_tier: 'PAID',
      subscription_status: 'active',
      monthly_generations_used: 0,
      monthly_generation_limit: 25,
      saved_article_ids: [],
      total_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { rerender } = renderHook(
      ({ search }) => useArticles({ search }),
      {
        wrapper: createWrapper(),
        initialProps: { search: 'test' },
      }
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Rerender with different params
    rerender({ search: 'new search' });

    // Should trigger another fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});
