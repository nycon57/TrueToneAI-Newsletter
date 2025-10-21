'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type VerificationStatus = 'loading' | 'success' | 'error' | 'pending';

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');

      // If no session_id, this might be a free trial completion
      if (!sessionId) {
        setStatus('success');
        return;
      }

      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setErrorMessage(data.error || 'Failed to verify payment');
          return;
        }

        if (data.status === 'success') {
          setStatus('success');
        } else if (data.status === 'pending') {
          setStatus('pending');
          setErrorMessage(data.message || 'Payment verification pending');
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Payment was not completed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred while verifying your payment');
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Loading state while verifying payment
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <Card className="p-8">
            <CardContent className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-orchid" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Verifying Your Payment...
              </h2>
              <p className="text-muted-foreground">
                We&apos;re confirming your subscription. This will only take a moment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Pending state - Stripe Sync Engine not yet configured
  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <Card className="p-8">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-heading text-foreground">
                Payment Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Your payment is being processed. This may take a few moments.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  {errorMessage}
                </p>
              </div>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - payment failed or couldn't be verified
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <Card className="p-8">
            <CardHeader>
              <div className="mx-auto mb-4">
                <XCircleIcon className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-heading text-foreground">
                Payment Verification Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                We couldn&apos;t verify your payment. Please try again or contact support.
              </p>
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {errorMessage}
                  </p>
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => router.push('/onboarding')}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <Card className="p-8">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-heading text-foreground">
              Welcome to TrueTone Newsletter! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Your personalized newsletter experience is now ready! We&apos;ve set up everything based on your preferences.
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-left">
              <h3 className="font-heading font-semibold text-foreground mb-4">What&apos;s Next:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Access your personalized newsletter content</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Get AI-powered content recommendations</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Copy content easily for your own communications</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Modify your preferences anytime in settings</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Tip:</strong> Your first personalized newsletter will be available shortly. Check your dashboard to see the latest content tailored just for you!
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}