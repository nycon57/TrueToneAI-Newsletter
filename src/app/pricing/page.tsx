import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getCachedApiUserSafe } from '@/lib/api/auth-cached';
import { PricingClient } from './pricing-client';
import { Loader2 } from 'lucide-react';

/**
 * Pricing Page - Server Component
 * Shows Pro plan pricing for free users to upgrade
 */

function PricingLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-orchid mb-4" />
        <p className="text-muted-foreground">Loading pricing...</p>
      </div>
    </div>
  );
}

export default async function PricingPage() {
  // Get authentication status
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  // Get user data if authenticated
  const user = isAuth ? await getCachedApiUserSafe() : null;

  // If user is already on paid tier, redirect to billing
  if (user?.subscription_tier?.toUpperCase() === 'PAID' ||
      user?.subscription_tier?.toUpperCase() === 'PREMIUM') {
    redirect('/account?tab=billing');
  }

  return (
    <Suspense fallback={<PricingLoader />}>
      <PricingClient
        isAuthenticated={isAuth}
        user={user}
      />
    </Suspense>
  );
}

export const metadata = {
  title: 'Pricing - TrueTone Insights',
  description: 'Upgrade to Pro and unlock unlimited AI generations, personalized content, and premium features.',
};
