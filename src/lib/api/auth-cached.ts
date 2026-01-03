import { cache } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { kindeManagementService } from '@/lib/services/kinde-management.service';
import { CrossProductAccessError } from '@/lib/errors/cross-product-access.error';
import { obfuscateId } from '@/lib/utils';

// Re-export for backwards compatibility
export { CrossProductAccessError };

/**
 * Custom error for transient API failures during access checks.
 * This allows callers to distinguish between "no access" (definitive) and
 * "couldn't check access" (transient failure).
 */
export class AccessCheckFailedError extends Error {
  constructor(
    message: string,
    public readonly kindeId: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AccessCheckFailedError';
  }
}

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

  // ============================================================================
  // MULTI-PRODUCT ACCESS CONTROL
  // Check has_newsletter_access FIRST - before database lookup
  // This ensures users without access are gated even if not in database yet
  // IMPORTANT: API failures are treated differently from "no access" responses
  // to avoid incorrectly blocking users during transient outages
  // ============================================================================
  let hasNewsletterAccess: boolean;
  try {
    hasNewsletterAccess = await kindeManagementService.checkProductAccess(
      kindeUser.id,
      'newsletter'
    );
    console.log(`[AuthCache] Newsletter access check for ${obfuscateId(kindeUser.id)}: ${hasNewsletterAccess}`);
  } catch (error) {
    // Log with full context for debugging
    console.error('[AuthCache] Newsletter access check failed - API error:', {
      kindeId: obfuscateId(kindeUser.id),
      email: kindeUser.email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // IMPORTANT: Do NOT default to false on API failure - this would incorrectly
    // block legitimate users during Kinde API outages. Instead, throw a specific
    // error so callers can handle transient failures appropriately (retry, fallback, etc.)
    throw new AccessCheckFailedError(
      'Failed to verify newsletter access due to API error',
      kindeUser.id,
      error
    );
  }

  if (!hasNewsletterAccess) {
    console.log('[AuthCache] User does not have Newsletter access, denying');
    throw new CrossProductAccessError(
      'User does not have Newsletter access',
      'newsletter',
      kindeUser.email ?? undefined
    );
  }

  const supabase = await createClient();

  // Check if user exists
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUser.id)
    .single();

  // User not found in database - they need to complete onboarding first
  if (fetchError && fetchError.code === 'PGRST116') {
    console.log('[AuthCache] User not found in database, returning null');
    return null;
  }

  // Handle other database errors
  if (fetchError) {
    console.error('[AuthCache] Database error fetching user:', fetchError);
    return null;
  }

  return user;
});

/**
 * Non-throwing version of getCachedApiUser
 * Returns null if user is not authenticated instead of throwing
 * Note: CrossProductAccessError and AccessCheckFailedError are re-thrown for proper handling
 */
export const getCachedApiUserSafe = cache(async () => {
  try {
    return await getCachedApiUser();
  } catch (error) {
    // Re-throw CrossProductAccessError for proper handling (definitive "no access")
    if (error instanceof CrossProductAccessError) {
      throw error;
    }
    // Re-throw AccessCheckFailedError for proper handling (transient API failure)
    // This allows callers to implement retry logic or fail-open strategies
    if (error instanceof AccessCheckFailedError) {
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