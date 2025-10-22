import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface AIUsageCheckResult {
  allowed: boolean;
  remaining: number;
  tier: 'free' | 'paid' | 'anonymous';
  message?: string;
  limit: number;
  used: number;
}

/**
 * Atomically check and increment AI generation limit for a user or anonymous session
 * This replaces the old two-step pattern (checkAIGenerationLimit + incrementAIUsage)
 * with a single atomic database operation to prevent race conditions.
 *
 * Limits:
 * - Anonymous: 3 total (tracked by session)
 * - Free tier: 3 per month
 * - Paid tier: Based on monthlyGenerationLimit field
 */
export async function checkAndIncrementAIUsage(params: {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
}): Promise<AIUsageCheckResult> {
  const { userId, sessionId, ipAddress } = params;

  const supabase = await createClient();

  try {
    // Authenticated user - use atomic RPC function
    if (userId) {
      const { data, error } = await supabase.rpc('check_and_increment_user_generations', {
        user_id: userId
      });

      if (error) {
        console.error('[AIUsageLimit] Database error in atomic check+increment:', {
          userId,
          error: error.message,
          details: error.details
        });

        return {
          allowed: false,
          remaining: 0,
          tier: 'free',
          message: 'Database error checking usage limits',
          limit: 0,
          used: 0
        };
      }

      return data as AIUsageCheckResult;
    }

    // Anonymous session - use atomic RPC function
    if (sessionId) {
      const { data, error } = await supabase.rpc('check_and_increment_anonymous_generations', {
        p_session_id: sessionId,
        p_ip_address: ipAddress || null
      });

      if (error) {
        console.error('[AIUsageLimit] Database error in atomic anonymous check+increment:', {
          sessionId,
          ipAddress,
          error: error.message,
          details: error.details
        });

        return {
          allowed: false,
          remaining: 0,
          tier: 'anonymous',
          message: 'Database error checking usage limits',
          limit: 0,
          used: 0
        };
      }

      return data as AIUsageCheckResult;
    }

    // No identifier provided
    return {
      allowed: false,
      remaining: 0,
      tier: 'anonymous',
      message: 'Unable to track usage. Please enable cookies or sign in.',
      limit: 0,
      used: 0
    };
  } catch (error) {
    console.error('[AIUsageLimit] Unexpected error in atomic check+increment:', error);
    return {
      allowed: false,
      remaining: 0,
      tier: 'anonymous',
      message: 'Unexpected error checking usage limits',
      limit: 0,
      used: 0
    };
  }
}

/**
 * DEPRECATED: Use checkAndIncrementAIUsage instead
 *
 * This function is kept for backwards compatibility but should not be used
 * in new code. It performs a non-atomic check which can lead to race conditions.
 */
export async function checkAIGenerationLimit(params: {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
}): Promise<AIUsageCheckResult> {
  console.warn('[AIUsageLimit] checkAIGenerationLimit is deprecated. Use checkAndIncrementAIUsage instead.');

  const { userId, sessionId, ipAddress } = params;

  // Authenticated user check
  if (userId) {
    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_tier, monthly_generation_limit, monthly_generations_used')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[AIUsageLimit] Database error checking user limit:', {
        userId,
        error: error.message,
        details: error.details
      });

      return {
        allowed: false,
        remaining: 0,
        tier: 'free',
        message: 'Database error checking usage limits',
        limit: 0,
        used: 0
      };
    }

    if (!user) {
      return {
        allowed: false,
        remaining: 0,
        tier: 'free',
        message: 'User not found',
        limit: 0,
        used: 0
      };
    }

    const tier = user.subscription_tier === 'free' ? 'free' : 'paid';
    const limit = user.monthly_generation_limit || 0;
    const used = user.monthly_generations_used || 0;
    const remaining = Math.max(0, limit - used);

    if (used >= limit) {
      return {
        allowed: false,
        remaining: 0,
        tier,
        message: tier === 'free'
          ? 'Free tier limit reached. Upgrade to continue personalizing content.'
          : 'Monthly generation limit reached. Your limit will reset next month.',
        limit,
        used
      };
    }

    return {
      allowed: true,
      remaining,
      tier,
      limit,
      used
    };
  }

  // Anonymous session check
  if (sessionId || ipAddress) {
    const supabase = await createClient();

    let query = supabase
      .from('anonymous_ai_usage')
      .select('*');

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else if (ipAddress) {
      query = query.eq('ip_address', ipAddress);
    }

    const { data: sessions } = await query.order('created_at', { ascending: false }).limit(1);

    const session = sessions?.[0];
    const limit = 3;
    const used = session?.generations_used || 0;
    const remaining = Math.max(0, limit - used);

    if (used >= limit) {
      return {
        allowed: false,
        remaining: 0,
        tier: 'anonymous',
        message: 'Free trial limit reached. Sign up to continue personalizing content.',
        limit,
        used
      };
    }

    return {
      allowed: true,
      remaining,
      tier: 'anonymous',
      limit,
      used
    };
  }

  return {
    allowed: false,
    remaining: 0,
    tier: 'anonymous',
    message: 'Unable to track usage. Please enable cookies or sign in.',
    limit: 0,
    used: 0
  };
}

/**
 * DEPRECATED: Use checkAndIncrementAIUsage instead
 *
 * This function is kept for backwards compatibility but should not be used
 * in new code. The separate increment step can cause race conditions.
 */
export async function incrementAIUsage(params: {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
}): Promise<boolean> {
  console.warn('[AIUsageLimit] incrementAIUsage is deprecated. Use checkAndIncrementAIUsage instead.');

  const { userId, sessionId, ipAddress } = params;

  const supabase = await createClient();

  try {
    if (userId) {
      const { error } = await supabase.rpc('increment_user_generations', {
        user_id: userId
      });

      if (error) {
        console.error('[AIUsageLimit] Failed to increment user usage:', error);
        return false;
      }

      return true;
    }

    if (sessionId) {
      const now = new Date().toISOString();

      const { data: sessions } = await supabase
        .from('anonymous_ai_usage')
        .select('*')
        .eq('session_id', sessionId)
        .limit(1);

      const session = sessions?.[0];

      if (session) {
        const { error } = await supabase
          .from('anonymous_ai_usage')
          .update({
            generations_used: session.generations_used + 1,
            last_used_at: now
          })
          .eq('id', session.id);

        if (error) {
          console.error('[AIUsageLimit] Failed to update session:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('anonymous_ai_usage')
          .insert({
            session_id: sessionId,
            ip_address: ipAddress || null,
            generations_used: 1,
            created_at: now,
            last_used_at: now
          });

        if (error) {
          console.error('[AIUsageLimit] Failed to create session:', error);
          return false;
        }
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('[AIUsageLimit] Unexpected error incrementing usage:', error);
    return false;
  }
}

/**
 * Get or create anonymous session ID from cookies
 */
export async function getAnonymousSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('anonymous_session')?.value;

  if (!sessionId) {
    // Generate new session ID
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Persist the new session ID to cookies
    await setAnonymousSessionCookie(sessionId);
  }

  return sessionId;
}

/**
 * Set anonymous session cookie
 */
export async function setAnonymousSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set('anonymous_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
}
