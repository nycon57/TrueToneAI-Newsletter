/**
 * ArticleModalContext Usage Examples
 *
 * This file demonstrates how to use the ArticleModalContext in your components.
 * Copy these patterns into your actual components.
 */

'use client';

import React from 'react';
import { ArticleModalProvider, useArticleModal, type Article } from './ArticleModalContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ExternalLink } from 'lucide-react';

// ============================================================================
// Example 1: Wrapping your app with the provider
// ============================================================================

export function AppWithArticleModal({ children }: { children: React.ReactNode }) {
  return (
    <ArticleModalProvider
      preserveScrollPosition={true}
      onArticleOpen={(id) => {
        console.log('Article opened:', id);
        // Track analytics here
      }}
      onArticleClose={() => {
        console.log('Article closed');
        // Track analytics here
      }}
    >
      {children}
    </ArticleModalProvider>
  );
}

// ============================================================================
// Example 2: Article card that opens modal
// ============================================================================

export function ArticleCard({ article }: { article: Article }) {
  const { openArticle, isArticleOpen } = useArticleModal();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => openArticle(article.id, article)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          {isArticleOpen(article.id) && (
            <Badge variant="secondary">Open</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {article.summary}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="outline">+{article.tags.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Example 3: Article feed with grid of cards
// ============================================================================

export function ArticleFeed({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

// ============================================================================
// Example 4: Full article modal with loading and error states
// ============================================================================

export function ArticleModal() {
  const { isOpen, article, isLoading, error, closeArticle } = useArticleModal();

  return (
    <Dialog open={isOpen} onOpenChange={() => closeArticle()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading && <ArticleModalSkeleton />}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-destructive font-medium">{error}</p>
            <Button onClick={closeArticle} variant="outline">
              Close
            </Button>
          </div>
        )}

        {article && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{article.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Summary */}
              {article.summary && (
                <p className="text-muted-foreground text-lg">{article.summary}</p>
              )}

              {/* Tags and metadata */}
              <div className="flex flex-wrap gap-2">
                {article.category && (
                  <Badge variant="secondary">{article.category}</Badge>
                )}
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
                {article.is_personalized && (
                  <Badge variant="default">Personalized</Badge>
                )}
              </div>

              {/* Key Insights */}
              {article.keyInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
                  <ul className="space-y-2">
                    {article.keyInsights.map((insight, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary font-medium">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video Script */}
              {article.videoScript && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Video Script</h3>
                  <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {article.videoScript}
                  </div>
                </div>
              )}

              {/* Email Template */}
              {article.emailTemplate && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Email Template</h3>
                  <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {article.emailTemplate}
                  </div>
                </div>
              )}

              {/* Social Content */}
              {Object.keys(article.socialContent).length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Social Media</h3>
                  <div className="space-y-3">
                    {Object.entries(article.socialContent).map(([platform, content]) => (
                      <div key={platform} className="border rounded-lg p-3">
                        <div className="font-medium mb-2 capitalize">{platform}</div>
                        <div className="text-sm text-muted-foreground">{content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Example 5: Modal loading skeleton
// ============================================================================

function ArticleModalSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: Share button with article URL
// ============================================================================

export function ShareArticleButton({ articleId }: { articleId: string }) {
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?article=${articleId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this article',
          url,
        });
      } catch {
        // User cancelled share - no action needed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <ExternalLink className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}

// ============================================================================
// Example 7: Custom article fetcher (e.g., from cache)
// ============================================================================

export function AppWithCustomFetcher({ children }: { children: React.ReactNode }) {
  const customFetchArticle = async (articleId: string) => {
    // Try cache first
    const cached = sessionStorage.getItem(`article_${articleId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from API
    const response = await fetch(`/api/articles/${articleId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }

    const data = await response.json();

    // Cache it
    sessionStorage.setItem(`article_${articleId}`, JSON.stringify(data.article));

    return data.article;
  };

  return (
    <ArticleModalProvider fetchArticle={customFetchArticle}>
      {children}
    </ArticleModalProvider>
  );
}

// ============================================================================
// Example 8: Deep link handler (for SSR or initial load)
// ============================================================================

'use client';

export function DeepLinkHandler() {
  const { openArticle } = useArticleModal();

  React.useEffect(() => {
    // Check if URL has article parameter on mount
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('article');

    if (articleId) {
      // Open article modal automatically
      openArticle(articleId);
    }
  }, [openArticle]);

  return null;
}

// ============================================================================
// Example 9: Complete page setup
// ============================================================================

export function ArticlesPage() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch articles
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch articles:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <ArticleModalProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <ArticleFeed articles={articles} />
        )}

        {/* Article modal */}
        <ArticleModal />
      </div>
    </ArticleModalProvider>
  );
}
