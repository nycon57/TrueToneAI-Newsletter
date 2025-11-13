# Pagination Implementation Guide

This guide will help you integrate pagination into the TrueTone AI Newsletter platform.

## Quick Start

### 1. Choose Your Pagination Style

You have two options:

**Option A: Infinite Scroll** (Recommended for mobile-first)
- "Load More" button
- Better for content discovery
- Smoother mobile experience

**Option B: Page Controls** (Better for desktop/data-heavy)
- Traditional pagination with page numbers
- Better for navigation to specific pages
- Clearer total page count

### 2. Update Your API Route

First, ensure your API route supports pagination. Update `/api/articles/route.ts`:

```typescript
// Add pagination params to your API
const limit = parseInt(searchParams.get('limit') || '10');
const offset = parseInt(searchParams.get('offset') || '0');

// Or use page-based pagination
const page = parseInt(searchParams.get('page') || '1');
const itemsPerPage = parseInt(searchParams.get('limit') || '10');
const offset = (page - 1) * itemsPerPage;

// Fetch articles with limit and offset
const articles = await prisma.article.findMany({
  take: limit,
  skip: offset,
  orderBy: { published_at: 'desc' },
});

// Get total count
const totalCount = await prisma.article.count();

// Return with pagination metadata
return NextResponse.json({
  articles,
  total_count: totalCount,
  page: page,
  limit: itemsPerPage,
  total_pages: Math.ceil(totalCount / itemsPerPage),
});
```

### 3. Update useArticles Hook

The `useArticles` hook already supports a `limit` parameter. You can optionally add `page` or `offset`:

```typescript
// In src/hooks/use-articles.ts
// Add to UseArticlesParams interface
interface UseArticlesParams {
  // ... existing params
  limit?: number;
  page?: number;  // Optional: for page-based pagination
  offset?: number; // Optional: for offset-based pagination
}
```

### 4. Implement in Your Component

#### Option A: Infinite Scroll

```typescript
// src/app/home-page-client.tsx or your component
import { InfiniteScroll } from '@/components/pagination';

export function HomePageClient() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading } = useArticles({
    limit: page * ITEMS_PER_PAGE, // Fetch cumulative items
  });

  const articles = data?.articles || [];
  const totalCount = data?.total_count || 0;
  const hasMore = articles.length < totalCount;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Articles */}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <InfiniteScroll
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
      />
    </div>
  );
}
```

#### Option B: Page Controls

```typescript
// src/app/home-page-client.tsx or your component
import { PageControls } from '@/components/pagination';

export function HomePageClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading } = useArticles({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  const totalPages = Math.ceil((data?.total_count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Articles */}
      <div className="space-y-6">
        {data?.articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        scrollToTop={true}
        scrollOffset={80} // Account for sticky header
      />
    </div>
  );
}
```

## Integration Steps

### Step 1: Install Dependencies (Already Installed)

These are already part of your project:
- ✅ `motion` (framer-motion)
- ✅ `lucide-react`
- ✅ `@/components/ui/button`
- ✅ `@tanstack/react-query`

### Step 2: Copy Components (Already Done)

The pagination components are now available at:
- ✅ `/src/components/pagination/InfiniteScroll.tsx`
- ✅ `/src/components/pagination/PageControls.tsx`
- ✅ `/src/components/pagination/index.ts`

### Step 3: Update API Route

Modify `/src/app/api/articles/route.ts` to support pagination:

```typescript
// Example API route with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get pagination params
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  // Get filters (existing)
  const industry = searchParams.get('industry');
  const category = searchParams.get('category');
  // ... other filters

  // Build where clause (existing)
  const where = {
    // ... your existing filters
  };

  // Fetch articles with pagination
  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { published_at: 'desc' },
      // ... your existing includes
    }),
    prisma.article.count({ where }),
  ]);

  // Return with pagination metadata
  return NextResponse.json({
    articles,
    total_count: totalCount,
    page,
    limit,
    total_pages: Math.ceil(totalCount / limit),
    has_more: offset + articles.length < totalCount,
  });
}
```

### Step 4: Choose Implementation Location

You can add pagination to:

1. **Main Home Page** (`src/app/home-page-client.tsx`)
   - Best for main article listing

2. **Optimized Page** (`src/app/page-optimized.tsx`)
   - If using the optimized version

3. **Saved Articles** (Account page)
   - For user's saved articles list

