import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCachedApiUser, CrossProductAccessError } from '@/lib/api/auth-cached';
import AccountClient from './account-client';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading account...</p>
      </div>
    </div>
  );
}

async function AccountContent() {
  try {
    const user = await getCachedApiUser();

    if (!user) {
      redirect('/api/auth/login?post_login_redirect_url=/account');
    }

    return <AccountClient user={user} />;
  } catch (error) {
    // Handle cross-product access (TrueTone user trying to access Newsletter)
    if (error instanceof CrossProductAccessError) {
      const upgradeUrl = new URL('/upgrade-to-newsletter', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
      upgradeUrl.searchParams.set('source', error.sourceProduct);
      if (error.email) {
        upgradeUrl.searchParams.set('email', error.email);
      }
      redirect(upgradeUrl.pathname + upgradeUrl.search);
    }
    throw error;
  }
}

export default function AccountPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccountContent />
    </Suspense>
  );
}
