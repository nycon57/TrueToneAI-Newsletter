# Pagination Components

Two mobile-first pagination options for the TrueTone AI Newsletter platform.

## Components Overview

### Option A: InfiniteScroll
A "Load More" button component with smooth animations and loading states.

**Best for:**
- Mobile-first experiences
- Content discovery and browsing
- Social media-style feeds
- When users typically consume most content

**Features:**
- Gradient button matching TrueTone AI brand (orchid → indigo)
- Smooth fade-in animations for new content
- Loading spinner with pulsing animation
- Optional skeleton loader for better perceived performance
- Error state with retry capability
- Fully accessible (ARIA labels, keyboard navigation)

### Option B: PageControls
Traditional pagination with page numbers, prev/next, and first/last buttons.

**Best for:**
- Desktop experiences
- When users need to reference specific pages
- When total count matters
- Administrative or data-heavy interfaces

**Features:**
- Gradient active page button (orchid → indigo)
- Smart page number display (shows ellipsis for large page counts)
- First/last page quick navigation
- Smooth transitions between pages
- Auto-scroll to top on page change (configurable)
- Fully accessible with ARIA labels
- Mobile-responsive design

## Usage

### Basic InfiniteScroll

```tsx
import { InfiniteScroll } from '@/components/pagination';
import { useArticles } from '@/hooks/use-articles';

function ArticleList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArticles({
    limit: page * 10
  });

  const articles = data?.articles || [];
  const totalCount = data?.total_count || 0;
  const hasMore = articles.length < totalCount;

  return (
    <>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}

      <InfiniteScroll
        hasMore={hasMore}
        onLoadMore={() => setPage(prev => prev + 1)}
        isLoading={isLoading}
      />
    </>
  );
}
```

### InfiniteScroll with Skeleton Loader

```tsx
<InfiniteScroll
  hasMore={hasMore}
  onLoadMore={handleLoadMore}
  isLoading={isLoading}
  showSkeleton={true}
  skeletonCount={3}
/>
```

### Basic PageControls

```tsx
import { PageControls } from '@/components/pagination';
import { useArticles } from '@/hooks/use-articles';

function ArticleList() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading } = useArticles({
    limit: ITEMS_PER_PAGE
  });

  const totalPages = Math.ceil((data?.total_count || 0) / ITEMS_PER_PAGE);

  return (
    <>
      {data?.articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}

      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </>
  );
}
```

### Advanced PageControls

```tsx
<PageControls
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  isLoading={isLoading}
  showFirstLast={true}        // Show first/last buttons
  maxPageButtons={7}          // Show up to 7 page numbers
  scrollToTop={true}          // Auto-scroll on page change
  scrollOffset={80}           // Scroll to 80px from top (for sticky header)
/>
```

### Responsive Approach (Hybrid)

Use infinite scroll on mobile and page controls on desktop:

```tsx
<>
  {/* Mobile: Infinite Scroll */}
  <div className="md:hidden">
    <InfiniteScroll
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
    />
  </div>

  {/* Desktop: Page Controls */}
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

## API Reference

### InfiniteScroll Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hasMore` | `boolean` | Required | Whether more items are available |
| `onLoadMore` | `() => void \| Promise<void>` | Required | Callback to load more items |
| `isLoading` | `boolean` | `false` | Loading state |
| `error` | `string \| null` | `null` | Error message if load failed |
| `loadingText` | `string` | `"Loading more articles..."` | Custom loading text |
| `buttonText` | `string` | `"Load More Articles"` | Custom button text |
| `className` | `string` | - | Additional CSS classes |
| `showSkeleton` | `boolean` | `false` | Show skeleton loader instead of spinner |
| `skeletonCount` | `number` | `3` | Number of skeleton items |

### PageControls Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | Required | Current page (1-based) |
| `totalPages` | `number` | Required | Total number of pages |
| `onPageChange` | `(page: number) => void` | Required | Page change callback |
| `isLoading` | `boolean` | `false` | Loading state |
| `showFirstLast` | `boolean` | `true` | Show first/last buttons |
| `maxPageButtons` | `number` | `5` | Max page buttons to show |
| `className` | `string` | - | Additional CSS classes |
| `scrollToTop` | `boolean` | `true` | Auto-scroll on page change |
| `scrollOffset` | `number` | `0` | Scroll offset in pixels |

## Design System

Both components use the TrueTone AI brand colors:

- **Primary Gradient**: `from-orchid to-indigo` (#4F518C → #2C2A4A)
- **Hover Gradient**: `from-indigo to-shadow` (#2C2A4A → #131321)
- **Background**: `from-lavender/20 via-white to-lavender/20`
- **Border Accent**: `border-lavender/50` (#DABFFF with 50% opacity)

### Color Palette

- Shadow: `#131321`
- Indigo: `#2C2A4A`
- Orchid: `#4F518C`
- Lilac: `#9D7AD6`
- Lavender: `#DABFFF`

## Accessibility

Both components follow WCAG 2.1 Level AA standards:

- ✅ Semantic HTML with proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader announcements (aria-live regions)
- ✅ Disabled state handling
- ✅ Color contrast compliance
- ✅ Touch-friendly tap targets (minimum 44x44px)

## Animation

Components use Motion (framer-motion) for smooth animations:

- **Fade-in**: Content appears smoothly (300ms)
- **Slide-up**: Items animate from bottom (400ms)
- **Stagger**: Sequential animations with delay
- **Pulse**: Loading indicators with pulsing effect
- **Scale**: Active page button scales to 110%

## Performance Considerations

### InfiniteScroll
- Renders only visible items
- Supports skeleton screens for perceived performance
- Handles race conditions via React Query
- Memoizes callbacks to prevent unnecessary re-renders

### PageControls
- Smart page number calculation (shows ellipsis)
- Optimized re-renders with useMemo
- Smooth scroll with requestAnimationFrame
- Keyboard debouncing for rapid page changes

## Integration with useArticles Hook

Both components work seamlessly with the existing `useArticles` hook:

```tsx
const { data, isLoading, error } = useArticles({
  limit: page * 10,  // For InfiniteScroll
  // OR
  limit: 10,         // For PageControls (fixed per page)
});
```

The hook provides:
- `data.articles` - Article array
- `data.total_count` - Total number of articles
- `isLoading` - Loading state
- `error` - Error state

## Examples

See `pagination.example.tsx` for comprehensive usage examples including:

1. Basic Infinite Scroll
2. Infinite Scroll with Skeleton Loader
3. Traditional Pagination
4. Page Controls with Custom Settings
5. Hybrid Responsive Approach
6. Integration with Home Page

## Testing

### Manual Testing Checklist

**InfiniteScroll:**
- [ ] Button loads more items when clicked
- [ ] Loading spinner appears during fetch
- [ ] Error state shows retry button
- [ ] "End of results" message appears when done
- [ ] Keyboard accessible (Tab + Enter)
- [ ] Screen reader announces loading state

**PageControls:**
- [ ] Page numbers display correctly
- [ ] Active page is highlighted with gradient
- [ ] Prev/Next buttons work correctly
- [ ] First/Last buttons work (if enabled)
- [ ] Ellipsis appears for large page counts
- [ ] Scrolls to top on page change
- [ ] Keyboard navigation works (Tab + Enter)
- [ ] Disabled states prevent interaction

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Dependencies

- `motion` (framer-motion) - Animations
- `lucide-react` - Icons
- `@/components/ui/button` - Button component
- `@/lib/utils` - cn utility
- `@tanstack/react-query` - Data fetching (via useArticles)

## License

Part of TrueTone AI Newsletter platform.
