import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { analyzeVoiceTranscript } from '@/lib/voice/analyzer';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/utils/rateLimit';

export async function POST(req: NextRequest) {
  // Apply rate limiting - voice analysis is expensive, so very restrictive
  const clientId = getClientIdentifier(req, 'ai-voice-analyze');
  if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.AI_VOICE_ANALYZE)) {
    const headers = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.AI_VOICE_ANALYZE);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    );
  }

  try {
    const user = await getApiUser();

    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Valid transcript is required' },
        { status: 400 }
      );
    }

    // Analyze the voice transcript
    const analysis = await analyzeVoiceTranscript(transcript);

    // Update user with TrueTone profile
    const supabase = createClient();

    const { error } = await supabase
      .from('users')
      .update({
        voice_transcript: transcript,
        user_persona: analysis.persona,
        personality_traits: analysis.personality_traits,
        communication_style: analysis.communication_style,
        speech_patterns: analysis.speech_patterns,
        professional_indicators: analysis.professional_indicators,
        content_generation_preferences: analysis.content_generation_preferences,
        unique_voice_markers: analysis.unique_voice_markers,
        analysis_metadata: analysis.analysis_metadata,

        // TrueTone settings
        tone_of_voice: analysis.truetone_settings.tone_of_voice,
        formality: analysis.truetone_settings.formality,
        humor: analysis.truetone_settings.humor,
        emotional_expression: analysis.truetone_settings.emotional_expression,
        detail_orientation: analysis.truetone_settings.detail_orientation,
        vocabulary: analysis.truetone_settings.vocabulary,
        content_length: analysis.truetone_settings.content_length,
        engagement_style: analysis.truetone_settings.engagement_style,

        // Mark onboarding as complete
        has_completed_onboarding: true,
        onboarding_completed_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Failed to save voice analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: {
        persona: analysis.persona,
        truetone_settings: analysis.truetone_settings,
        key_insights: analysis.analysis_metadata.key_insights,
        confidence_score: analysis.analysis_metadata.confidence_score
      }
    });

  } catch (error) {
    console.error('Voice analysis API error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}