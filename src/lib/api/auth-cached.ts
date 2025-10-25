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
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('kinde_id', kindeUser.id)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
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