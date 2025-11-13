# ArticleModalContext - Quick Reference

## 30-Second Setup

```tsx
// 1. Wrap your app
import { ArticleModalProvider } from '@/lib/context';

<ArticleModalProvider>
  {children}
</ArticleModalProvider>

// 2. Use in components
import { useArticleModal } from '@/lib/context';

const { openArticle } = useArticleModal();
<div onClick={() => openArticle(article.id, article)}>
  {article.title}
</div>

// 3. Create modal
const { isOpen, article, closeArticle } = useArticleModal();

<Dialog open={isOpen} onOpenChange={closeArticle}>
  <DialogContent>{article?.title}</DialogContent>
</Dialog>
```

## Common Patterns

### Open Article
```tsx
// With data (instant, recommended)
openArticle(article.id, article);

// Without data (shows loading)
openArticle(article.id);
```

### Check if Open
```tsx
if (isArticleOpen(article.id)) {
  // This article is currently displayed
}
```

### Share URL
```tsx
const url = `${window.location.origin}/feed?article=${article.id}`;
navigator.clipboard.writeText(url);
```

### Custom Fetcher
```tsx
<ArticleModalProvider
  fetchArticle={async (id) => {
    // Your custom fetch logic
    return article;
  }}
/>
```

### Analytics
```tsx
<ArticleModalProvider
  onArticleOpen={(id) => analytics.track('article_viewed', { id })}
  onArticleClose={() => analytics.track('article_closed')}
/>
```

## Complete Example

```tsx
// layout.tsx
import { ArticleModalProvider } from '@/lib/context';

export default function Layout({ children }) {
  return <ArticleModalProvider>{children}</ArticleModalProvider>;
}

// ArticleCard.tsx
'use client';
import { useArticleModal } from '@/lib/context';

export function ArticleCard({ article }) {
  const { openArticle, isArticleOpen } = useArticleModal();

  return (
    <div onClick={() => openArticle(article.id, article)}>
      <h3>{article.title}</h3>
      {isArticleOpen(article.id) && <Badge>Viewing</Badge>}
    </div>
  );
}

// ArticleModal.tsx
'use client';
import { useArticleModal } from '@/lib/context';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function ArticleModal() {
  const { isOpen, article, isLoading, error, closeArticle } = useArticleModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeArticle}>
      <DialogContent>
        {isLoading && <Spinner />}
        {error && <Error message={error} />}
        {article && <ArticleContent article={article} />}
      </DialogContent>
    </Dialog>
  );
}
```

## Hook API

```tsx
const {
  isOpen,        // boolean - modal open state
  articleId,     // string | null - current article ID
  article,       // Article | null - article data
  isLoading,     // boolean - fetching state
  error,         // string | null - error message

  openArticle,   // (id, article?) => void
  closeArticle,  // () => void
  isArticleOpen, // (id) => boolean
} = useArticleModal();
```

## Types

```tsx
interface Article {
  id: string;
  title: string;
  summary?: string | null;
  content_type: string;
  category?: string | null;
  tags: string[];
  published_at: string;
  keyInsights: string[];
  videoScript: string;
  emailTemplate: string;
  socialContent: Record<string, string>;
  is_personalized: boolean;
}
```

## Features

- ✓ URL state sync (`?article=abc123`)
- ✓ Deep linking support
- ✓ Browser back button
- ✓ Scroll preservation
- ✓ Loading states
- ✓ Error handling
- ✓ TypeScript
- ✓ Optimistic updates
- ✓ Analytics callbacks
- ✓ Custom fetchers
- ✓ Accessibility

## Files

```
src/lib/context/
├── ArticleModalContext.tsx       # Implementation
├── ArticleModalContext.example.tsx  # Examples (9 patterns)
├── ArticleModalContext.test.tsx  # Test suite
├── index.ts                      # Exports
├── README.md                     # Full docs
├── INTEGRATION.md               # Integration guide
└── QUICK_REFERENCE.md           # This file
```

## Import Paths

```tsx
// Recommended (barrel export)
import {
  ArticleModalProvider,
  useArticleModal,
  type Article
} from '@/lib/context';

// Direct (if needed)
import { useArticleModal } from '@/lib/context/ArticleModalContext';
```

## Troubleshooting

**Error: "must be used within ArticleModalProvider"**
→ Wrap with `<ArticleModalProvider>`

**URL not updating**
→ Already fixed - nuqs is installed

**Scroll not restoring**
→ Check `preserveScrollPosition={true}`

**Loading spinner shows with data**
→ Pass article: `openArticle(id, article)`

## Next Steps

1. See `README.md` for full docs
2. See `INTEGRATION.md` for setup guide
3. See `ArticleModalContext.example.tsx` for patterns
4. Run tests from `ArticleModalContext.test.tsx`

## Performance Checklist

- [ ] Pass article data when opening
- [ ] Memoize expensive components
- [ ] Use optimistic updates
- [ ] Lazy load heavy content
- [ ] Monitor re-renders

## Accessibility Checklist

- [ ] Works with keyboard (ESC, Tab)
- [ ] Screen reader compatible
- [ ] Focus management
- [ ] ARIA labels (via Dialog)
- [ ] Mobile responsive

---

**Location:** `/Users/jarrettstanley/Desktop/websites/TrueToneAI-Newsletter/src/lib/context/`

**Import:** `import { useArticleModal } from '@/lib/context'`
