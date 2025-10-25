'use client';

import { useState } from 'react';
import { ArticleFilterBar, type ArticleFilters } from './ArticleFilterBar';

/**
 * Example usage of ArticleFilterBar component
 *
 * This demonstrates how to integrate the filter bar into your pages.
 * The filters state can be synced with URL params using `nuqs` for persistence.
 */
export function ArticleFilterBarExample() {
  // Initialize filter state
  const [filters, setFilters] = useState<ArticleFilters>({
    search: '',
    sort: 'newest',
    categories: [],
    tags: [],
    generations: [],
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: ArticleFilters) => {
    setFilters(newFilters);

    // Here you would typically:
    // 1. Update URL params (using nuqs)
    // 2. Fetch filtered data from API
    // 3. Update display state

    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Article Browser</h1>
        <p className="text-muted-foreground mt-2">
          Filter and search through newsletter articles
        </p>
      </div>

      {/* Filter Bar */}
      <ArticleFilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Results Display */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(filters, null, 2)}
        </pre>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Active filters:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {filters.search && <li>Search: "{filters.search}"</li>}
            <li>Sort: {filters.sort}</li>
            {filters.categories.length > 0 && (
              <li>Categories: {filters.categories.length} selected</li>
            )}
            {filters.tags.length > 0 && (
              <li>Tags: {filters.tags.length} selected</li>
            )}
            {filters.generations.length > 0 && (
              <li>Generations: {filters.generations.length} selected</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Example integration with URL state management using nuqs
 *
 * Install nuqs if not already: npm install nuqs
 */
export function ArticleFilterBarWithUrlState() {
  // Example using nuqs for URL state persistence
  // Uncomment and implement when integrating into actual page

  /*
  import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringEnum } from 'nuqs';

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(''),
    sort: parseAsStringEnum(['newest', 'oldest', 'alpha-asc', 'alpha-desc']).withDefault('newest'),
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    generations: parseAsArrayOf(parseAsString).withDefault([]),
  });

  return (
    <ArticleFilterBar
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
  */

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <p className="text-muted-foreground">
        See comments in ArticleFilterBar.example.tsx for URL state integration example
      </p>
    </div>
  );
}
