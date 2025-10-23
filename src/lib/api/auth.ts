import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';

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
    // Create user on first login
    console.log('[Auth] Creating new user for kinde_id:', kindeUser.id);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        kinde_id: kindeUser.id,
        email: kindeUser.email,
        firstName: kindeUser.given_name || 'Not Set',
        lastName: kindeUser.family_name || 'Not Set',
        name: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim() || 'Not Set',
        subscription_tier: 'FREE',
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