'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface AiLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generationsUsed: number;
  generationLimit: number;
  isBlocked?: boolean; // true if user has hit limit and can&apos;t generate
}

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic features',
    features: [
      'Access to all newsletter articles',
      '3 AI personalizations per month',
      'View default scripts and templates',
      'Mobile-friendly interface',
    ],
    limitations: [
      'Limited AI generations',
      'No saved articles',
      'Basic support',
    ],
    ctaText: 'Current Plan',
    ctaVariant: 'outline' as const,
    highlighted: false,
    disabled: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Perfect for active loan officers',
    features: [
      'Everything in Free, plus:',
      'Unlimited AI personalizations',
      'Save articles for later',
      'AI chat for article insights',
      'Custom voice & tone matching',
      'Export to multiple formats',
      'Priority email support',
    ],
    limitations: [],
    ctaText: 'Upgrade to Pro',
    ctaVariant: 'default' as const,
    highlighted: true,
    disabled: false,
  },
];

export function AiLimitModal({
  open,
  onOpenChange,
  generationsUsed,
  generationLimit,
  isBlocked = false,
}: AiLimitModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usagePercentage = (generationsUsed / generationLimit) * 100;
  const remainingGenerations = Math.max(0, generationLimit - generationsUsed);

  const handleUpgrade = async () => {
    // Validate Stripe price ID before making request
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) {
      const errorMsg = 'Stripe price ID is not configured. Please contact support.';
      setError(errorMsg);
      console.error('Missing NEXT_PUBLIC_STRIPE_PRICE_ID');
      return;
    }

    setIsUpgrading(true);
    setError(null);

    try {
      // Redirect to Stripe checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to start upgrade process';
      console.error('Error upgrading:', {
        error,
        message: errorMsg,
      });
      setError(errorMsg);
      setIsUpgrading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-primary" />
            {isBlocked ? 'AI Generation Limit Reached' : 'AI Generation Usage'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isBlocked
              ? 'You\'ve used all your free AI generations this month. Upgrade to Pro for unlimited access.'
              : `you&apos;ve used ${generationsUsed} of ${generationLimit} free AI generations this month.`}
          </DialogDescription>
        </DialogHeader>

        {/* Usage Progress Bar */}
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">This Month's Usage</span>
            <span className="text-muted-foreground">
              {generationsUsed} / {generationLimit}
            </span>
          </div>
          <Progress
            value={usagePercentage}
            className={cn(
              'h-2',
              isBlocked && 'bg-destructive/20'
            )}
            indicatorClassName={cn(
              usagePercentage >= 100
                ? 'bg-destructive'
                : usagePercentage >= 75
                  ? 'bg-orange-500'
                  : 'bg-primary'
            )}
          />
          {!isBlocked && (
            <p className="text-sm text-muted-foreground">
              {remainingGenerations} generation{remainingGenerations !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-4 py-6">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative rounded-xl border-2 p-6 transition-all',
                tier.highlighted
                  ? 'border-primary shadow-lg bg-primary/5'
                  : 'border-border bg-background'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tier.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">
                    / {tier.period}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.limitations.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t">
                    {tier.limitations.map((limitation, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <XMarkIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  variant={tier.ctaVariant}
                  className="w-full mt-4"
                  disabled={tier.disabled || isUpgrading}
                  onClick={tier.disabled ? undefined : handleUpgrade}
                >
                  {tier.disabled
                    ? tier.ctaText
                    : isUpgrading
                      ? 'Redirecting...'
                      : tier.ctaText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isUpgrading}
            className="w-full sm:w-auto"
          >
            {isBlocked ? 'Close' : 'Maybe Later'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Compact version for inline warnings
export function AiLimitWarning({
  generationsUsed,
  generationLimit,
  onUpgradeClick,
}: {
  generationsUsed: number;
  generationLimit: number;
  onUpgradeClick: () => void;
}) {
  const remainingGenerations = Math.max(0, generationLimit - generationsUsed);
  const usagePercentage = (generationsUsed / generationLimit) * 100;

  if (usagePercentage < 75) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={cn(
        'rounded-lg border p-4 space-y-3',
        usagePercentage >= 100
          ? 'bg-destructive/10 border-destructive/20'
          : 'bg-orange-500/10 border-orange-500/20'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <p className="font-medium text-sm">
            {usagePercentage >= 100
              ? 'AI Generation Limit Reached'
              : 'Running Low on AI Generations'}
          </p>
          <p className="text-sm text-muted-foreground">
            {usagePercentage >= 100
              ? 'Upgrade to Pro for unlimited AI personalizations.'
              : `${remainingGenerations} generation${remainingGenerations !== 1 ? 's' : ''} remaining this month.`}
          </p>
        </div>
        <Button
          size="sm"
          variant="default"
          onClick={onUpgradeClick}
          className="flex-shrink-0"
        >
          Upgrade
        </Button>
      </div>

      <Progress
        value={usagePercentage}
        className="h-1.5"
        indicatorClassName={usagePercentage >= 100 ? 'bg-destructive' : 'bg-orange-500'}
      />
    </motion.div>
  );
}
