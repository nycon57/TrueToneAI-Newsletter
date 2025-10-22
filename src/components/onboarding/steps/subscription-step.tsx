'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useOnboarding } from '../providers/onboarding-provider';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { toast } from 'sonner';
import React from 'react';

export function SubscriptionStep() {
  const { previousStep, completeOnboarding, isSubmitting, updateData } = useOnboarding();
  const { organization } = useKindeBrowserClient();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSelectPlan = async (planId?: string) => {
    try {
      // Validate environment variable
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PAID_TIER;
      if (!priceId) {
        console.error('❌ Missing NEXT_PUBLIC_STRIPE_PRICE_ID_PAID_TIER environment variable');
        toast.error('Payment configuration error. Please contact support.');
        return;
      }

      // Set billing data for paid plans (await if updateData is async)
      if (planId) {
        await updateData('selectedPlan', planId);
        await updateData('billingType', planId === 'newsletter_enterprise' ? 'enterprise' : 'paid_plan');
      }

      // Call Stripe Checkout API to create a checkout session
      const baseUrl = window.location.origin;
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${baseUrl}/onboarding/success`,
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
        return;
      }

      const { url, error } = await response.json();

      if (error) {
        console.error('❌ Stripe Checkout error:', error);
        toast.error('Failed to create checkout session. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      toast.error('An error occurred. Please try again.');
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
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-heading font-bold mb-2">Choose Your Plan</CardTitle>
            <CardDescription className="text-base">
              Select a plan to unlock Spark&apos;s curated content and AI-powered personalization
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            {/* Free Trial Option */}
            <div className="border rounded-lg p-6 bg-skyward/5 border-skyward/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-heading font-semibold">Free Trial</h3>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold">$0</div>
                  <div className="text-sm text-muted-foreground">14 days, then $29/mo</div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-skyward" />
                  <span className="text-sm">Basic newsletter content</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-skyward" />
                  <span className="text-sm">Limited content personalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-skyward" />
                  <span className="text-sm">Standard support</span>
                </li>
              </ul>

              <Button
                onClick={handleCompleteFreeTrial}
                disabled={isSubmitting || isProcessing}
                variant="outline"
                className="w-full border-skyward text-skyward hover:bg-skyward hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Starting Trial...
                  </>
                ) : (
                  'Start Free Trial'
                )}
              </Button>
            </div>

            {/* Newsletter Pro Plan */}
            <div className="border-2 rounded-lg p-6 bg-orchid/5 border-orchid relative">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orchid text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-xl font-heading font-semibold">Newsletter Pro</h3>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold">$29</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Personalized newsletter content</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-orchid" />
                  <span className="text-sm">AI-powered content recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Voice-based personalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Easy-to-copy marketing content</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Priority customer support</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('newsletter_pro')}
                disabled={isSubmitting || isProcessing}
                className="w-full bg-orchid hover:bg-orchid/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Choose Pro Plan
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-6 bg-shadow/5 border-shadow/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-heading font-semibold">Enterprise</h3>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold">$99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Custom branding options</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-shadow" />
                  <span className="text-sm">White-label solutions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('newsletter_enterprise')}
                disabled={isSubmitting || isProcessing}
                variant="outline"
                className="w-full border-shadow text-shadow hover:bg-shadow hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Choose Enterprise
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                You can cancel anytime. Billing is securely processed by Stripe.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              className="flex items-center gap-2"
              disabled={isSubmitting || isProcessing}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="text-sm text-muted-foreground">
              Choose a plan above to continue
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}