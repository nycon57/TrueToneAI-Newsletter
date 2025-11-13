# ArticleModalContext Integration Guide

Quick guide to integrate ArticleModalContext into your existing TrueTone AI Newsletter app.

## Files Created

```
src/lib/context/
├── ArticleModalContext.tsx       # Main context implementation
├── ArticleModalContext.example.tsx  # Complete usage examples
├── ArticleModalContext.test.tsx  # Manual testing guide
├── index.ts                      # Barrel exports
├── README.md                     # Full documentation
└── INTEGRATION.md               # This file
```

## Step-by-Step Integration

### Step 1: Wrap Your Feed Layout

Add the provider to your feed layout:

```tsx
// app/feed/layout.tsx
import { ArticleModalProvider } from '@/lib/context';

export default function FeedLayout({ children }) {
  return (
    <ArticleModalProvider>
      {children}
    </ArticleModalProvider>
  );
}
```

Or wrap your entire app:

```tsx
// app/layout.tsx
import { ArticleModalProvider } from '@/lib/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ArticleModalProvider>
          {children}
        </ArticleModalProvider>
      </body>
    </html>
  );
}
```

### Step 2: Update Article Cards

Replace existing article click handlers:

**Before:**
```tsx
function ArticleCard({ article }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={() => setIsOpen(true)}>
      {article.title}
    </div>
  );
}
```

**After:**
```tsx
'use client';

import { useArticleModal } from '@/lib/context';

function ArticleCard({ article }) {
  const { openArticle } = useArticleModal();

  return (
    <div onClick={() => openArticle(article.id, article)}>
      {article.title}
    </div>
  );
}
```

### Step 3: Create/Update Article Modal Component

```tsx
// components/ArticleModal.tsx
'use client';

import { useArticleModal } from '@/lib/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ArticleModal() {
  const { isOpen, article, isLoading, error, closeArticle } = useArticleModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeArticle}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {article && (
          <>
            <DialogHeader>
              <DialogTitle>{article.title}</DialogTitle>
            </DialogHeader>
            {/* Your article content here */}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### Step 4: Add Modal to Your Page

```tsx
// app/feed/page.tsx
import { ArticleModal } from '@/components/ArticleModal';

export default function FeedPage() {
  return (
    <>
      {/* Your existing feed content */}
      <ArticleFeed />

      {/* Add the modal */}
      <ArticleModal />
    </>
  );
}
```

### Step 5: (Optional) Add Analytics

```tsx
// app/feed/layout.tsx
import { ArticleModalProvider } from '@/lib/context';

export default function FeedLayout({ children }) {
  return (
    <ArticleModalProvider
      onArticleOpen={(id) => {
        // Track with your analytics service
        console.log('Article viewed:', id);
      }}
      onArticleClose={() => {
        console.log('Article modal closed');
      }}
    >
      {children}
    </ArticleModalProvider>
  );
}
```

## Common Patterns in Your App

### Pattern 1: Article Feed Cards

```tsx
// components/ArticleFeedCard.tsx
'use client';

import { useArticleModal } from '@/lib/context';
import { Card } from '@/components/ui/card';

export function ArticleFeedCard({ article }) {
  const { openArticle, isArticleOpen } = useArticleModal();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => openArticle(article.id, article)}
    >
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      {isArticleOpen(article.id) && (
        <span className="text-primary">Currently viewing</span>
      )}
    </Card>
  );
}
```

### Pattern 2: Share Button with Deep Link

```tsx
'use client';

import { getArticleUrl } from '@/lib/context';
import { Button } from '@/components/ui/button';

export function ShareArticleButton({ articleId }) {
  const handleShare = () => {
    const url = `${window.location.origin}${getArticleUrl(articleId, '/feed')}`;
    navigator.clipboard.writeText(url);
    // Show toast notification
  };

  return <Button onClick={handleShare}>Share</Button>;
}
```

### Pattern 3: Article Modal with All Content Sections

```tsx
'use client';

