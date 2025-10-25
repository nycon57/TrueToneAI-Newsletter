'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Mail, Bot, Settings, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

type VerificationStatus = 'loading' | 'success' | 'error' | 'pending';

function OnboardingSuccessContent() {
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

  // Trigger confetti animation on success
  useEffect(() => {
    if (status === 'success') {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [status]);

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
                onClick={() => router.push('/')}
                className="w-full"
              >
                Go to Home
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-auto"
      >
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center pb-6 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto"
            >
              <div className="relative">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-heading font-bold text-foreground">
              Welcome to Spark!
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              You&apos;re all set! Start exploring curated content tailored to your interests and turn insights into action.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Quick Start Checklist */}
            <div className="bg-gradient-to-br from-primary/5 via-orchid/5 to-skyward/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground text-lg">
                  Quick Start Checklist
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded border-2 border-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-skyward" />
                      <span className="font-medium">Browse Spark content</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore curated articles tailored to your preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded border-2 border-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orchid" />
                      <span className="font-medium">Personalize with AI</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Transform articles for your unique voice and audience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded border-2 border-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-shadow" />
                      <span className="font-medium">Review your preferences</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adjust categories and tags anytime in settings
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded border-2 border-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="font-medium">Try copying content</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      One-click copy for emails, social media, and more
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-orchid/10 border border-orchid/30 rounded-lg p-4">
              <p className="text-orchid text-sm leading-relaxed">
                <strong className="font-semibold">Pro Tip:</strong> Spark delivers fresh content based on your selected categories. Use AI to personalize any article for your unique voice, then copy and share with your audience in seconds!
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-12 bg-primary hover:bg-primary/90"
                size="lg"
              >
                Start Exploring Spark
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function OnboardingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <Card className="p-8">
            <CardContent className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-orchid" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Loading...
              </h2>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <OnboardingSuccessContent />
    </Suspense>
  );
}