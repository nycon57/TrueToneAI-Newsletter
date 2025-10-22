'use client';

import { useState, useTransition } from 'react';
import { motion } from 'motion/react';
import { Sparkles, UserPlus, FileText } from 'lucide-react';
import Image from 'next/image';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useRouter } from 'next/navigation';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NavUser } from '@/components/ui/nav-user';

// Custom Components - Lazy load non-critical components
import dynamic from 'next/dynamic';

const ArticleCard = dynamic(() => import('@/components/article/ArticleCard').then(mod => ({ default: mod.ArticleCard })), {
  ssr: true,
});

const UpgradePrompt = dynamic(() => import('@/components/upgrade/UpgradePrompt').then(mod => ({ default: mod.UpgradePrompt })), {
  ssr: true,
});

const LoginModal = dynamic(() => import('@/components/auth/LoginModal').then(mod => ({ default: mod.LoginModal })), {
  ssr: true,
});

interface HomePageClientProps {
  initialArticles: any;
  initialUser: any;
  isAuthenticated: boolean;
  kindeUser: any;
  filters: {
    industry: string | null;
    category: string | null;
    tags: string | null;
    saved: string | null;
  };
}

/**
 * Client component for the home page
 * Receives server-fetched data as props to minimize client-side loading
 */
export function HomePageClient({
  initialArticles,
  initialUser,
  isAuthenticated: serverAuth,
  kindeUser: serverKindeUser,
  filters,
}: HomePageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Use server data as initial state
  const [articles] = useState(initialArticles?.articles || []);
  const [user] = useState(initialUser);

  // Client-side Kinde hooks for interactivity
  const { logout, isAuthenticated: clientAuth } = useKindeBrowserClient();

  // Use server auth status initially, then client auth when available
  const isAuthenticated = clientAuth ?? serverAuth;
  const kindeUser = serverKindeUser;

  // Debug logging for avatar
  console.log('[HomePageClient] User data:', {
    hasUser: !!user,
    userAvatar: user?.avatar,
    kindeUserPicture: kindeUser?.picture,
    userName: user?.name,
  });

  const normalizedTier = user?.subscription_tier?.toUpperCase() || 'FREE';
  const isPaid = normalizedTier === 'PAID' || normalizedTier === 'PREMIUM';
  const isFreeUser = !isAuthenticated || normalizedTier === 'FREE';

  // Handle filter changes with transitions for smooth updates
  const handleFilterChange = (newFilters: Record<string, string>) => {
    startTransition(() => {
      const params = new URLSearchParams();
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      router.push(`/?${params.toString()}`);
    });
  };

  return (
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
                    avatar: user?.avatar || kindeUser?.picture || '',
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

      {/* Articles - Optimized with minimal animations */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="space-y-6" style={{ opacity: isPending ? 0.6 : 1 }}>
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
              {articles.map((article: any, index: number) => (
                // Reduced animation for better performance
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
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
  );
}