import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileData, transcript, analysisResults, categoryPreferences } = await request.json();

    const supabase = await createClient();

    // Update user with onboarding data
    const { data: user, error } = await supabase
      .from('users')
      .update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        company: profileData.company,
        title: profileData.title,
        cell_phone: profileData.phone,
        voice_transcript: transcript,
        user_persona: analysisResults?.persona,
        personality_traits: analysisResults?.personality_traits,
        communication_style: analysisResults?.communication_style,
        speech_patterns: analysisResults?.speech_patterns,
        professional_indicators: analysisResults?.professional_indicators,
        content_generation_preferences: analysisResults?.content_generation_preferences,
        unique_voice_markers: analysisResults?.unique_voice_markers,
        analysis_metadata: analysisResults?.analysis_metadata,
        category_preferences: categoryPreferences,
        has_completed_onboarding: true,
        onboarding_step: 6,
        onboarding_completed_at: new Date().toISOString(),
        // Set TrueTone settings from analysis
        tone_of_voice: analysisResults?.truetone_settings?.tone_of_voice,
        formality: analysisResults?.truetone_settings?.formality,
        humor: analysisResults?.truetone_settings?.humor,
        emotional_expression: analysisResults?.truetone_settings?.emotional_expression,
        detail_orientation: analysisResults?.truetone_settings?.detail_orientation,
        vocabulary: analysisResults?.truetone_settings?.vocabulary,
        content_length: analysisResults?.truetone_settings?.content_length,
        engagement_style: analysisResults?.truetone_settings?.engagement_style,
      })
      .eq('kinde_id', kindeUser.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user onboarding:', error);
      return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      user
    });

  } catch (error) {
    console.error('Error in onboarding API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}