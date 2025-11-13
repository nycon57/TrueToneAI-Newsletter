# Quick Start Guide - Pagination

Get pagination working in 5 minutes.

## Step 1: Choose Your Style

**Option A** (Recommended): Load More button
**Option B**: Page numbers with prev/next

## Step 2: Add to Your Component

### Option A: InfiniteScroll (3 lines of code)

```tsx
import { InfiniteScroll } from '@/components/pagination';

// In your component:
<InfiniteScroll
  hasMore={articles.length < totalCount}
  onLoadMore={() => setPage(prev => prev + 1)}
  isLoading={isLoading}
/>
```

### Option B: PageControls (3 lines of code)

```tsx
import { PageControls } from '@/components/pagination';

// In your component:
<PageControls
  currentPage={currentPage}
  totalPages={Math.ceil(totalCount / 10)}
  onPageChange={setCurrentPage}
/>
```

## Step 3: Done!

That's it. Both components handle:
- ✅ Loading states
- ✅ Error handling
- ✅ Animations
- ✅ Accessibility
- ✅ Mobile responsive

## Full Example (Copy-Paste Ready)

### With InfiniteScroll

```tsx
'use client';

import { useState } from 'react';
import { InfiniteScroll } from '@/components/pagination';
import { useArticles } from '@/hooks/use-articles';
import { ArticleCard } from '@/components/article/ArticleCard';

export function ArticleList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArticles({
    limit: page * 10
  });

  const articles = data?.articles || [];
  const totalCount = data?.total_count || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <InfiniteScroll
        hasMore={articles.length < totalCount}
        onLoadMore={() => setPage(prev => prev + 1)}
        isLoading={isLoading}
      />
    </div>
  );
}
```

### With PageControls

```tsx
'use client';

import { useState } from 'react';
import { PageControls } from '@/components/pagination';
import { useArticles } from '@/hooks/use-articles';
import { ArticleCard } from '@/components/article/ArticleCard';

export function ArticleList() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading } = useArticles({
    limit: ITEMS_PER_PAGE,
    page: currentPage
  });

  const totalPages = Math.ceil((data?.total_count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {data?.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
}
```

## That's It!

You now have fully functional, accessible, branded pagination.

## Want More?

- **Skeleton Loading**: Add `showSkeleton={true}` to InfiniteScroll
- **Custom Styling**: Add `className="your-classes"` to either
- **Scroll to Top**: PageControls does this automatically
- **Error Handling**: Pass `error="Error message"` to InfiniteScroll

## Need Help?

See these files for more details:
- `README.md` - Full API reference
- `pagination.example.tsx` - More examples
- `IMPLEMENTATION_GUIDE.md` - Step-by-step integration
- `COMPONENTS_OVERVIEW.md` - Visual comparison

## Demo

Create a demo page to test:

```tsx
// src/app/demo/page.tsx
import { PaginationDemo } from '@/components/pagination/PaginationDemo';

export default function DemoPage() {
  return <PaginationDemo />;
}
```

Visit: http://localhost:3000/demo
