import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCachedApiUser } from '@/lib/api/auth-cached';
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
  const user = await getCachedApiUser();

  if (!user) {
    redirect('/api/auth/login?post_login_redirect_url=/account');
  }

  return <AccountClient user={user} />;
}

export default function AccountPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccountContent />
    </Suspense>
  );
}
