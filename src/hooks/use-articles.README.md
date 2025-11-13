# useArticles Hook

A custom React hook for fetching and filtering articles with built-in caching, race condition handling, and performance optimizations.

## Features

- **Automatic Caching**: Uses React Query for intelligent caching (1 minute stale time, 5 minutes garbage collection)
- **Race Condition Handling**: Automatic request cancellation via AbortSignal
- **Memoization**: Prevents unnecessary re-fetches with memoized search params and query keys
- **Loading States**: Built-in loading, error, and fetching states
- **Type Safety**: Full TypeScript support with exported types
- **Deduplication**: Prevents duplicate requests for the same data
- **Backward Compatible**: Supports both legacy and new filter parameters

## Installation

The hook is already part of the codebase at `/src/hooks/use-articles.ts`.

## Basic Usage

```tsx
import { useArticles } from '@/hooks/use-articles';

function ArticlesList() {
  const { data, isLoading, error } = useArticles();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

## API Reference

### Parameters

The hook accepts a single `params` object with the following optional properties:

#### Filter Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | `string \| null` | Search query for title and summary | `"mortgage rates"` |
| `sort` | `string \| null` | Sort order | `"newest"`, `"oldest"`, `"alpha-asc"`, `"alpha-desc"` |
| `categories` | `string \| null` | Comma-separated category filters | `"mortgage,leadership"` |
| `tags` | `string \| null` | Comma-separated tag filters | `"rates,market"` |
| `generations` | `string \| null` | Filter by AI generation types | `"video_script,email_template"` |
| `limit` | `number` | Maximum number of results | `10` |

#### Legacy Parameters (Backward Compatibility)

| Parameter | Type | Description |
|-----------|------|-------------|
| `industry` | `string \| null` | Filter by industry |
| `category` | `string \| null` | Legacy category filter |
| `saved` | `string \| null` | Show saved articles only (`"true"`) |

#### Control Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `enabled` | `boolean` | Enable/disable automatic fetching | `true` |

### Return Value

The hook returns a React Query result object:

```typescript
{
  data: ArticlesResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  // ... other React Query properties
}
```

#### ArticlesResponse Type

```typescript
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
```

#### Article Type

```typescript
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
```

## Usage Examples

### 1. Basic Fetching

```tsx
const { data, isLoading } = useArticles();
```

### 2. With Search Filter

```tsx
const { data } = useArticles({
  search: 'mortgage rates'
});
```

### 3. With Multiple Filters

```tsx
const { data } = useArticles({
  search: 'leadership',
  sort: 'newest',
  categories: 'mortgage,leadership',
  tags: 'market,trends',
  generations: 'video_script',
  limit: 20
});
```

### 4. With URL State (nuqs)

```tsx
import { useQueryState } from 'nuqs';

function FilterableArticles() {
  const [search] = useQueryState('search');
  const [sort] = useQueryState('sort');

  const { data, isLoading } = useArticles({
    search: search || undefined,
    sort: sort || 'newest'
  });

  // Component JSX...
}
```

### 5. Conditional Fetching

```tsx
const [shouldFetch, setShouldFetch] = useState(false);

const { data, refetch } = useArticles({
  enabled: shouldFetch,
  search: 'leadership'
});

// Later: trigger fetch manually
setShouldFetch(true);
// or
refetch();
```

### 6. Show Saved Articles Only

```tsx
const { data } = useArticles({
  saved: 'true'
});
```

### 7. Filter by AI Generations

```tsx
// Show only articles with video scripts
const { data } = useArticles({
  generations: 'video_script'
});

// Show articles with multiple generation types
const { data } = useArticles({
  generations: 'video_script,email_template,social_media'
});

// Show articles with default content only (no AI generations)
const { data } = useArticles({
  generations: 'default'
});
```

### 8. Access Subscription Info

```tsx
const { data } = useArticles();

