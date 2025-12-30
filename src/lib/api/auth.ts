import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { kindeManagementService } from '@/lib/services/kinde-management.service';

/**
 * Custom error class for cross-product access issues
 * This is thrown when a user from another product (e.g., TrueTone) tries to access Newsletter
 * without proper Newsletter access
 */
export class CrossProductAccessError extends Error {
  constructor(
    message: string,
    public readonly sourceProduct: string,
    public readonly email?: string
  ) {
    super(message);
    this.name = 'CrossProductAccessError';
  }
}

export async function getApiUser() {
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

  if (fetchError) {
    console.error('[Auth] Error fetching user:', fetchError);
    // If user doesn't exist, we'll create them below
  }

  if (!user || fetchError) {
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
      console.log(`[Auth] Newsletter access check for ${kindeUser.id}: ${hasNewsletterAccess}`);
    } catch (error) {
      console.warn('[Auth] Could not check Newsletter access, continuing:', error);
    }

    // If user exists in Kinde but not in our database, and doesn't have Newsletter access,
    // they might be a TrueTone user trying to access Newsletter
    if (!hasNewsletterAccess) {
      try {
        const kindeUserDetails = await kindeManagementService.getUser(kindeUser.id);
        if (kindeUserDetails && kindeUserDetails.created_on) {
          // User exists in Kinde but not in Newsletter database - cross-product user
          console.log('[Auth] Cross-product user detected (TrueTone → Newsletter)');
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
        console.warn('[Auth] Could not verify Kinde user details, proceeding with creation:', error);
      }
    }

    // Create user on first login
    console.log('[Auth] Creating new user for kinde_id:', kindeUser.id);
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
        createdAt: now,
        updatedAt: now,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('[Auth] Error creating user:', insertError);
      throw new Error(`Failed to create user: ${insertError.message}`);
    }

    if (!newUser) {
      throw new Error('Failed to create user: No data returned');
    }

    // Grant Newsletter access to the new user since they're signing up through Newsletter
    try {
      await kindeManagementService.grantProductAccess(kindeUser.id, 'newsletter');
      console.log('[Auth] Granted Newsletter access to new user:', kindeUser.id);
    } catch (error) {
      console.error('[Auth] Failed to grant Newsletter access (non-blocking):', error);
    }

    return newUser;
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