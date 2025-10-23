/**
 * Subscription Guard Utilities
 * Functions to check user subscription status and enforce access control
 */

import { createClient } from '@/lib/supabase/server';

export interface SubscriptionStatus {
  tier: 'FREE' | 'PAID' | 'PREMIUM';
  status: string | null;
  isActive: boolean;
  isPaid: boolean;
  canAccessPaidFeatures: boolean;
  monthlyGenerationLimit: number; // For FREE tier: lifetime limit. For PAID/PREMIUM: monthly limit
  monthlyGenerationsUsed: number; // For FREE tier: lifetime usage. For PAID/PREMIUM: monthly usage
  generationsRemaining: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

/**
 * Get user's subscription status from database
 * For FREE tier: limits are lifetime (never reset)
 * For PAID/PREMIUM tiers: limits are monthly (reset each month)
 */
export async function getUserSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('subscription_tier, subscription_status, monthly_generation_limit, monthly_generations_used, stripe_customer_id, stripe_subscription_id')
    .eq('id', userId)
    .single();

  if (error || !user) {
    console.error('[SubscriptionGuard] Error fetching user subscription:', error);
    // Return free tier defaults on error (lifetime limit of 3)
    return {
      tier: 'FREE',
      status: null,
      isActive: false,
      isPaid: false,
      canAccessPaidFeatures: false,
      monthlyGenerationLimit: 3, // Lifetime limit for free tier
      monthlyGenerationsUsed: 0, // Lifetime usage for free tier
      generationsRemaining: 3,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  // Normalize tier to uppercase for consistent comparison
  const tier = (user.subscription_tier?.toUpperCase() || 'FREE') as 'FREE' | 'PAID' | 'PREMIUM';
  // Normalize status to lowercase for consistent comparison
  const status = user.subscription_status?.toLowerCase();
  const isActive = status === 'active' || status === 'trialing';
  const isPaid = tier === 'PAID' || tier === 'PREMIUM';
  const canAccessPaidFeatures = isPaid && isActive;

  // For FREE tier: this is a lifetime limit and usage
  // For PAID/PREMIUM: this is a monthly limit and usage
  const monthlyGenerationLimit = user.monthly_generation_limit || 3;
  const monthlyGenerationsUsed = user.monthly_generations_used || 0;
  const generationsRemaining = Math.max(0, monthlyGenerationLimit - monthlyGenerationsUsed);

  return {
    tier,
    status,
    isActive,
    isPaid,
    canAccessPaidFeatures,
    monthlyGenerationLimit,
    monthlyGenerationsUsed,
    generationsRemaining,
    stripeCustomerId: user.stripe_customer_id,
    stripeSubscriptionId: user.stripe_subscription_id,
  };
}

/**
 * Check if user has an active paid subscription
 * @throws Error if user does not have active paid subscription
 */
export async function requirePaidSubscription(userId: string): Promise<boolean> {
  const status = await getUserSubscriptionStatus(userId);

  if (!status.canAccessPaidFeatures) {
    throw new Error('SUBSCRIPTION_REQUIRED');
  }

  return true;
}

/**
 * Check if user can access a specific paid feature
 * Returns true/false without throwing
 */
export async function canAccessPaidFeature(userId: string, feature: string): Promise<boolean> {
  const status = await getUserSubscriptionStatus(userId);

  // Map features to required tier
  const featureRequirements: Record<string, 'PAID' | 'PREMIUM'> = {
    'ai-personalization': 'PAID',
    'unlimited-articles': 'PAID',
    'priority-support': 'PREMIUM',
    // Add more features as needed
  };

  const requiredTier = featureRequirements[feature] || 'PAID';

  // Check if user's tier meets requirement
  if (requiredTier === 'PAID') {
    return status.isPaid && status.isActive;
  }

  if (requiredTier === 'PREMIUM') {
    return status.tier === 'PREMIUM' && status.isActive;
  }

  return false;
}

/**
 * Check if user has remaining AI generations this month
 * @throws Error if user has exceeded limit
 */
export async function requireGenerationQuota(userId: string): Promise<boolean> {
  const status = await getUserSubscriptionStatus(userId);

  if (status.generationsRemaining <= 0) {
    throw new Error('GENERATION_LIMIT_EXCEEDED');
  }

  return true;
}

/**
 * Increment user's monthly generation count atomically
 * Returns new count or null if failed or limit exceeded
 */
export async function incrementGenerationCount(userId: string): Promise<number | null> {
  const supabase = await createClient();

  // Use atomic conditional update via RPC function
  // First, try to use a raw SQL query for atomic increment
  const { data, error } = await supabase.rpc('increment_generation_if_available', {
    user_id: userId
  });

  if (error) {
    console.error('[SubscriptionGuard] Error incrementing generation count:', error);

    // Fallback to fetch-then-update if RPC not available
    // This is less safe but better than nothing
    const status = await getUserSubscriptionStatus(userId);

    if (status.generationsRemaining <= 0) {
      console.warn('[SubscriptionGuard] User has no generations remaining:', userId);
      return null;
    }

    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        monthly_generations_used: status.monthlyGenerationsUsed + 1,
      })
      .eq('id', userId)
      .eq('monthly_generations_used', status.monthlyGenerationsUsed) // Optimistic concurrency check
      .select('monthly_generations_used')
      .single();

    if (updateError || !updateData) {
      console.error('[SubscriptionGuard] Failed to increment (concurrent update):', updateError);
      return null;
    }

    return updateData.monthly_generations_used;
  }

