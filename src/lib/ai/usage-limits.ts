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
 * Check AI generation limits for a user or anonymous session
 *
 * Limits:
 * - Anonymous: 3 total (tracked by session)
 * - Free tier: 3 per month
 * - Paid tier: Based on monthlyGenerationLimit field
 */
export async function checkAIGenerationLimit(params: {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
}): Promise<AIUsageCheckResult> {
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
      // Log the actual error for debugging
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

    // Try to find existing anonymous session
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
    const limit = 3; // Anonymous users get 3 generations
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

  // No identifier provided
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
 * Increment AI generation usage counter atomically
 * @returns true on success, false on failure
 */
export async function incrementAIUsage(params: {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
}): Promise<boolean> {
  const { userId, sessionId, ipAddress } = params;

  const supabase = await createClient();

  try {
    // Authenticated user - use atomic increment
    if (userId) {
      // Try RPC for atomic increment first
      const { error: rpcError } = await supabase.rpc('increment_user_generations', {
        user_id: userId
      });

      if (rpcError) {
        console.warn('[AIUsageLimit] RPC not available, using fallback');

        // Fallback: use PostgreSQL's built-in increment
        const { error } = await supabase
          .from('users')
          .update({
            monthly_generations_used: supabase.raw('monthly_generations_used + 1')
          } as any)
          .eq('id', userId);

        if (error) {
          console.error('[AIUsageLimit] Failed to increment user usage:', error);
          return false;
        }
      }

      return true;
    }

    // Anonymous session - use upsert for atomic operation
    if (sessionId || ipAddress) {
      const now = new Date().toISOString();

      // Use INSERT ... ON CONFLICT for atomic upsert
      const { error } = await supabase
        .from('anonymous_ai_usage')
        .upsert({
          session_id: sessionId || '',
          ip_address: ipAddress || null,
          generations_used: 1,
          created_at: now,
          last_used_at: now
        }, {
          onConflict: sessionId ? 'session_id' : 'ip_address',
          // Update the generations_used by incrementing
        });

      if (error) {
        console.error('[AIUsageLimit] Failed to upsert anonymous usage:', error);

        // Fallback: manual increment
        let query = supabase.from('anonymous_ai_usage').select('*');

        if (sessionId) {
          query = query.eq('session_id', sessionId);
        } else if (ipAddress) {
          query = query.eq('ip_address', ipAddress);
        }

        const { data: sessions } = await query.limit(1);
        const session = sessions?.[0];

        if (session) {
          const { error: updateError } = await supabase
            .from('anonymous_ai_usage')
            .update({
              generations_used: session.generations_used + 1,
              last_used_at: now
            })
            .eq('id', session.id);

          if (updateError) {
            console.error('[AIUsageLimit] Failed to update session:', updateError);
            return false;
          }
        } else {
          const { error: insertError } = await supabase
            .from('anonymous_ai_usage')
            .insert({
              session_id: sessionId || '',
              ip_address: ipAddress || null,
              generations_used: 1,
              created_at: now,
              last_used_at: now
            });

          if (insertError) {
            console.error('[AIUsageLimit] Failed to create session:', insertError);
            return false;
          }
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
