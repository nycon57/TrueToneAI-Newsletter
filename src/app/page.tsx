'use client';

import { motion } from 'motion/react';
import { Sparkles, UserPlus, FileText } from 'lucide-react';
import Image from 'next/image';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useQueryState } from 'nuqs';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NavUser } from '@/components/ui/nav-user';
import { Skeleton } from '@/components/ui/skeleton';

// Custom Components
import { ArticleCard } from '@/components/article/ArticleCard';
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt';
import { LoginModal } from '@/components/auth/LoginModal';

// React Query hooks
import { useArticles, useUser } from '@/hooks/use-articles';

export default function HomePage() {
  // URL parameter filters using nuqs
  const [industry] = useQueryState('industry');
  const [category] = useQueryState('category');
  const [tags] = useQueryState('tags');
  const [saved] = useQueryState('saved');

  // Kinde authentication hooks
  const { logout, isAuthenticated, isLoading: kindeLoading, user: kindeUser } = useKindeBrowserClient();

  // React Query hooks - automatically cached and deduplicated
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
  } = useArticles({
    industry,
    category,
    tags,
    saved,
    enabled: !kindeLoading, // Only fetch when Kinde auth is ready
  });

  const { data: userData } = useUser(isAuthenticated);

  const articles = articlesData?.articles || [];
  const user = userData || null;
  const isPaid = user?.subscription_tier?.toUpperCase() === 'PAID';
  const isFreeUser = !isAuthenticated || user?.subscription_tier?.toUpperCase() === 'FREE';
  const loading = articlesLoading || kindeLoading;
  const error = articlesError ? 'Failed to fetch articles' : null;

  if (loading) {
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
                      name: `${kindeUser?.given_name || user?.firstName || 'User'} ${kindeUser?.family_name || user?.lastName || ''}`.trim(),
                      email: kindeUser?.email || user?.email || '',
                      avatar: kindeUser?.picture || '',
                      subscription_tier: user?.subscription_tier?.toUpperCase() || 'FREE'
                    }}
                    onLogout={logout}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <LoginModal>
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                        Login
                      </button>
                    </LoginModal>
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
                  <span>Welcome back, {kindeUser?.given_name || user?.firstName || user?.name || 'there'}!</span>
                </div>
              )}
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {isAuthenticated ? 'Your Market Intelligence' : 'Market Intelligence'}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {isAuthenticated
                  ? (isPaid
                      ? 'AI-personalized mortgage market insights, crafted for your unique voice and style.'
                      : 'Professional mortgage market insights. Upgrade for AI personalization and exclusive content.'
                    )
                  : 'Stay ahead with real-time mortgage market insights and professionally crafted content. Sign up for personalized AI content.'
                }
              </p>

              {/* Generation quota for paid users */}
              {isPaid && user?.monthly_generation_limit && (
                <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    AI Credits: {user.monthly_generations_used || 0} / {user.monthly_generation_limit} used this month
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <div className="space-y-6">
            {articles.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles available</h3>
                  <p className="text-gray-600">Check back later for new content.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {articles.map((article, index) => (
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
                {isFreeUser && articles.length >= 3 && (
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
            © 2024 TrueTone AI. Built for ambitious, top-producing, hyper-growth Loan Officers.
          </div>
        </div>
      </div>
    </>
  );
}