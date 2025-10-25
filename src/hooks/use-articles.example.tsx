/**
 * Example usage of useArticles hook
 *
 * This file demonstrates different ways to use the useArticles hook
 * with various filter combinations.
 */

'use client';

import { useState } from 'react';
import { useQueryState } from 'nuqs';
import { useArticles } from './use-articles';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Loader2 } from 'lucide-react';

/**
 * Example 1: Basic usage - Fetch all articles
 */
export function BasicArticlesExample() {
  const { data, isLoading, error } = useArticles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orchid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error loading articles: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Articles</h2>
      <p className="text-gray-600">
        Total: {data?.total_count || 0} articles
      </p>
      <div className="space-y-6">
        {data?.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isAuthenticated={true}
            isPaid={data.user_tier !== 'FREE'}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 2: With search filter
 */
export function SearchArticlesExample() {
  const [searchTerm, setSearchTerm] = useState('mortgage');

  const { data, isLoading } = useArticles({
    search: searchTerm,
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search articles..."
        className="w-full px-4 py-2 border rounded-lg"
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <p>Found {data?.articles.length || 0} results</p>
          {data?.articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isAuthenticated={true}
              isPaid={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: With multiple filters
 */
export function FilteredArticlesExample() {
  const { data, isLoading } = useArticles({
    search: 'rates',
    sort: 'newest',
    categories: 'mortgage,leadership',
    tags: 'market,trends',
    generations: 'video_script,email_template',
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Mortgage & Leadership Articles with AI Content
      </h2>
      <div className="flex gap-2 text-sm text-gray-600">
        <span>Sorted by: Newest</span>
        <span>•</span>
        <span>With video scripts and email templates</span>
      </div>
      <div className="space-y-6">
        {data?.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isAuthenticated={true}
            isPaid={true}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Dynamic filters with URL state
 */
export function DynamicFilterExample() {
  const [search, setSearch] = useQueryState('search');
  const [sort, setSort] = useQueryState('sort');
  const [categories, setCategories] = useQueryState('categories');

  const { data, isLoading, isFetching } = useArticles({
    search: search || undefined,
    sort: sort || 'newest',
    categories: categories || undefined,
  });

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex gap-4">
        <input
          type="text"
          value={search || ''}
          onChange={(e) => setSearch(e.target.value || null)}
          placeholder="Search..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <select
          value={sort || 'newest'}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alpha-asc">A-Z</option>
          <option value="alpha-desc">Z-A</option>
        </select>
      </div>

      {/* Loading indicator while refetching */}
      {isFetching && (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating results...
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {data?.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isAuthenticated={true}
            isPaid={true}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 5: Disabled hook (conditional fetching)
 */
export function ConditionalFetchExample() {
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, refetch } = useArticles({
    enabled: shouldFetch,
    search: 'leadership',
  });

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShouldFetch(true)}
        className="px-4 py-2 bg-orchid text-white rounded-lg"
      >
        Load Leadership Articles
      </button>

      {shouldFetch && (
        <>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-6">
              {data?.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isAuthenticated={true}
                  isPaid={true}
                />
              ))}
              <button
                onClick={() => refetch()}
                className="px-4 py-2 border rounded-lg"
              >
                Refresh
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Example 6: Access additional response data
 */
export function SubscriptionInfoExample() {
  const { data, isLoading } = useArticles();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {/* User subscription info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Your Subscription</h3>
        <div className="space-y-1 text-sm">
          <p>Tier: {data?.user_tier}</p>
          <p>Status: {data?.subscription_status || 'Free'}</p>
          <p>
            Monthly Generations: {data?.monthly_generations_used} /{' '}
            {data?.monthly_generation_limit}
          </p>
          {data?.requires_upgrade && (
            <p className="text-orange-600 font-medium">
              Upgrade to access more features
            </p>
          )}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {data?.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isAuthenticated={true}
            isPaid={data.user_tier !== 'FREE'}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 7: Show saved articles only
 */
export function SavedArticlesExample() {
  const { data, isLoading } = useArticles({
    saved: 'true',
  });

  if (isLoading) return <div>Loading saved articles...</div>;

  if (data?.articles.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No saved articles yet</p>
        <p className="text-sm">
          Click the bookmark icon on any article to save it
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Saved Articles</h2>
      <p className="text-gray-600">{data?.articles.length} saved</p>
      <div className="space-y-6">
        {data?.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isAuthenticated={true}
            isPaid={true}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 8: Filter by AI generation status
 */
export function GenerationsFilterExample() {
  const [generationType, setGenerationType] = useState<string>('');

  const { data, isLoading } = useArticles({
    generations: generationType || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setGenerationType('')}
          className={`px-4 py-2 rounded-lg ${
            !generationType ? 'bg-orchid text-white' : 'bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setGenerationType('video_script')}
          className={`px-4 py-2 rounded-lg ${
            generationType === 'video_script'
              ? 'bg-orchid text-white'
              : 'bg-gray-100'
          }`}
        >
          With Video Scripts
        </button>
        <button
          onClick={() => setGenerationType('email_template')}
          className={`px-4 py-2 rounded-lg ${
            generationType === 'email_template'
              ? 'bg-orchid text-white'
              : 'bg-gray-100'
          }`}
        >
          With Email Templates
        </button>
        <button
          onClick={() => setGenerationType('default')}
          className={`px-4 py-2 rounded-lg ${
            generationType === 'default'
              ? 'bg-orchid text-white'
              : 'bg-gray-100'
          }`}
        >
          Default Content Only
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600">{data?.articles.length} articles</p>
          {data?.articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isAuthenticated={true}
              isPaid={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