  return data?.new_count || null;
}

/**
 * Helper function to determine if a tier should have generation resets
 * FREE tier: NO resets (lifetime limit)
 * PAID/PREMIUM tiers: Monthly resets
 */
export function shouldResetGenerations(tier: 'FREE' | 'PAID' | 'PREMIUM'): boolean {
  return tier === 'PAID' || tier === 'PREMIUM';
}

/**
 * Check if user needs to reset their monthly generation count
 * Should be called before checking quota
 * IMPORTANT: Only resets for PAID/PREMIUM tiers, NEVER for FREE tier
 */
export async function checkAndResetGenerationQuota(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from('users')
    .select('subscription_tier, generation_reset_date, monthly_generations_used')
    .eq('id', userId)
    .single();

  if (!user) return;

  // Normalize tier to uppercase
  const tier = (user.subscription_tier?.toUpperCase() || 'FREE') as 'FREE' | 'PAID' | 'PREMIUM';

  // FREE tier users NEVER reset - they have lifetime limits
  if (!shouldResetGenerations(tier)) {
    return;
  }

  // Only proceed with reset logic for PAID/PREMIUM tiers
  const resetDate = user.generation_reset_date ? new Date(user.generation_reset_date) : null;
  const now = new Date();

  // If reset date is in the past or not set, reset the counter
  if (!resetDate || resetDate < now) {
    // Calculate next reset date (first of next month)
    const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    await supabase
      .from('users')
      .update({
        monthly_generations_used: 0,
        generation_reset_date: nextReset.toISOString(),
      })
      .eq('id', userId);

    console.log('[SubscriptionGuard] Reset generation quota for PAID/PREMIUM user:', userId);
  }
}

/**
 * Get subscription tier name for display
 */
export function getSubscriptionTierName(tier: string): string {
  const tierNames: Record<string, string> = {
    FREE: 'Free',
    PAID: 'Pro',
    PREMIUM: 'Premium',
  };

  return tierNames[tier] || 'Free';
}

/**
 * Get subscription status badge color
 */
export function getSubscriptionStatusColor(status: string | null): string {
  const statusColors: Record<string, string> = {
    active: 'green',
    trialing: 'blue',
    past_due: 'yellow',
    canceled: 'gray',
    unpaid: 'red',
    incomplete: 'orange',
  };

  return statusColors[status || ''] || 'gray';
}
