import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function getApiUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) {
    throw new Error('Unauthorized');
  }

  const supabase = createClient();
  const { data: user } = await supabase
    .from('users')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('kinde_id', kindeUser.id)
    .single();

  if (!user) {
    // Create user on first login
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
}