'use client';

/**
 * Pagination Demo Component
 *
 * Interactive demo showing both pagination options side by side.
 * Useful for testing and deciding which option to use.
 */

import { useState } from 'react';
import { InfiniteScroll } from './InfiniteScroll';
import { PageControls } from './PageControls';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';

// Mock article data for demo
const MOCK_ARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: `article-${i + 1}`,
  title: `Article ${i + 1}: Market Insights and Updates`,
  summary: `This is a summary for article ${i + 1}. It contains important information about market trends and insights.`,
  content_type: 'article',
  category: ['Mortgage', 'Leadership', 'Marketing'][i % 3],
  published_at: new Date(2024, 0, i + 1).toISOString(),
}));

interface DemoArticleProps {
  article: typeof MOCK_ARTICLES[0];
  index: number;
}

function DemoArticle({ article, index }: DemoArticleProps) {
  const categoryColors = {
    Mortgage: 'bg-blue-100 text-blue-800 border-blue-200',
    Leadership: 'bg-green-100 text-green-800 border-green-200',
    Marketing: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <Badge className={`border text-xs ${categoryColors[article.category as keyof typeof categoryColors]}`}>
              {article.category}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(article.published_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {article.summary}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PaginationDemo() {
  // State for Infinite Scroll demo
  const [infinitePage, setInfinitePage] = useState(1);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const ITEMS_PER_LOAD = 5;

  // State for Page Controls demo
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const ITEMS_PER_PAGE = 5;

  // Calculate items for Infinite Scroll
  const infiniteArticles = MOCK_ARTICLES.slice(0, infinitePage * ITEMS_PER_LOAD);
  const hasMoreInfinite = infiniteArticles.length < MOCK_ARTICLES.length;

  // Calculate items for Page Controls
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageArticles = MOCK_ARTICLES.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(MOCK_ARTICLES.length / ITEMS_PER_PAGE);

  // Simulate loading for Infinite Scroll
  const handleInfiniteLoad = async () => {
    setInfiniteLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInfinitePage(prev => prev + 1);
    setInfiniteLoading(false);
  };

  // Simulate loading for Page Controls
  const handlePageChange = async (page: number) => {
    setPageLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(page);
    setPageLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pagination Component Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare both pagination options to decide which works best for your use case.
            Both options feature TrueTone AI brand styling and smooth animations.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b border-lavender/30 bg-gradient-to-r from-lavender/10 to-lavender/5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Option A</h2>
                <Badge className="bg-gradient-to-r from-orchid to-indigo text-white border-0">
                  Infinite Scroll
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Mobile-first design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Great for content discovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Smooth loading animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Optional skeleton screens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">!</span>
                  <span className="text-gray-500">Harder to find specific items</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="border-b border-lavender/30 bg-gradient-to-r from-lavender/10 to-lavender/5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Option B</h2>
                <Badge className="bg-gradient-to-r from-orchid to-indigo text-white border-0">
                  Page Controls
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Desktop-friendly navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Easy to jump to specific pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Clear total page count</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Auto-scroll to top</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">!</span>
                  <span className="text-gray-500">More clicks to see all content</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demos */}
        <Tabs defaultValue="infinite" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="infinite" className="text-sm">
              Infinite Scroll Demo
            </TabsTrigger>
            <TabsTrigger value="pages" className="text-sm">
              Page Controls Demo
            </TabsTrigger>
          </TabsList>

          {/* Infinite Scroll Demo */}
          <TabsContent value="infinite" className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-lavender/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Articles ({infiniteArticles.length} of {MOCK_ARTICLES.length})
                </h3>
                <button
                  onClick={() => setInfinitePage(1)}
                  className="text-sm text-orchid hover:text-indigo transition-colors"
                >
                  Reset Demo
                </button>
              </div>
              <div className="space-y-4">
                {infiniteArticles.map((article, index) => (
                  <DemoArticle key={article.id} article={article} index={index} />
                ))}
              </div>
              <InfiniteScroll
                hasMore={hasMoreInfinite}
                onLoadMore={handleInfiniteLoad}
                isLoading={infiniteLoading}
                buttonText={`Load ${Math.min(ITEMS_PER_LOAD, MOCK_ARTICLES.length - infiniteArticles.length)} More Articles`}
              />
            </div>
          </TabsContent>

          {/* Page Controls Demo */}
          <TabsContent value="pages" className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-lavender/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Page {currentPage} of {totalPages}
                </h3>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="text-sm text-orchid hover:text-indigo transition-colors"
                >
                  Reset Demo
                </button>
              </div>
              <div className="space-y-4">
                {pageArticles.map((article, index) => (
                  <DemoArticle key={article.id} article={article} index={index} />
                ))}
              </div>
              <PageControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={pageLoading}
                showFirstLast={true}
                scrollToTop={false} // Disabled for demo
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendation */}
        <Card className="mt-12 shadow-lg border-0 bg-gradient-to-r from-lavender/10 to-lavender/5">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💡 Recommendation
            </h3>
            <p className="text-gray-700 leading-relaxed">
              For the TrueTone AI Newsletter platform, we recommend using <strong>Infinite Scroll (Option A)</strong> as
              the primary pagination method. It aligns better with the mobile-first approach and provides a
              seamless content discovery experience for sales professionals browsing articles.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, you can also implement a hybrid approach using Infinite Scroll on mobile and Page Controls
              on desktop for the best of both worlds. See the examples in <code className="bg-gray-100 px-2 py-1 rounded text-sm">pagination.example.tsx</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
