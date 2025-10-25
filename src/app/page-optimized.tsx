'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, UserPlus, FileText } from 'lucide-react';
import Image from 'next/image';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useQueryState } from 'nuqs';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NavUser } from '@/components/ui/nav-user';
import { Skeleton } from '@/components/ui/skeleton';

// Custom Components
import { ArticleCard } from '@/components/article/ArticleCard';
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt';

// Hooks
import { useArticles, useUser } from '@/hooks/use-articles';

interface Article {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  industry?: string;
  category?: string;
  tags?: string[];
  keyInsights?: string[];
  videoScript?: string;
  emailTemplate?: string;
  socialContent?: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  is_personalized: boolean;
  tier: string;
  is_saved?: boolean;
  published_at: string;
}

interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  subscription_tier?: string;
  monthly_generation_limit?: number;
  monthly_generations_used?: number;
}

export default function HomePage() {
  // URL parameter filters using nuqs
  const [industry] = useQueryState('industry');
  const [category] = useQueryState('category');
  const [tags] = useQueryState('tags');
  const [saved] = useQueryState('saved');

  // Kinde authentication hooks
  const { logout, isAuthenticated, isLoading: kindeLoading, user: kindeUser } = useKindeBrowserClient();

  // OPTIMIZED: Use React Query hooks for data fetching with automatic caching
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError
  } = useArticles({
    industry,
    category,
    tags,
    saved,
    enabled: !kindeLoading, // Only fetch when Kinde has finished loading
  });

  const {
    data: userData,
    isLoading: userLoading
  } = useUser(isAuthenticated);

  // OPTIMIZED: Calculate tier eligibility during render (not in effect)
  const canAccessPremium = useMemo(() => {
    const tier = userData?.subscription_tier?.toLowerCase() || 'free';
    return tier === 'premium' || tier === 'pro' || tier === 'paid';
  }, [userData?.subscription_tier]);

  // OPTIMIZED: Compute tier flags during render
  const normalizedTier = userData?.subscription_tier?.toLowerCase() || 'free';
  const isPaid = normalizedTier === 'paid' || canAccessPremium;
  const isFreeUser = !isAuthenticated || normalizedTier === 'free';

  // OPTIMIZED: Filter articles based on tier during render (not during fetch)
  const visibleArticles = useMemo(() => {
    const articles = articlesData?.articles || [];
    if (canAccessPremium) {
      return articles; // Premium users see all articles
    }
    // Free users only see free-tier articles
    return articles.filter(article => {
      const articleTier = article.tier?.toLowerCase() || 'free';
      return articleTier === 'free';
    });
  }, [articlesData?.articles, canAccessPremium]);

  // Combine loading states
  const loading = kindeLoading || articlesLoading || (isAuthenticated && userLoading);
  const error = articlesError ? (articlesError instanceof Error ? articlesError.message : 'An error occurred') : null;

  if (loading || kindeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-6" />
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
        </div>

        {/* Articles Skeleton */}
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20 flex items-center justify-center p-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Content</h1>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="relative h-10">
                <Image
                  src="/logo/landscape/TrueToneAI-Landscape-Logo-Full-Color.png"
                  alt="TrueTone AI"
                  width={200}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <NavUser
                    user={{
                      name: `${kindeUser?.given_name || userData?.firstName || 'User'} ${kindeUser?.family_name || userData?.lastName || ''}`.trim(),
                      email: kindeUser?.email || userData?.email || '',
                      avatar: userData?.avatar || kindeUser?.picture || '',
                      subscription_tier: userData?.subscription_tier || 'free'
                    }}
                    onLogout={logout}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <LoginLink postLoginRedirectURL="/">
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                        Login
                      </button>
                    </LoginLink>
                    <RegisterLink postLoginRedirectURL="/onboarding">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </RegisterLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden py-16">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isAuthenticated && (
                <div className="inline-flex items-center gap-2 bg-lavender/30 text-orchid px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Welcome back, {kindeUser?.given_name || userData?.firstName || userData?.name || 'there'}!</span>
                </div>
              )}
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {isAuthenticated
                  ? (isPaid ? 'Your Spark Content' : 'Spark Newsletter')
                  : 'Spark Newsletter for Sales Pros'
                }
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {!isAuthenticated
                  ? 'Curated market insights for sales professionals. Subscribe to Spark and turn industry news into content you can share with your audience.'
                  : (isPaid
                      ? 'Your weekly Spark content, ready to personalize with AI. Copy scripts, transform articles for your voice, and share with your audience in seconds.'
                      : 'Your weekly Spark newsletter with curated market insights. Upgrade to unlock AI personalization and create content in your unique voice.'
                    )
                }
              </p>

              {/* Generation quota for paid users */}
              {isPaid && userData?.monthly_generation_limit && (
                <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    AI Credits: {userData.monthly_generations_used || 0} / {userData.monthly_generation_limit} used this month
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <div className="space-y-6">
            {visibleArticles.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles available</h3>
                  <p className="text-gray-600">Check back later for new content.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {visibleArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <ArticleCard
                      article={article}
                      isAuthenticated={isAuthenticated}
                      isPaid={isPaid}
                    />
                  </motion.div>
                ))}

                {/* Show upgrade prompt after 3rd article for free users */}
                {isFreeUser && visibleArticles.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                  >
                    <UpgradePrompt />
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            © 2024 Spark by TrueTone AI. Curated insights for sales professionals who lead.
          </div>
        </div>
      </div>
    </>
  );
}