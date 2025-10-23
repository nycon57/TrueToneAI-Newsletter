'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown, Loader2, Sparkles, AlertTriangle, Zap, Target } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiUser } from '@/lib/api/auth-cached';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  determineUserState,
  getBadgeConfig,
  getCTAConfig,
  getMessageConfig,
  isPaidTier,
  getPlanName,
} from '@/lib/billing-utils';

interface BillingTabProps {
  user: ApiUser;
}

export function BillingTab({ user }: BillingTabProps) {
  const [isLoading, setIsLoading] = useState<'upgrade' | 'billing' | null>(null);

  // Determine user's current subscription state
  const userState = determineUserState(user);
  const badgeConfig = getBadgeConfig(userState);
  const ctaConfig = getCTAConfig(userState);
  const messageConfig = getMessageConfig(userState, user);
  const isProTier = isPaidTier(userState);
  const planName = getPlanName(userState);

  const handleUpgrade = async () => {
    setIsLoading('upgrade');

    try {
      const baseUrl = window.location.origin;
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${baseUrl}/account?tab=billing`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[BillingTab] Checkout API error:', {
          status: response.status,
          statusText: response.statusText,
          error: error.error,
          message: error.message,
          fullError: error
        });
        throw new Error(error.error || error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again or contact support.');
      setIsLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading('billing');

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portal session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Customer Portal
        window.location.href = url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Billing portal error:', error);

      // User-friendly error messages
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to open billing portal';

      if (errorMessage.includes('customer ID')) {
        toast.error('Your account is not set up for billing. Please contact support.');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('Please log in to manage billing.');
      } else {
        toast.error('Failed to open billing portal. Please try again or contact support.');
      }

      setIsLoading(null);
    }
  };

  return (
    <Card className="shadow-lg border-orchid/10">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Billing & Subscription</CardTitle>
        <CardDescription>
          {isProTier
            ? 'Manage your Pro subscription and payment methods'
            : 'View your plan details and upgrade options'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'p-6 rounded-lg border-2',
            isProTier
              ? 'border-orchid/20 bg-gradient-to-br from-lavender/30 to-lavender/20'
              : 'border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-background'
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  isProTier
                    ? 'bg-gradient-to-br from-orchid to-indigo'
                    : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                )}
              >
                {isProTier ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <Sparkles className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">
                  {planName} Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  {messageConfig.description}
                </p>
              </div>
            </div>
            <Badge
              variant={badgeConfig.variant}
              className={badgeConfig.className}
            >
              {badgeConfig.text}
            </Badge>
          </div>

          {/* Plan Details */}
          <div className="space-y-3 mt-4 pt-4 border-t border-orchid/20">
            {/* Generation Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isProTier ? 'Monthly Generations' : 'Lifetime Generations'}
                </span>
                <span className="font-medium">
                  {isProTier
                    ? `${user.monthly_generations_used || 0} / ${user.monthly_generation_limit || 25} this month`
                    : `${user.monthly_generations_used || 0} / ${user.monthly_generation_limit || 3} total`}
                </span>
              </div>

              {/* Progress Bar */}
              {(() => {
                const used = user.monthly_generations_used || 0;
                const limit = user.monthly_generation_limit || (isProTier ? 25 : 3);
                const percentage = Math.min((used / limit) * 100, 100);

                // Determine state for free users
                const isCritical = !isProTier && used >= limit;
                const isWarning = !isProTier && used === limit - 1;

                let progressColor = 'from-emerald-400 to-emerald-600';
                if (isCritical) {
                  progressColor = 'from-red-500 to-red-600';
                } else if (isWarning) {
                  progressColor = 'from-yellow-400 to-orange-500';
                }

                return (
                  <div
                    className="relative w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-label={`${used} of ${limit} AI generations used`}
                    aria-valuenow={used}
                    aria-valuemin={0}
                    aria-valuemax={limit}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={cn(
                        'absolute h-full bg-gradient-to-r',
                        progressColor
                      )}
                    />
                  </div>
                );
              })()}

              {/* Usage Percentage */}
              <div className="flex items-center justify-end">
                <span className="text-xs text-muted-foreground">
                  {Math.round(
                    ((user.monthly_generations_used || 0) /
                    (user.monthly_generation_limit || (isProTier ? 25 : 3))) * 100
                  )}% used
                </span>
              </div>
            </div>

            {/* Reset Date - Only for Pro users */}
            {user.generation_reset_date && isProTier && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resets On</span>
                <span className="font-medium">
                  {new Date(user.generation_reset_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Subscription Expiry/Renewal Date */}
            {user.subscription_expires_at && isProTier && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {userState === 'pro-cancelled' ? 'Active Until' : 'Renews On'}
                </span>
                <span className="font-medium">
                  {new Date(user.subscription_expires_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Warning/Info Alert for specific states */}
        {messageConfig.variant === 'warning' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                  {messageConfig.heading}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  {messageConfig.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Free User Usage Alerts */}
        {!isProTier && (() => {
          const used = user.monthly_generations_used || 0;
          const limit = user.monthly_generation_limit || 3;

          // Critical state: All generations used
          if (used >= limit) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 rounded-lg bg-red-50 border-2 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 dark:text-red-200 text-base">
                      All Generations Used
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                      You've used all 3 of your lifetime free AI generations. Upgrade to Pro to get 25 generations per month and unlock unlimited potential.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          }

          // Warning state: Only 1 generation remaining
          if (used === limit - 1) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 rounded-lg bg-yellow-50 border-2 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 text-base">
                      Only 1 Generation Remaining
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                      You're almost out of free generations. Upgrade to Pro for 25 generations per month and never run out again.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          }

          return null;
        })()}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-3"
        >
          {/* Upgrade Button */}
          {ctaConfig.showUpgrade && (() => {
            const used = user.monthly_generations_used || 0;
            const limit = user.monthly_generation_limit || 3;
            const isCritical = !isProTier && used >= limit;
            const isWarning = !isProTier && used === limit - 1;

            // Determine button text and icon based on state
            let ButtonIcon = Crown;
            let buttonText = ctaConfig.upgradeText;

            if (isCritical) {
              ButtonIcon = Zap;
              buttonText = 'Upgrade Now for Unlimited';
            } else if (isWarning) {
              ButtonIcon = Target;
              buttonText = 'Upgrade to Pro';
            }

            return (
              <div>
                <Button
                  onClick={handleUpgrade}
                  disabled={isLoading !== null}
                  className={cn(
                    'w-full h-14 text-base bg-gradient-to-r transition-all shadow-md hover:shadow-lg',
                    isCritical
                      ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                      : isWarning
                      ? 'from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-orange-600'
                      : 'from-orchid to-indigo hover:from-indigo hover:to-shadow'
                  )}
                >
                  {isLoading === 'upgrade' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ButtonIcon className="w-5 h-5 mr-2" />
                      {buttonText}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {isCritical
                    ? 'Get 25 AI generations per month and never run out'
                    : isWarning
                    ? 'Upgrade before you run out - get 25 generations per month'
                    : ctaConfig.upgradeDescription}
                </p>
              </div>
            );
          })()}

          {/* Manage Billing Button */}
          {ctaConfig.showManageBilling && (
            <div>
              <Button
                onClick={handleManageBilling}
                disabled={isLoading !== null}
                variant={ctaConfig.showUpgrade ? 'outline' : 'default'}
                className={cn(
                  'w-full h-14 text-base transition-all',
                  !ctaConfig.showUpgrade &&
                    'bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow shadow-md hover:shadow-lg'
                )}
              >
                {isLoading === 'billing' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Opening Portal...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {ctaConfig.manageText}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {ctaConfig.manageDescription}
              </p>
            </div>
          )}
        </motion.div>

        {/* Help Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-4 rounded-lg bg-orchid/5 border border-orchid/20"
        >
          <p className="text-sm text-orchid dark:text-orchid/90">
            <strong>Need help?</strong> Contact our support team if you have any questions
            about your subscription or billing.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
