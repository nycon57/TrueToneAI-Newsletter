# Performance Optimization Implementation Guide

## Current Performance Metrics
- **Homepage Load**: 42ms average (excellent in dev, but will be slower in production)
- **Articles API**: 248ms (needs optimization)
- **User API**: 817ms (critical - needs immediate fix)
- **No cache headers** on any API responses
- **32% improvement** available with parallel requests

## Step-by-Step Implementation

### Step 1: Backup Current Files
```bash
# Create backup of files we'll modify
cp src/app/page.tsx src/app/page.tsx.backup
cp src/app/api/articles/route.ts src/app/api/articles/route.ts.backup
cp src/lib/api/auth.ts src/lib/api/auth.ts.backup
cp src/app/layout.tsx src/app/layout.tsx.backup
cp src/app/fonts.ts src/app/fonts.ts.backup
```

### Step 2: Implement Parallel API Calls (Quick Win - 5 minutes)

Replace the content of `src/app/page.tsx` with `src/app/page-optimized.tsx`:

```bash
# Apply the optimized parallel API calls
cp src/app/page-optimized.tsx src/app/page.tsx
```

**What this fixes:**
- Fetches articles and user data simultaneously
- Reduces total wait time from ~1000ms to ~500ms
- Better error handling

### Step 3: Optimize Database Queries (10 minutes)

Replace the articles API with the optimized version:

```bash
# Apply the optimized API with single query
cp src/app/api/articles/route-optimized.ts src/app/api/articles/route.ts
```

**What this fixes:**
- Single query with LEFT JOIN instead of N+1 queries
- Adds cache headers (5 min for paid, 1 min for free users)
- ETag support for conditional requests
- Reduces API response time by 50%

### Step 4: Implement Auth Caching (5 minutes)

1. First, add the cached auth helper:
```bash
# The file is already created at src/lib/api/auth-cached.ts
```

2. Update all API routes to use cached auth:

```typescript
// In each API route file, replace:
import { getApiUser } from '@/lib/api/auth';

// With:
import { getCachedApiUserSafe } from '@/lib/api/auth-cached';

// Then replace:
const user = await getApiUser();

// With:
const user = await getCachedApiUserSafe();
```

### Step 5: Optimize Font Loading (5 minutes)

1. Replace fonts configuration:
```bash
cp src/app/fonts-optimized.ts src/app/fonts.ts
```

2. Update `src/app/layout.tsx`:
```typescript
// Remove the Signal import and Geist_Mono
import { inter } from "./fonts";

// Update body className
<body className={`${inter.variable} font-sans antialiased`}>
```

3. Add CSS for headings in `src/app/globals.css`:
```css
/* Add to globals.css */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

### Step 6: Install React Query (Optional but Recommended - 15 minutes)

1. Install dependencies:
```bash
npm install @tanstack/react-query
```

2. Create providers file at `src/app/providers.tsx`:
```typescript
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 5 * 60 * 1000,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

3. Wrap your app in layout.tsx:
```typescript
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NuqsAdapter>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
```

4. Use the hooks in your components:
```typescript
import { useArticles, useUser } from '@/lib/hooks/use-articles';

function HomePage() {
  const { data: articlesData, isLoading: articlesLoading } = useArticles();
  const { data: userData } = useUser();

  // No need for useEffect - data is automatically cached!
}
```

### Step 7: Add Performance Monitoring

1. Create a performance monitoring component at `src/components/performance-monitor.tsx`:

```typescript
'use client';
import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Log Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
```

2. Add to layout in development:
```typescript
{process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
```

### Step 8: Test the Optimizations

1. Run the performance test:
```bash
node scripts/performance-test.js
```

2. Run the load test:
```bash
USERS=20 DURATION=30 node scripts/load-test-simple.js
```

3. Check bundle size:
```bash
npm run build
```

## Expected Results After Implementation

### Before:
- Initial page load: 3-4 seconds
- Articles API: 248ms
- User API: 817ms
- No caching
- Sequential requests

### After:
- Initial page load: 1-1.5 seconds ✨
- Articles API: ~100ms (with cache headers)
- User API: ~200ms (with auth caching)
- Smart caching strategy
- Parallel requests

## Production Deployment Checklist

- [ ] Test all optimizations locally
- [ ] Run performance tests
- [ ] Check TypeScript errors: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Test production build: `npm run start`
- [ ] Deploy to staging first
- [ ] Monitor with Sentry/Vercel Analytics
- [ ] A/B test if possible

## Rollback Plan

If any issues occur:

```bash
# Restore original files
cp src/app/page.tsx.backup src/app/page.tsx
cp src/app/api/articles/route.ts.backup src/app/api/articles/route.ts
cp src/lib/api/auth.ts.backup src/lib/api/auth.ts
cp src/app/layout.tsx.backup src/app/layout.tsx
cp src/app/fonts.ts.backup src/app/fonts.ts

# Rebuild
npm run build
```

## Advanced Optimizations (Phase 2)

Once the basic optimizations are stable:

1. **Convert to Server Components**
   - Use `src/app/page-server.tsx` as reference
   - Implement streaming with Suspense

2. **Add Edge Caching**
   - Configure Vercel Edge Config
   - Use ISR (Incremental Static Regeneration)

3. **Implement Service Worker**
   - Offline support
   - Background sync

4. **Image Optimization**
   - Convert logo to WebP
   - Implement responsive images

## Monitoring Tools

1. **Vercel Analytics** (built-in)
2. **Sentry Performance** (already configured)
3. **Lighthouse CI** for automated testing:

```bash
npm install -g @lhci/cli
lhci autorun --config=lighthouserc.js
```

## Support

If you encounter issues:
1. Check error logs in Sentry
2. Review the performance test output
3. Use Chrome DevTools Performance tab
4. Check Network tab for slow requests

Remember: **Measure before and after each change!**