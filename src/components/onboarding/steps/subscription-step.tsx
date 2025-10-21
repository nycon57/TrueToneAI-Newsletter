'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, CheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../providers/onboarding-provider';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

export function SubscriptionStep() {
  const { previousStep, completeOnboarding, isSubmitting, updateData } = useOnboarding();
  const { organization } = useKindeBrowserClient();

  const handleSelectPlan = async (planId?: string) => {
    try {
      // Set billing data for paid plans
      if (planId) {
        updateData('selectedPlan', planId);
        updateData('billingType', planId === 'newsletter_enterprise' ? 'enterprise' : 'paid_plan');
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
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PAID_TIER,
          metadata: {
            planId: planId || 'newsletter_pro',
            onboarding_session: 'true',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Stripe Checkout error:', error);
        // TODO: Show error toast to user
        alert('Failed to create checkout session. Please try again.');
        return;
      }

      const { url, error } = await response.json();

      if (error) {
        console.error('❌ Stripe Checkout error:', error);
        alert('Failed to create checkout session. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCompleteFreeTrial = async () => {
    // Set billing data for free trial
    updateData('selectedPlan', 'free_trial');
    updateData('billingType', 'free_trial');

    // Complete onboarding with free trial
    await completeOnboarding();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-heading font-bold mb-2">Choose Your Plan</CardTitle>
            <CardDescription className="text-base">
              Select a subscription plan to access your personalized newsletter experience
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            {/* Free Trial Option */}
            <div className="border rounded-lg p-6 bg-skyward/5 border-skyward/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-heading font-semibold">Free Trial</h3>
                <div className="text-right">
                  <div className="text-2xl font-heading font-bold">$0</div>
                  <div className="text-sm text-muted-foreground">14 days free</div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-skyward" />
                  <span className="text-sm">Basic newsletter content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-skyward" />
                  <span className="text-sm">Limited content personalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-skyward" />
                  <span className="text-sm">Standard support</span>
                </li>
              </ul>

              <Button
                onClick={handleCompleteFreeTrial}
                disabled={isSubmitting}
                variant="outline"
                className="w-full border-skyward text-skyward hover:bg-skyward hover:text-white"
              >
                Start Free Trial
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
                  <CheckIcon className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Personalized newsletter content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-orchid" />
                  <span className="text-sm">AI-powered content recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Voice-based personalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Easy-to-copy marketing content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-orchid" />
                  <span className="text-sm">Priority customer support</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('newsletter_pro')}
                disabled={isSubmitting}
                className="w-full bg-orchid hover:bg-orchid/90"
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
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
                  <CheckIcon className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Custom branding options</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-shadow" />
                  <span className="text-sm">White-label solutions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-shadow" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('newsletter_enterprise')}
                disabled={isSubmitting}
                variant="outline"
                className="w-full border-shadow text-shadow hover:bg-shadow hover:text-white"
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
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
              disabled={isSubmitting}
            >
              <ArrowLeftIcon className="h-4 w-4" />
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