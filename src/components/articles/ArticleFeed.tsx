'use client';

import { useState, useEffect } from 'react';
import { ArticleCard } from './ArticleCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Crown,
  Sparkles,
  TrendingUp,
  FileText,
  MessageSquare,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ArticleFeedProps {
  initialArticles?: any[];
  userTier?: 'free' | 'paid' | 'premium';
  userId?: string;
  monthlyGenerationsUsed?: number;
  monthlyGenerationLimit?: number;
}

export function ArticleFeed({
  initialArticles = [],
  userTier = 'free',
  userId,
  monthlyGenerationsUsed = 0,
  monthlyGenerationLimit = 0
}: ArticleFeedProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPaid = userTier !== 'free';

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again.');
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalize = async (articleId: string, outputType: string) => {
    // Refresh articles to get updated personalization
    await fetchArticles();
    toast.success(`${outputType.replace('_', ' ')} personalized successfully!`);
  };

  const handleRefresh = () => {
    fetchArticles();
  };

  const upgradePrompt = (
    <Alert className="mb-6 border-gradient-to-r border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <Crown className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <strong>Unlock AI Personalization:</strong> Get content tailored to your unique voice with TrueTone technology.
          </div>
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 ml-4">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );

  const usageStats = isPaid && (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-center p-4">
          <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              {articles.filter(a => a.is_personalized).length}
            </p>
            <p className="text-sm text-gray-600">Personalized</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              {monthlyGenerationsUsed}/{monthlyGenerationLimit}
            </p>
            <p className="text-sm text-gray-600">Monthly Usage</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <FileText className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <p className="text-2xl font-semibold text-gray-900">{articles.length}</p>
            <p className="text-sm text-gray-600">Available Articles</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <MessageSquare className="h-8 w-8 text-orange-600 mr-3" />
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              <Badge variant="secondary">{userTier.toUpperCase()}</Badge>
            </p>
            <p className="text-sm text-gray-600">Subscription</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        {!isPaid && upgradePrompt}

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upgrade prompt for free users */}
      {!isPaid && upgradePrompt}

      {/* Usage stats for paid users */}
      {usageStats}

      {/* Monthly limit warning */}
      {isPaid && monthlyGenerationsUsed >= monthlyGenerationLimit && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Monthly limit reached:</strong> You've used all {monthlyGenerationLimit} personalizations this month.
            Upgrade or wait for next month to continue personalizing content.
          </AlertDescription>
        </Alert>
      )}

      {/* Articles feed header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                {isPaid ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    Your Personalized Content Feed
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                    Latest Articles
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {isPaid
                  ? 'AI-personalized content matching your unique TrueTone voice'
                  : 'Professional mortgage and real estate content for your business'
                }
              </CardDescription>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Articles list */}
      {!loading && articles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles available</h3>
            <p className="text-gray-600 mb-4">
              Check back later for new content, or contact support if this seems incorrect.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && articles.length > 0 && (
        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              userTier={userTier}
              onPersonalize={handlePersonalize}
            />
          ))}
        </div>
      )}
    </div>
  );
}