import { useArticleModal } from '@/lib/context';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ArticleModal() {
  const { isOpen, article, closeArticle } = useArticleModal();

  if (!isOpen || !article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeArticle}>
      <DialogContent className="max-w-4xl">
        <h1>{article.title}</h1>

        <Tabs defaultValue="insights">
          <TabsList>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="video">Video Script</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <ul>
              {article.keyInsights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="video">
            <pre>{article.videoScript}</pre>
          </TabsContent>

          <TabsContent value="email">
            <pre>{article.emailTemplate}</pre>
          </TabsContent>

          <TabsContent value="social">
            {Object.entries(article.socialContent).map(([platform, content]) => (
              <div key={platform}>
                <strong>{platform}</strong>
                <p>{content}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
```

## API Integration

The context works with your existing API:

```tsx
// Default fetcher (already configured)
GET /api/articles/{id}

// Response format expected:
{
  "article": {
    "id": "string",
    "title": "string",
    "summary": "string",
    // ... rest of article fields
  }
}
```

To use a different endpoint:

```tsx
<ArticleModalProvider
  fetchArticle={async (id) => {
    const res = await fetch(`/api/v2/articles/${id}`);
    const data = await res.json();
    return data; // Must return Article type
  }}
>
  {children}
</ArticleModalProvider>
```

## Testing Your Integration

1. **Test basic open/close:**
   - Click article card → Modal opens
   - Click backdrop → Modal closes
   - Press ESC → Modal closes

2. **Test URL state:**
   - Open modal → URL shows `?article=<id>`
   - Close modal → URL parameter removed
   - Refresh page with `?article=<id>` → Modal opens

3. **Test browser navigation:**
   - Open modal → Press back → Modal closes
   - Press forward → Modal reopens

4. **Test scroll preservation:**
   - Scroll page down
   - Open modal
   - Close modal
   - Scroll position restored

5. **Test optimistic updates:**
   - Pass article data when opening
   - Modal shows content immediately
   - No loading spinner

## Troubleshooting

### Modal not opening
- Check that component is wrapped in `<ArticleModalProvider>`
- Check browser console for errors
- Verify `'use client'` directive on components using the hook

### URL not updating
- Make sure `nuqs` is installed (already done)
- Check Next.js version compatibility (15.5.6 - compatible)
- Verify no conflicting URL state management

### Type errors
- Import types from `@/lib/context`
- Check that article data matches `Article` interface
- Run `npm run lint` to catch TypeScript errors

## Performance Tips

1. **Always pass article data when opening:**
   ```tsx
   // Good - No loading state
   openArticle(article.id, article);

   // Avoid if you have the data
   openArticle(article.id);
   ```

2. **Memoize article cards:**
   ```tsx
   const ArticleCard = React.memo(({ article }) => {
     // Component code
   });
   ```

3. **Lazy load heavy content:**
   ```tsx
   const ArticleVideoPlayer = React.lazy(() => import('./ArticleVideoPlayer'));
   ```

## Migration Checklist

- [ ] Install ArticleModalProvider in layout
- [ ] Update article click handlers to use `openArticle()`
- [ ] Create ArticleModal component
- [ ] Add modal to page/layout
- [ ] Test URL state synchronization
- [ ] Test browser back/forward navigation
- [ ] Test scroll position preservation
- [ ] Add analytics tracking (optional)
- [ ] Remove old modal state management
- [ ] Test on mobile devices
- [ ] Test keyboard navigation (ESC, Tab)
- [ ] Verify accessibility with screen reader

## Next Steps

1. See `ArticleModalContext.example.tsx` for complete working examples
2. Read `README.md` for full API documentation
3. Run manual tests from `ArticleModalContext.test.tsx`
4. Integrate into your feed page
5. Test thoroughly before deploying

## Support

For issues or questions:
- Check examples in `ArticleModalContext.example.tsx`
- Read full docs in `README.md`
- Review type definitions in `ArticleModalContext.tsx`
