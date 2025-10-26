'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ArticleModalProvider } from '@/lib/context/ArticleModalContext';

/**
 * React Query Provider for client-side caching and data management
 *
 * Configuration:
 * - staleTime: 60s - Data is considered fresh for 60 seconds
 * - gcTime: 5min - Unused data is garbage collected after 5 minutes
 * - refetchOnWindowFocus: false - Don't refetch when user returns to tab
 * - retry: 1 - Only retry failed requests once
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ArticleModalProvider>
          {children}
          {/* React Query DevTools - only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ArticleModalProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
