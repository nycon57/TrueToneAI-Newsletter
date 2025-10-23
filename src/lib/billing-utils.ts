/**
 * Billing & Subscription Utilities
 * Pure functions for determining user subscription state and UI configurations
 */

import type { ApiUser } from '@/lib/api/auth-cached';

/**
 * User subscription states for billing UI
 */
export type UserSubscriptionState =
  | 'free-never-subscribed'  // Free tier, no stripe_customer_id
  | 'free-cancelled'          // Free tier, has stripe_customer_id (previously subscribed)
  | 'pro-active'              // Paid/Premium tier, status: active
  | 'pro-trialing'            // Paid/Premium tier, status: trialing
  | 'pro-past-due'            // Paid/Premium tier, status: past_due
  | 'pro-cancelled'           // Paid/Premium tier, status: canceled
  | 'pro-incomplete';         // Paid/Premium tier, status: incomplete

export interface BadgeConfig {
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export interface CTAConfig {
  showUpgrade: boolean;
  showManageBilling: boolean;
  upgradeText: string;
  upgradeDescription: string;
  manageText?: string;
  manageDescription?: string;
}

export interface MessageConfig {
  heading: string;
  description: string;
  variant: 'default' | 'upgrade' | 'warning';
}

/**
 * Determine user's current subscription state
 * Pure function that analyzes user data to return a specific state
 */
export function determineUserState(user: ApiUser): UserSubscriptionState {
  // Normalize tier to uppercase (handle both lowercase and uppercase values)
  const tier = (user.subscription_tier?.toUpperCase() || 'FREE') as 'FREE' | 'PAID' | 'PREMIUM';

  // Normalize status to lowercase for consistent comparison
  const status = user.subscription_status?.toLowerCase();

  // Check if user has ever subscribed (has Stripe customer ID)
  const hasStripeId = !!user.stripe_customer_id;

  // Free tier users
  if (tier === 'FREE') {
    return hasStripeId ? 'free-cancelled' : 'free-never-subscribed';
  }

  // Paid/Premium tier users - check their subscription status
  switch (status) {
    case 'active':
      return 'pro-active';
    case 'trialing':
      return 'pro-trialing';
    case 'past_due':
      return 'pro-past-due';
    case 'canceled':
    case 'cancelled': // Handle both spellings
      return 'pro-cancelled';
    case 'incomplete':
    case 'incomplete_expired':
      return 'pro-incomplete';
    default:
      // Fallback for paid tier with unknown status
      return 'pro-active';
  }
}

/**
 * Get badge configuration based on subscription state
 */
export function getBadgeConfig(state: UserSubscriptionState): BadgeConfig {
  switch (state) {
    case 'free-never-subscribed':
    case 'free-cancelled':
      return {
        text: 'Free',
        variant: 'outline',
        className: 'border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400'
      };

    case 'pro-active':
      return {
        text: 'Pro',
        variant: 'default',
        className: 'bg-gradient-to-r from-orchid to-indigo text-white border-0'
      };

    case 'pro-trialing':
      return {
        text: 'Pro Trial',
        variant: 'default',
        className: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0'
      };

    case 'pro-past-due':
      return {
        text: 'Past Due',
        variant: 'destructive',
        className: 'bg-yellow-500 text-yellow-900 border-yellow-600'
      };

    case 'pro-cancelled':
      return {
        text: 'Cancelled',
        variant: 'secondary',
        className: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
      };

    case 'pro-incomplete':
      return {
        text: 'Incomplete',
        variant: 'outline',
        className: 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950 dark:text-orange-400'
      };
  }
}

/**
 * Get CTA (Call-to-Action) configuration based on subscription state
 */
export function getCTAConfig(state: UserSubscriptionState): CTAConfig {
  switch (state) {
    case 'free-never-subscribed':
      return {
        showUpgrade: true,
        showManageBilling: false,
        upgradeText: 'Upgrade to Pro',
        upgradeDescription: 'Unlock 25 AI generations per month (refreshed monthly), personalized content, and premium features'
      };

    case 'free-cancelled':
      return {
        showUpgrade: true,
        showManageBilling: true,
        upgradeText: 'Upgrade to Pro',
        upgradeDescription: 'Unlock 25 AI generations per month (refreshed monthly), personalized content, and premium features',
        manageText: 'Manage Billing',
        manageDescription: 'View your payment history, update payment methods, or manage your account'
      };

    case 'pro-active':
    case 'pro-trialing':
      return {
        showUpgrade: false,
        showManageBilling: true,
        upgradeText: '',
        upgradeDescription: '',
        manageText: 'Manage Subscription',
        manageDescription: 'Update payment methods, view invoices, change plan, or cancel subscription'
      };

    case 'pro-past-due':
      return {
        showUpgrade: false,
        showManageBilling: true,
        upgradeText: '',
        upgradeDescription: '',
        manageText: 'Update Payment Method',
        manageDescription: 'Your payment failed. Please update your payment method to avoid service interruption'
      };

    case 'pro-cancelled':
      return {
        showUpgrade: true,
        showManageBilling: true,
        upgradeText: 'Reactivate Subscription',
        upgradeDescription: 'Your subscription is cancelled. Reactivate to regain Pro access after your current period ends',
        manageText: 'View Billing History',
        manageDescription: 'Access your past invoices, payment history, and account details'
      };

    case 'pro-incomplete':
      return {
        showUpgrade: false,
        showManageBilling: true,
        upgradeText: '',
        upgradeDescription: '',
        manageText: 'Complete Setup',
        manageDescription: 'Complete your payment setup to activate your Pro subscription and unlock all features'
      };
  }
}

/**
 * Get contextual messaging based on subscription state
 */
export function getMessageConfig(state: UserSubscriptionState, user: ApiUser): MessageConfig {
  switch (state) {
    case 'free-never-subscribed':
      return {
        heading: "You're on the Free Plan",
        description: `You have ${user.monthly_generation_limit || 3} lifetime AI generations total. Upgrade to Pro for 25 generations per month and personalized content.`,
        variant: 'default'
      };

    case 'free-cancelled': {
      return {
        heading: "You're on the Free Plan",
        description: `You have ${user.monthly_generation_limit || 3} lifetime AI generations total. Upgrade to Pro for 25 generations per month and personalized content.`,
        variant: 'upgrade'
      };
    }

    case 'pro-active':
      return {
        heading: 'Pro Plan Active',
        description: 'Enjoy 25 AI generations per month, personalized content, and all premium features',
        variant: 'default'
      };

    case 'pro-trialing': {
      const trialEnd = user.subscription_expires_at
        ? new Date(user.subscription_expires_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : null;
      return {
        heading: 'Pro Trial Active',
        description: trialEnd
          ? `Your trial ends on ${trialEnd}. You'll be billed automatically unless you cancel before this date.`
          : 'Enjoy your Pro trial with unlimited access to all premium features',
        variant: 'default'
      };
    }

    case 'pro-past-due':
      return {
        heading: 'Payment Required',
        description: 'Your last payment failed. Update your payment method immediately to avoid losing access to Pro features.',
        variant: 'warning'
      };

    case 'pro-cancelled': {
      const expiresAt = user.subscription_expires_at
        ? new Date(user.subscription_expires_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : null;
      return {
        heading: 'Subscription Cancelled',
        description: expiresAt
          ? `You have Pro access until ${expiresAt}. Reactivate before this date to continue without interruption.`
          : 'Your subscription has been cancelled. Reactivate anytime to regain access to Pro features.',
        variant: 'warning'
      };
    }

    case 'pro-incomplete':
      return {
        heading: 'Payment Setup Incomplete',
        description: 'Complete your payment setup to activate your Pro subscription and unlock all premium features.',
        variant: 'warning'
      };
  }
}

/**
 * Check if user is on a paid tier (PAID or PREMIUM)
 */
export function isPaidTier(state: UserSubscriptionState): boolean {
  return state.startsWith('pro-');
}

/**
 * Check if user can access paid features
 * Returns true only if user has active Pro subscription
 */
export function canAccessPaidFeatures(state: UserSubscriptionState): boolean {
  return state === 'pro-active' || state === 'pro-trialing';
}

/**
 * Get user-friendly plan name
 */
export function getPlanName(state: UserSubscriptionState): string {
  return isPaidTier(state) ? 'Pro' : 'Free';
}

/**
 * Check if a user's generation limit resets monthly
 * Free tier: lifetime limit (no reset)
 * Paid tiers: monthly limit (resets each month)
 */
export function hasMonthlyReset(state: UserSubscriptionState): boolean {
  return isPaidTier(state);
}

/**
 * Get generation limit description based on user state
 * Returns appropriate text for UI display
 */
export function getGenerationLimitText(state: UserSubscriptionState, limit: number): string {
  if (isPaidTier(state)) {
    return `${limit} generations per month`;
  } else {
    return `${limit} lifetime generations`;
  }
}
