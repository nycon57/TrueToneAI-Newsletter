import { cache } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';

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
  const { data: user } = await supabase
    .from('users')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('kinde_id', kindeUser.id)
    .single();

  if (!user) {
    // Create user on first login (this should rarely happen in production)
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        kinde_id: kindeUser.id,
        email: kindeUser.email,
        firstName: kindeUser.given_name || 'Not Set',
        lastName: kindeUser.family_name || 'Not Set',
        name: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim() || 'Not Set',
        status: 'pending'
      })
      .select(`
        *,
        organization:organizations(*)
      `)
      .single();

    return newUser;
  }

  return user;
});

/**
 * Non-throwing version of getCachedApiUser
 * Returns null if user is not authenticated instead of throwing
 */
export const getCachedApiUserSafe = cache(async () => {
  try {
    return await getCachedApiUser();
  } catch (error) {
    // Log the error with context for debugging
    console.error('[AuthCache] Error fetching cached user:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
});

// Re-export the interface for convenience
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