# Article Modal Context

A performant, accessible React context for managing article modal state across the application with URL synchronization and scroll position preservation.

## Features

- **URL State Sync** - Modal state persists in URL using `nuqs` for deep linking and browser back button support
- **Scroll Preservation** - Automatically saves and restores scroll position when closing modal
- **Optimistic Updates** - Pass article data directly to avoid loading states
- **Loading & Error States** - Built-in handling for async article fetching
- **Browser Navigation** - Proper back button handling
- **Body Scroll Lock** - Prevents background scrolling when modal is open
- **TypeScript** - Full type safety with comprehensive interfaces
- **Performance** - Minimal re-renders, efficient state updates
- **Accessibility** - Works seamlessly with shadcn/ui Dialog components

## Installation

The context is already installed in your project. Import from:

```tsx
import { ArticleModalProvider, useArticleModal } from '@/lib/context';
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
// app/layout.tsx or app/feed/layout.tsx
import { ArticleModalProvider } from '@/lib/context';

export default function Layout({ children }) {
  return (
    <ArticleModalProvider>
      {children}
    </ArticleModalProvider>
  );
}
```

### 2. Use the hook in your components

```tsx
// components/ArticleCard.tsx
'use client';

import { useArticleModal } from '@/lib/context';

export function ArticleCard({ article }) {
  const { openArticle } = useArticleModal();

  return (
    <div onClick={() => openArticle(article.id, article)}>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
    </div>
  );
}
```

### 3. Create your modal component

```tsx
// components/ArticleModal.tsx
'use client';

import { useArticleModal } from '@/lib/context';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function ArticleModal() {
  const { isOpen, article, isLoading, error, closeArticle } = useArticleModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeArticle}>
      <DialogContent>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {article && (
          <div>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## API Reference

### `ArticleModalProvider`

Provider component that manages article modal state.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |
| `onArticleOpen` | `(id: string) => void` | optional | Callback when article opens |
| `onArticleClose` | `() => void` | optional | Callback when article closes |
| `fetchArticle` | `(id: string) => Promise<Article>` | optional | Custom article fetcher |
| `preserveScrollPosition` | `boolean` | `true` | Whether to save/restore scroll |

#### Example with Callbacks

```tsx
<ArticleModalProvider
  onArticleOpen={(id) => {
    // Track analytics
    console.log('Article opened:', id);
  }}
  onArticleClose={() => {
    // Track analytics
    console.log('Article closed');
  }}
>
  {children}
</ArticleModalProvider>
```

### `useArticleModal`

Hook to access article modal state and actions.

#### Returns

```tsx
{
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
```

#### Methods

**`openArticle(articleId, article?)`**

Opens the article modal.

- `articleId` - The article ID to open
- `article` - Optional article data to avoid loading state

```tsx
// With optimistic data (recommended)
openArticle(article.id, article);

// Without data (will fetch)
openArticle(article.id);
```

**`closeArticle()`**

Closes the article modal and restores scroll position.

```tsx
closeArticle();
```

**`isArticleOpen(articleId)`**

Check if a specific article is currently open.

```tsx
if (isArticleOpen(article.id)) {
  // Show "currently viewing" indicator
}
```

### Types

```tsx
interface Article {
  id: string;
  title: string;
  summary?: string | null;
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
```

## Usage Patterns

### Pattern 1: Article Cards with Optimistic Updates

Pass article data directly when opening to avoid loading states:

```tsx
function ArticleCard({ article }) {
  const { openArticle, isArticleOpen } = useArticleModal();

  return (
    <Card onClick={() => openArticle(article.id, article)}>
      <h3>{article.title}</h3>
      {isArticleOpen(article.id) && <Badge>Viewing</Badge>}
    </Card>
  );
}
```

### Pattern 2: Full Modal with Loading States

```tsx
function ArticleModal() {
  const { isOpen, article, isLoading, error, closeArticle } = useArticleModal();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeArticle}>
      <DialogContent className="max-w-4xl">
        {isLoading && <ArticleModalSkeleton />}
        {error && <ErrorMessage error={error} />}
        {article && <ArticleContent article={article} />}
      </DialogContent>
    </Dialog>
  );
}
```

### Pattern 3: Deep Linking Support

The modal automatically syncs with URL state using `?article=<id>`:

```tsx
// Share this URL
const shareUrl = `${window.location.origin}/feed?article=${article.id}`;

