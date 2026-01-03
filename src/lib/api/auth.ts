import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { kindeManagementService } from '@/lib/services/kinde-management.service';
import { CrossProductAccessError } from '@/lib/errors/cross-product-access.error';
import { obfuscateId } from '@/lib/utils';

// Re-export for backwards compatibility
export { CrossProductAccessError };

/**
 * Configuration for retry logic
 */
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelayMs: 100,
  maxDelayMs: 2000,
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function getBackoffDelay(attempt: number): number {
  const exponentialDelay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * 100; // Add 0-100ms jitter
  return Math.min(exponentialDelay + jitter, RETRY_CONFIG.maxDelayMs);
}

/**
 * Product types supported for access checks
 */
type ProductType = 'truetone' | 'newsletter';

/**
 * Check product access with retry logic and exponential backoff.
 * Returns { hasAccess: boolean, fromFallback: boolean } to indicate
 * if the result came from a successful check or a fail-open fallback.
 */
async function checkProductAccessWithRetry(
  kindeId: string,
  product: ProductType
): Promise<{ hasAccess: boolean; fromFallback: boolean; error?: Error }> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      const hasAccess = await kindeManagementService.checkProductAccess(kindeId, product);
      return { hasAccess, fromFallback: false };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.warn(`[Auth] Product access check attempt ${attempt + 1}/${RETRY_CONFIG.maxAttempts} failed:`, {
        kindeId: obfuscateId(kindeId),
        product,
        error: lastError.message,
        attempt: attempt + 1,
      });

      // Don't retry on the last attempt
      if (attempt < RETRY_CONFIG.maxAttempts - 1) {
        const delay = getBackoffDelay(attempt);
        console.log(`[Auth] Retrying in ${delay.toFixed(0)}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries exhausted - log error with metric-worthy details for alerting
  console.error('[Auth] ALERT: All product access check retries exhausted:', {
    kindeId: obfuscateId(kindeId),
    product,
    attempts: RETRY_CONFIG.maxAttempts,
    lastError: lastError?.message,
    timestamp: new Date().toISOString(),
    severity: 'high',
  });

  // FAIL-OPEN: Grant access when API is unavailable to avoid blocking legitimate users
  // This should be paired with monitoring/alerting on the error logs above
  console.warn('[Auth] FAIL-OPEN: Granting temporary access due to API unavailability', { kindeId: obfuscateId(kindeId) });
  return { hasAccess: true, fromFallback: true, error: lastError };
}

/**
 * Lightweight auth function for onboarding/checkout flows.
 * Only verifies Kinde authentication - does NOT check:
 * - Newsletter product access
 * - Database user existence
 *
 * Use this for flows where users are in the process of signing up.
 */
export async function getKindeUserOnly() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) {
    throw new Error('Unauthorized');
  }

  return {
    kinde_id: kindeUser.id,
    email: kindeUser.email ?? '',
    firstName: kindeUser.given_name ?? '',
    lastName: kindeUser.family_name ?? '',
  };
}

/**
 * Get authenticated user with DB lookup but WITHOUT newsletter access check.
 * Use this for onboarding flows where user may exist in DB but not have access yet.
 */
export async function getApiUserWithoutAccessCheck() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) {
    throw new Error('Unauthorized');
  }

  const supabase = await createClient();
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUser.id)
    .single();

  // User not found - return null instead of throwing (for onboarding)
  if (fetchError && fetchError.code === 'PGRST116') {
    return null;
  }

  if (fetchError) {
    console.error('[Auth] Database error fetching user:', fetchError);
    throw new Error(`Database error: ${fetchError.message}`);
  }

  return user;
}

export async function getApiUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) {
    throw new Error('Unauthorized');
  }

  // ============================================================================
  // MULTI-PRODUCT ACCESS CONTROL
  // Check has_newsletter_access FIRST - before database lookup
  // This ensures users without access are gated even if not in database yet
  //
  // Uses retry with exponential backoff to handle transient API failures.
  // Falls open (grants access) after all retries exhausted to avoid blocking
  // legitimate users during Kinde API outages. This is logged as a high-severity
  // alert for monitoring.
  // ============================================================================
  const accessResult = await checkProductAccessWithRetry(kindeUser.id, 'newsletter');

  if (accessResult.fromFallback) {
    console.log(`[Auth] Newsletter access for ${obfuscateId(kindeUser.id)}: GRANTED (fail-open fallback)`);
  } else {
    console.log(`[Auth] Newsletter access check for ${obfuscateId(kindeUser.id)}: ${accessResult.hasAccess}`);
  }

  if (!accessResult.hasAccess) {
    console.log('[Auth] User does not have Newsletter access, denying');
    throw new CrossProductAccessError(
      'User does not have Newsletter access',
      'newsletter',
      kindeUser.email ?? undefined
    );
  }

  const supabase = await createClient();
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUser.id)
    .single();

  // User not found in database - they need to complete onboarding first
  if (fetchError && fetchError.code === 'PGRST116') {
    console.log('[Auth] User not found in database');
    throw new Error('User not found in database');
  }

  // Handle other database errors
  if (fetchError) {
    console.error('[Auth] Database error fetching user:', fetchError);
    throw new Error(`Database error: ${fetchError.message}`);
  }

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export interface ApiUser {
  id: string;
  kinde_id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  organization_id?: string;
  organization?: {
    id: string;
    name: string;
    bundle_social_team_id?: string;
  };
  role: string;
  status: string;
  has_completed_onboarding: boolean;
  onboarding_step: number;
  // TrueTone fields
  tone_of_voice?: string;
  formality?: string;
  humor?: string;
  emotional_expression?: string;
  detail_orientation?: string;
  vocabulary?: string;
  content_length?: string;
  engagement_style?: string;
  // Voice analysis
  voice_transcript?: string;
  user_persona?: string;
  personality_traits?: any;
  communication_style?: any;
  speech_patterns?: any;
  professional_indicators?: any;
  content_generation_preferences?: any;
  unique_voice_markers?: any;
  analysis_metadata?: any;
  // User preferences
  category_preferences?: string[];
  saved_article_ids?: string[];
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
}