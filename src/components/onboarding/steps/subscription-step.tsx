'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useOnboarding } from '../providers/onboarding-provider';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { toast } from 'sonner';
import React from 'react';

export function SubscriptionStep() {
  const { data, previousStep, completeOnboarding, isSubmitting, updateData } = useOnboarding();
  const { organization } = useKindeBrowserClient();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSelectPlan = async (planId?: string) => {
    try {
      setIsProcessing(true);
      console.log('[Subscription] handleSelectPlan called with planId:', planId);

      // Validate environment variable
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PAID_TIER;
      console.log('[Subscription] NEXT_PUBLIC_STRIPE_PRICE_ID_PAID_TIER:', priceId ? 'set' : 'MISSING');
      if (!priceId) {
        console.error('❌ Missing NEXT_PUBLIC_STRIPE_PRICE_ID_PAID_TIER environment variable');
        toast.error('Payment configuration error. Please contact support.');
        setIsProcessing(false);
        return;
      }

      // Set billing data for paid plans
      if (planId) {
        await updateData('selectedPlan', planId);
        await updateData('billingType', planId === 'newsletter_enterprise' ? 'enterprise' : 'paid_plan');
      }

      // IMPORTANT: Create user in database BEFORE Stripe checkout
      // This ensures the webhook can find and update the user after payment
      console.log('[Subscription] Calling /api/user/onboarding with data:', {
        firstName: data.firstName,
        lastName: data.lastName,
        hasTranscript: !!data.transcript,
      });
      const onboardingResponse = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileData: {
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.jobTitle,
            company: data.company || '',
          },
          transcript: data.transcript,
          analysisResults: data.voiceAnalysis,
          truetoneSettings: data.truetoneSettings,
          categoryPreferences: data.categoryPreferences,
          tagPreferences: data.tagPreferences,
          billingData: {
            selectedPlan: planId || 'newsletter_pro',
            billingType: planId === 'newsletter_enterprise' ? 'enterprise' : 'paid_plan',
          },
        }),
      });

      if (!onboardingResponse.ok) {
        const error = await onboardingResponse.json();
        console.error('❌ Failed to create user before checkout:', error);
        toast.error('Failed to save your profile. Please try again.');
        setIsProcessing(false);
        return;
      }

      console.log('✅ User created/updated before Stripe checkout');

      // Now call Stripe Checkout API to create a checkout session
      const baseUrl = window.location.origin;
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${baseUrl}/onboarding/success`,
          cancelUrl: `${baseUrl}/onboarding?step=5`,
          priceId,
          metadata: {
            planId: planId || 'newsletter_pro',
            onboarding_session: 'true',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Stripe Checkout error:', error);
        toast.error('Failed to create checkout session. Please try again.');
        setIsProcessing(false);
        return;
      }

      const { url, error } = await response.json();

      if (error) {
        console.error('❌ Stripe Checkout error:', error);
        toast.error('Failed to create checkout session. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      toast.error('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCompleteFreeTrial = async () => {
    try {
      setIsProcessing(true);
      // Set billing data for free trial (await before navigation)
      await updateData('selectedPlan', 'free_trial');
      await updateData('billingType', 'free_trial');

      // Complete onboarding with free trial
      await completeOnboarding();
    } catch (error) {
      console.error('Error completing free trial:', error);
      setIsProcessing(false);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <Card className="shadow-lg border-2 border-orchid/20">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <CardTitle className="text-3xl font-heading font-bold mb-2 text-gray-900">Choose Your Plan</CardTitle>
            <CardDescription className="text-base text-gray-700">
              Start creating personalized content today with AI-powered insights
            </CardDescription>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <div className="border-2 rounded-xl p-6 bg-white border-gray-200 hover:border-gray-300 transition-all h-full flex flex-col">
              <div className="mb-4 mt-4">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-1">Free</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-heading font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">Perfect for getting started</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-skyward mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Access to 3 latest articles per week</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-skyward mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Read curated sales & mortgage insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-skyward mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Community support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400 line-through">AI-powered content generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400 line-through">Full article archive access</span>
                </li>
              </ul>

              <Button
                onClick={handleCompleteFreeTrial}
                disabled={isSubmitting || isProcessing}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Getting Started...
                  </>
                ) : (
                  'Get Started Free'
                )}
              </Button>
            </div>

            {/* Spark Pro Plan */}
            <div className="border-4 rounded-xl p-6 bg-gradient-to-br from-orchid/10 via-indigo/5 to-white border-orchid relative h-full flex flex-col shadow-xl">
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-orchid to-indigo text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide">
                  ⭐ Recommended
                </span>
              </div>

              <div className="mb-4 mt-4">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-1">Spark Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-heading font-bold bg-gradient-to-r from-orchid to-indigo bg-clip-text text-transparent">$19.95</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm font-semibold text-orchid">🎁 7-day free trial included</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orchid mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700"><strong>Unlimited access</strong> to full article archive</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orchid mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700"><strong>AI-powered content generation</strong> for emails, videos & social</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orchid mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700"><strong>Voice analysis & personalization</strong> - content in your unique style</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orchid mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700"><strong>One-click copy</strong> to instantly use in your marketing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orchid mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700"><strong>Advanced filters</strong> by content type, platform & date</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orchid mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700"><strong>Priority support</strong> - get help when you need it</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('newsletter_pro')}
                disabled={isSubmitting || isProcessing}
                className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-orchid/90 hover:to-indigo/90 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base py-6"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
              </Button>
              <p className="text-xs text-center text-gray-600 mt-3">
                Cancel anytime • No credit card required for trial
              </p>
            </div>
          </div>

          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-2">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="text-xs text-gray-500">
              🔒 Secure payment processing by Stripe • Cancel anytime, no questions asked
            </p>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={previousStep}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              disabled={isSubmitting || isProcessing}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}