// When user visits this URL, modal opens automatically
// Browser back button closes the modal
```

### Pattern 4: Custom Article Fetcher

Implement custom logic like caching:

```tsx
const customFetchArticle = async (articleId: string) => {
  // Check cache first
  const cached = localStorage.getItem(`article_${articleId}`);
  if (cached) return JSON.parse(cached);

  // Fetch from API
  const response = await fetch(`/api/articles/${articleId}`);
  const data = await response.json();

  // Cache for next time
  localStorage.setItem(`article_${articleId}`, JSON.stringify(data));

  return data;
};

<ArticleModalProvider fetchArticle={customFetchArticle}>
  {children}
</ArticleModalProvider>
```

### Pattern 5: Analytics Tracking

```tsx
<ArticleModalProvider
  onArticleOpen={(id) => {
    // Track with your analytics service
    analytics.track('article_viewed', {
      article_id: id,
      timestamp: Date.now(),
    });
  }}
  onArticleClose={() => {
    analytics.track('article_closed');
  }}
>
  {children}
</ArticleModalProvider>
```

## Advanced Features

### Scroll Position Preservation

The context automatically:
1. Saves scroll position before opening modal
2. Locks body scroll while modal is open
3. Restores scroll position when closing
4. Handles browser back button

To disable:

```tsx
<ArticleModalProvider preserveScrollPosition={false}>
  {children}
</ArticleModalProvider>
```

### URL State Management

Uses `nuqs` for type-safe URL state:

```tsx
// URL: /feed
openArticle('abc-123');
// URL: /feed?article=abc-123

closeArticle();
// URL: /feed (scroll position restored)
```

### Browser Back Button

Works seamlessly with browser navigation:

1. User clicks article → Modal opens → URL updates
2. User clicks back button → Modal closes → Scroll restored
3. User clicks forward → Modal reopens

## Performance Considerations

### Optimistic Updates

Always pass article data when available:

```tsx
// Good - No loading state
openArticle(article.id, article);

// Avoid - Shows loading spinner
openArticle(article.id);
```

### Preventing Re-renders

The context uses `useCallback` and proper dependencies to minimize re-renders.

### Data Fetching

Articles are only fetched when:
1. Modal opens without article data
2. Article data doesn't match current article ID

## Accessibility

The context is designed to work with shadcn/ui's accessible Dialog component:

- Focus management handled by Dialog
- Keyboard navigation (ESC to close)
- ARIA attributes from Dialog
- Screen reader announcements

## Examples

See `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/lib/context/ArticleModalContext.example.tsx` for complete working examples including:

- Article cards
- Full modal component
- Loading skeletons
- Error handling
- Share buttons
- Deep linking
- Custom fetchers
- Complete page setup

## Troubleshooting

### Modal doesn't open

Make sure you're wrapped in the provider:

```tsx
// app/layout.tsx
<ArticleModalProvider>
  {children}
</ArticleModalProvider>
```

### Hook error

```
Error: useArticleModal must be used within ArticleModalProvider
```

Component using the hook must be a descendant of the provider.

### URL not updating

Make sure `nuqs` is properly configured for your Next.js version. The package is already installed and configured.

### Scroll not restoring

Check that `preserveScrollPosition` prop is not set to `false`.

## Migration Guide

If you have existing modal state management:

**Before:**

```tsx
const [modalOpen, setModalOpen] = useState(false);
const [currentArticle, setCurrentArticle] = useState(null);
```

**After:**

```tsx
const { openArticle, closeArticle, article } = useArticleModal();
```

## Related Components

- `/src/components/ui/dialog` - shadcn/ui Dialog (modal base)
- `/src/components/ui/sheet` - Alternative mobile-first modal
- `/src/hooks/use-media-query` - Responsive modal handling

## Support

For issues or questions, check:
- Example file: `ArticleModalContext.example.tsx`
- Type definitions in `ArticleModalContext.tsx`
- This README

## License

Part of the TrueTone AI Newsletter application.
