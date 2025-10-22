import { Suspense } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import OnboardingClient from './onboarding-client';
import { Loader2 } from 'lucide-react';

async function checkOnboardingStatus(kindeId: string) {
  // For now, we'll just check if user exists in Kinde
  // Later, this can be expanded to check database for onboarding completion
  return {
    has_completed_onboarding: false,
    onboarding_step: 1,
  };
}

export default async function OnboardingPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isKindeAuthenticated = await isAuthenticated();

  if (!isKindeAuthenticated) {
    redirect('/');
  }

  const kindeUser = await getUser();
  if (!kindeUser?.id) {
    redirect('/');
  }

  // Check onboarding status
  const userStatus = await checkOnboardingStatus(kindeUser.id);

  // If user has already completed onboarding, redirect to dashboard
  if (userStatus?.has_completed_onboarding) {
    redirect('/dashboard');
  }

  // Prepare initial data
  const initialData = {
    email: kindeUser.email || '',
    firstName: kindeUser.given_name || '',
    lastName: kindeUser.family_name || '',
    currentStep: userStatus?.onboarding_step || 1,
    userId: kindeUser.id,
  };

  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading onboarding...</p>
          </div>
        </div>
      }>
        <OnboardingClient
          initialData={initialData}
        />
      </Suspense>
    </div>
  );
}