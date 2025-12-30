import { cache } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { kindeManagementService } from '@/lib/services/kinde-management.service';
import { CrossProductAccessError } from '@/lib/errors/cross-product-access.error';

// Re-export for backwards compatibility
export { CrossProductAccessError };

/**
 * Cached version of getApiUser that caches the user lookup per request.
 * This prevents multiple database queries for the same user within a single request.
 *
 * The React cache() function deduplicates function calls with the same arguments
 * during a single React render pass on the server.
 */
export const getCachedApiUser = cache(async () => {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) {
    return null;
  }

  const supabase = await createClient();

  // Check if user exists
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUser.id)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
    // ============================================================================
    // MULTI-PRODUCT ACCESS CONTROL
    // Before creating a new user, check if this is a cross-product user
    // ============================================================================
    let hasNewsletterAccess = false;
    try {
      hasNewsletterAccess = await kindeManagementService.checkProductAccess(
        kindeUser.id,
        'newsletter'
      );
      console.log(`[AuthCache] Newsletter access check for ${kindeUser.id}: ${hasNewsletterAccess}`);
    } catch (error) {
      console.warn('[AuthCache] Could not check Newsletter access, continuing:', error);
    }

    // If user exists in Kinde but not in our database, and doesn't have Newsletter access,
    // they might be a TrueTone user trying to access Newsletter
    if (!hasNewsletterAccess) {
      try {
        const kindeUserDetails = await kindeManagementService.getUser(kindeUser.id);
        if (kindeUserDetails && kindeUserDetails.created_on) {
          // User exists in Kinde but not in Newsletter database - cross-product user
          console.log('[AuthCache] Cross-product user detected (TrueTone → Newsletter)');
          throw new CrossProductAccessError(
            'User does not have Newsletter access',
            'truetone',
            kindeUser.email ?? undefined
          );
        }
      } catch (error) {
        if (error instanceof CrossProductAccessError) {
          throw error;
        }
        console.warn('[AuthCache] Could not verify Kinde user details, proceeding with creation:', error);
      }
    }

    // User doesn't exist, create them on first login
    const now = new Date().toISOString();
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        kinde_id: kindeUser.id,
        email: kindeUser.email,
        firstName: kindeUser.given_name || 'Not Set',
        lastName: kindeUser.family_name || 'Not Set',
        name: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim() || 'Not Set',
        subscription_tier: 'free',
        monthly_generation_limit: 3, // Lifetime limit for free tier
        monthly_generations_used: 0,
        generation_reset_date: null, // NULL for free tier (lifetime limit, no reset)
        createdAt: now,
        updatedAt: now,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('[AuthCache] Failed to create new user:', {
        kindeId: kindeUser.id,
        email: kindeUser.email,
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      });

      throw new Error(`Failed to create user: ${insertError.message}`);
    }

    if (!newUser) {
      console.error('[AuthCache] User creation returned null despite no error:', {
        kindeId: kindeUser.id,
        email: kindeUser.email
      });

      throw new Error('User creation failed: returned null');
    }

    // Grant Newsletter access to the new user since they're signing up through Newsletter
    try {
      await kindeManagementService.grantProductAccess(kindeUser.id, 'newsletter');
      console.log('[AuthCache] Granted Newsletter access to new user:', kindeUser.id);
    } catch (error) {
      console.error('[AuthCache] Failed to grant Newsletter access (non-blocking):', error);
    }

    return newUser;
  }

  return user;
});

/**
 * Non-throwing version of getCachedApiUser
 * Returns null if user is not authenticated instead of throwing
 * Note: CrossProductAccessError is re-thrown for proper handling
 */
export const getCachedApiUserSafe = cache(async () => {
  try {
    return await getCachedApiUser();
  } catch (error) {
    // Re-throw CrossProductAccessError for proper handling
    if (error instanceof CrossProductAccessError) {
      throw error;
    }
    // Log the error with context for debugging
    console.error('[AuthCache] Error fetching cached user:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
});

// Re-export the interface for convenience (matched to actual Supabase schema)
export interface ApiUser {
  id: string;
  kinde_id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: string;
  avatar?: string;
  // User preferences
  category_preferences?: string[];
  tag_preferences?: string[];
  saved_article_ids?: string[];
  // TrueTone characteristics
  toneOfVoice?: string;
  humor?: string;
  detailOrientation?: string;
  contentLength?: string;
  formality?: string;
  emotionalExpression?: string;
  vocabulary?: string;
  engagementStyle?: string;
  // Subscription fields
  subscription_tier?: string;
  subscription_expires_at?: string;
  subscription_status?: string;
  monthly_generation_limit?: number;
  monthly_generations_used?: number;
  generation_reset_date?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}