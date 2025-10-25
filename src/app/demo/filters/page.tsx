'use client';

import { useState } from 'react';
import { ArticleFilterBar, type ArticleFilters } from '@/components/filters';

/**
 * Demo page for ArticleFilterBar component
 * View at /demo/filters
 */
export default function FiltersDemo() {
  const [filters, setFilters] = useState<ArticleFilters>({
    search: '',
    sort: 'newest',
    categories: [],
    tags: [],
    personalizations: [],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Article Filter System
          </h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive, accessible, and responsive filter UI for browsing newsletter articles
          </p>
        </div>

        {/* Filter Bar */}
        <ArticleFilterBar
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Results Display */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Filter State */}
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="border-b bg-muted/50 px-6 py-4">
              <h2 className="text-lg font-semibold">Current Filter State</h2>
            </div>
            <div className="p-6">
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(filters, null, 2)}
              </pre>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="border-b bg-muted/50 px-6 py-4">
              <h2 className="text-lg font-semibold">Filter Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Search Query
                </h3>
                <p className="text-sm">
                  {filters.search || <em className="text-muted-foreground">No search query</em>}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Sort Order
                </h3>
                <p className="text-sm capitalize">{filters.sort.replace('-', ' ')}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Active Filters
                </h3>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">
                      {filters.categories.length || 'None'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tags:</span>
                    <span className="font-medium">
                      {filters.tags.length || 'None'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Personalizations:</span>
                    <span className="font-medium">
                      {filters.personalizations.length || 'None'}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Total Active Filters
                </h3>
                <p className="text-2xl font-bold">
                  {filters.categories.length + filters.tags.length + filters.personalizations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h2 className="text-lg font-semibold">Features</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-medium">Search with Debounce</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time search with 300ms debounce and clear button
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Smart Tag Filtering</h3>
                <p className="text-sm text-muted-foreground">
                  Tags automatically filter based on selected categories
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Collapsible Panel</h3>
                <p className="text-sm text-muted-foreground">
                  Smooth animations with Motion library for clean UX
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Active Filter Badges</h3>
                <p className="text-sm text-muted-foreground">
                  Color-coded badges with individual remove buttons
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Mobile First</h3>
                <p className="text-sm text-muted-foreground">
                  Fully responsive design optimized for all screen sizes
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Accessible</h3>
                <p className="text-sm text-muted-foreground">
                  ARIA labels, keyboard navigation, and screen reader support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            See{' '}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              src/components/filters/README.md
            </code>{' '}
            for full documentation
          </p>
        </div>
      </div>
    </div>
  );
}