### Step 5: Add Import

```typescript
import { InfiniteScroll } from '@/components/pagination';
// OR
import { PageControls } from '@/components/pagination';
// OR both for hybrid approach
```

### Step 6: Test

1. **Test Loading States**
   - Verify spinner/skeleton appears during fetch
   - Check smooth animations on new content

2. **Test Error States**
   - Simulate API error
   - Verify retry button works

3. **Test Accessibility**
   - Tab through controls with keyboard
   - Test with screen reader
   - Verify ARIA labels

4. **Test Responsiveness**
   - Check on mobile (320px width)
   - Check on tablet (768px width)
   - Check on desktop (1440px width)

## Advanced Patterns

### Hybrid Approach (Recommended)

Use Infinite Scroll on mobile and Page Controls on desktop:

```typescript
<>
  {/* Mobile */}
  <div className="md:hidden">
    <InfiniteScroll
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
    />
  </div>

  {/* Desktop */}
  <div className="hidden md:block">
    <PageControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
    />
  </div>
</>
```

### Skeleton Loading

Use skeleton screens for better perceived performance:

```typescript
<InfiniteScroll
  hasMore={hasMore}
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
  showSkeleton={true}
  skeletonCount={3}
/>
```

### Custom Styling

Both components accept a `className` prop:

```typescript
<InfiniteScroll
  // ... props
  className="py-12" // Custom spacing
/>

<PageControls
  // ... props
  className="border-t border-lavender/30 pt-8" // Custom border
/>
```

## Common Issues & Solutions

### Issue: Articles Don't Load

**Solution:** Ensure your API route returns `total_count`:

```typescript
return NextResponse.json({
  articles,
  total_count: totalCount, // Must include this
});
```

### Issue: Scroll Position Jumps

**Solution:** For PageControls, adjust scroll offset:

```typescript
<PageControls
  scrollOffset={80} // Height of sticky header
  // ... other props
/>
```

### Issue: Duplicate Content

**Solution:** Ensure unique keys and proper limit calculation:

```typescript
// For InfiniteScroll
const { data } = useArticles({
  limit: page * ITEMS_PER_PAGE, // Cumulative
});

// For PageControls
const { data } = useArticles({
  limit: ITEMS_PER_PAGE, // Fixed per page
  page: currentPage,
});
```

### Issue: Loading State Flickers

**Solution:** Use React Query's `staleTime`:

```typescript
// In useArticles hook
staleTime: 60 * 1000, // 1 minute
```

## Performance Tips

1. **Use Skeleton Screens** for better perceived performance
2. **Optimize Image Loading** with Next.js Image component
3. **Implement Virtual Scrolling** for very long lists (100+ items)
4. **Cache Previous Pages** with React Query (already implemented)
5. **Prefetch Next Page** for faster navigation

## Testing Checklist

- [ ] Articles load correctly
- [ ] Pagination controls appear
- [ ] Loading state shows during fetch
- [ ] Error state shows on failure
- [ ] End of results message appears
- [ ] Keyboard navigation works
- [ ] Mobile responsive (320px - 768px)
- [ ] Desktop responsive (768px+)
- [ ] Screen reader accessible
- [ ] Animations are smooth
- [ ] No console errors
- [ ] No memory leaks

## Demo

To see both pagination options in action, create a demo page:

```typescript
// src/app/pagination-demo/page.tsx
import { PaginationDemo } from '@/components/pagination/PaginationDemo';

export default function PaginationDemoPage() {
  return <PaginationDemo />;
}
```

Then visit: `http://localhost:3000/pagination-demo`

## Next Steps

1. ✅ Choose your pagination style
2. ✅ Update API route with pagination support
3. ✅ Implement in your component
4. ✅ Test thoroughly
5. ✅ Deploy to production

## Need Help?

- See `pagination.example.tsx` for comprehensive examples
- See `README.md` for detailed API reference
- Run the demo at `/pagination-demo` to compare both options
- Check the existing `useArticles` hook for data fetching patterns

## Summary

Both pagination components are production-ready with:
- ✅ TrueTone AI brand styling
- ✅ Smooth animations
- ✅ Full accessibility
- ✅ Mobile-first responsive design
- ✅ Loading and error states
- ✅ TypeScript type safety
- ✅ Integration with existing hooks

Choose **Infinite Scroll** for content discovery or **Page Controls** for traditional navigation. Or use both in a hybrid approach!