// Access user subscription data
console.log(data?.user_tier); // "FREE", "PAID", or "PREMIUM"
console.log(data?.monthly_generations_used); // e.g., 5
console.log(data?.monthly_generation_limit); // e.g., 25
console.log(data?.requires_upgrade); // true/false
```

## Performance Optimizations

### 1. Memoization

The hook uses `useMemo` to memoize both the search params string and query key, preventing unnecessary re-renders and re-fetches:

```typescript
const searchParamsString = useMemo(() => {
  // Build params only when dependencies change
}, [params.search, params.sort, ...]);
```

### 2. Race Condition Handling

React Query automatically handles race conditions using AbortSignal:

```typescript
queryFn: async ({ signal }) => {
  const response = await fetch(`/api/articles?${params}`, {
    signal // Automatically cancels outdated requests
  });
}
```

### 3. Intelligent Caching

```typescript
staleTime: 60 * 1000,    // 1 minute - data stays fresh
gcTime: 5 * 60 * 1000,   // 5 minutes - garbage collection
```

This means:
- Data is considered fresh for 1 minute (no refetch)
- Unused data is kept in cache for 5 minutes before garbage collection
- Automatic background refetching after stale time

### 4. Request Deduplication

React Query automatically deduplicates requests with the same query key, so multiple components can use the same hook without causing duplicate API calls.

## Migration from useEffect Pattern

### Before (Manual useEffect)

```tsx
// DON'T DO THIS
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  let ignore = false;

  async function fetchArticles() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    // ... build params

    const response = await fetch(`/api/articles?${params}`);
    const data = await response.json();

    if (!ignore) {
      setArticles(data);
      setLoading(false);
    }
  }

  fetchArticles();
  return () => { ignore = true };
}, [search, sort, categories]); // Easy to miss dependencies
```

### After (useArticles hook)

```tsx
// DO THIS
const { data, isLoading } = useArticles({
  search,
  sort,
  categories
});
```

Benefits:
- No manual loading state management
- No race condition handling needed
- Automatic caching
- Better performance
- Fewer bugs

## Best Practices

### 1. Use Conditional Fetching for Heavy Queries

```tsx
const { data } = useArticles({
  enabled: isAuthenticated && isPaid,
  generations: 'video_script'
});
```

### 2. Combine with URL State for Better UX

```tsx
const [search, setSearch] = useQueryState('search');
const { data } = useArticles({ search: search || undefined });
```

This syncs filter state with the URL, enabling:
- Shareable filtered views
- Browser back/forward navigation
- Bookmark-able states

### 3. Handle Loading and Error States

```tsx
const { data, isLoading, error, isFetching } = useArticles();

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;

return (
  <>
    {isFetching && <RefreshIndicator />}
    <ArticlesList articles={data.articles} />
  </>
);
```

### 4. Leverage React Query DevTools

Install React Query DevTools in development:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

This helps debug cache state, refetch behavior, and performance.

## Troubleshooting

### Articles Not Updating

Check that React Query is properly configured in your app:

```tsx
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Filters Not Working

Make sure you're passing the correct parameter format:

```tsx
// ✅ Correct
const { data } = useArticles({
  categories: 'mortgage,leadership' // comma-separated string
});

// ❌ Wrong
const { data } = useArticles({
  categories: ['mortgage', 'leadership'] // array won't work
});
```

### Too Many Requests

If you see duplicate requests:
1. Check that you're not calling the hook multiple times with the same params
2. Verify React Query is configured with a single QueryClient instance
3. Use React Query DevTools to inspect cache behavior

## Related Hooks

- `useUser()` - Fetches authenticated user data
- Located in the same file: `/src/hooks/use-articles.ts`

## Testing

Example test setup:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArticles } from './use-articles';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('fetches articles', async () => {
  const { result } = renderHook(() => useArticles(), {
    wrapper: createWrapper()
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.articles).toBeDefined();
});
```

## Further Reading

- [React Query Documentation](https://tanstack.com/query/latest)
- [nuqs Documentation](https://nuqs.47ng.com/) (URL state management)
- [Article API Documentation](/src/app/api/articles/route.ts)
