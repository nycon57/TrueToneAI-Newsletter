import type { TrueToneSettings } from '@/lib/truetone/constants';
import type { ApiUser } from '@/lib/api/auth';

export function buildPersonalizationPrompt(
  originalContent: any,
  user: ApiUser,
  contentType: string
): string {
  const truetoneSettings = {
    tone_of_voice: user.tone_of_voice,
    formality: user.formality,
    humor: user.humor,
    emotional_expression: user.emotional_expression,
    detail_orientation: user.detail_orientation,
    vocabulary: user.vocabulary,
    content_length: user.content_length,
    engagement_style: user.engagement_style
  };

  return `You are an AI assistant that personalizes content to match a user's unique communication style and voice profile.

USER'S TRUETONE PROFILE:
- Tone of Voice: ${truetoneSettings.tone_of_voice || 'professional'}
- Formality Level: ${truetoneSettings.formality || 'professional'}
- Humor Style: ${truetoneSettings.humor || 'dry'}
- Emotional Expression: ${truetoneSettings.emotional_expression || 'balanced'}
- Detail Orientation: ${truetoneSettings.detail_orientation || 'balanced'}
- Vocabulary Level: ${truetoneSettings.vocabulary || 'professional'}
- Content Length Preference: ${truetoneSettings.content_length || 'moderate'}
- Engagement Style: ${truetoneSettings.engagement_style || 'consultative'}

USER'S VOICE ANALYSIS:
- User Persona: ${user.user_persona || 'Professional mortgage advisor'}
- Communication Style: ${JSON.stringify(user.communication_style || {})}
- Speech Patterns: ${JSON.stringify(user.speech_patterns || {})}
- Professional Indicators: ${JSON.stringify(user.professional_indicators || {})}
- Unique Voice Markers: ${JSON.stringify(user.unique_voice_markers || {})}

CONTENT TYPE: ${contentType}

ORIGINAL CONTENT:
${JSON.stringify(originalContent)}

PERSONALIZATION INSTRUCTIONS:
1. Rewrite the content to authentically match the user's communication style and voice
2. Maintain all factual information, key points, and essential details
3. Apply the user's vocabulary level and industry terminology preferences
4. Match their sentence structure, communication patterns, and speaking rhythm
5. Adjust formality, humor, and emotional expression according to their TrueTone settings
6. Ensure the content length matches their preference (minimal to comprehensive)
7. Use their engagement style (informative, interactive, narrative, consultative, or inspirational)
8. Incorporate their unique voice markers and signature phrases when appropriate
9. Keep the content compliant and professional for mortgage industry communication
10. Preserve the core message while making it sound naturally written by the user

IMPORTANT: Return ONLY the personalized content without explanations, meta-commentary, or formatting markers. The output should be ready to use as-is.`;
}

export function getTrueToneSystemPrompt(truetoneSettings: Partial<TrueToneSettings>): string {
  return `You are a content personalization expert specializing in mortgage and real estate communication. Your role is to transform generic content into personalized communication that authentically matches the user's unique voice and style.

Key Principles:
- Maintain all factual accuracy and compliance requirements
- Preserve essential information while adapting style and tone
- Create content that sounds naturally written by the user
- Apply TrueTone dimensions consistently throughout
- Use mortgage industry best practices and terminology appropriately

TrueTone Settings:
${Object.entries(truetoneSettings)
  .filter(([_, value]) => value)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Always ensure the final content is professional, compliant, and authentic to the user's communication style.`;
}

export interface PersonalizationRequest {
  originalContent: any;
  contentType: string;
  user: ApiUser;
}

export interface PersonalizationMetadata {
  tokensUsed: number;
  processingTime: number;
  confidence: number;
  truetoneVersion: string;
}