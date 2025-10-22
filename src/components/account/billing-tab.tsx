'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiUser } from '@/lib/api/auth-cached';
import { motion } from 'motion/react';

interface BillingTabProps {
  user: ApiUser;
}

export function BillingTab({ user }: BillingTabProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isPaidUser = user.subscription_tier === 'paid' || user.subscription_tier === 'premium';
  const isActive = user.subscription_status === 'active';

  const handleManageBilling = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      toast.error('Failed to open billing portal. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-orchid/10">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Billing & Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-lg border-2 border-orchid/20 bg-gradient-to-br from-lavender/30 to-lavender/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orchid to-indigo flex items-center justify-center">
                {isPaidUser ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <Sparkles className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold capitalize">
                  {user.subscription_tier || 'Free'} Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPaidUser
                    ? 'Unlimited AI generations and premium features'
                    : 'Limited AI generations per month'}
                </p>
              </div>
            </div>
            <Badge
              variant={isActive ? 'default' : 'secondary'}
              className={
                isActive
                  ? 'bg-gradient-to-r from-orchid to-indigo text-white'
                  : ''
              }
            >
              {user.subscription_status || 'inactive'}
            </Badge>
          </div>

          {/* Plan Details */}
          <div className="space-y-2 mt-4 pt-4 border-t border-orchid/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Generations</span>
              <span className="font-medium">
                {isPaidUser
                  ? 'Unlimited'
                  : `${user.monthly_generations_used || 0} / ${user.monthly_generation_limit || 10}`}
              </span>
            </div>
            {user.generation_reset_date && !isPaidUser && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resets On</span>
                <span className="font-medium">
                  {new Date(user.generation_reset_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {user.subscription_expires_at && isPaidUser && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Renews On</span>
                <span className="font-medium">
                  {new Date(user.subscription_expires_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Manage Billing Button */}
        {user.stripe_customer_id ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              onClick={handleManageBilling}
              disabled={isLoading}
              className="w-full h-14 text-base bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Opening Portal...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Manage Billing
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Update payment methods, view invoices, or manage your subscription
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-6 rounded-lg border border-border bg-muted/30 text-center"
          >
            <h4 className="font-heading font-semibold mb-2">No Active Subscription</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to unlock unlimited AI generations and premium features
            </p>
            <Button
              onClick={() => (window.location.href = '/pricing')}
              className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow"
            >
              <Crown className="w-4 h-4 mr-2" />
              View Plans
            </Button>
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-4 rounded-lg bg-orchid/5 border border-orchid/20"
        >
          <p className="text-sm text-orchid">
            <strong>Need help?</strong> Contact our support team if you have any questions
            about your subscription or billing.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
