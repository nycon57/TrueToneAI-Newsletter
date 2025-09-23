import OpenAI from 'openai';
import type { VoiceAnalysis, TrueToneSettings } from '@/lib/truetone/constants';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeVoiceTranscript(transcript: string): Promise<VoiceAnalysis> {
  const systemPrompt = `You are an expert voice analyst specializing in communication styles and personality assessment for mortgage professionals. Your task is to analyze a voice transcript and extract detailed insights about the speaker's communication patterns, personality, and professional indicators.

Based on the transcript, provide a comprehensive analysis and map it to the TrueTone settings dimensions:

TrueTone Dimensions to Analyze:
1. detail_orientation: essential, overview, balanced, comprehensive, exhaustive
2. vocabulary: elementary, accessible, professional, sophisticated, specialized
3. content_length: minimal, brief, moderate, thorough, comprehensive
4. engagement_style: informative, interactive, narrative, consultative, inspirational
5. tone_of_voice: professional, friendly, authoritative, conversational, empathetic
6. formality: ceremonial, professional, balanced, relaxed, intimate
7. humor: dry, witty, playful, satirical, absurdist
8. emotional_expression: stoic, reserved, balanced, expressive, passionate

Return a JSON object with the following structure:
{
  "persona": "Brief description of the user's professional persona",
  "personality_traits": {
    "confidence_level": "high/medium/low",
    "communication_style": "direct/collaborative/consultative",
    "energy_level": "high/medium/low",
    "relationship_focus": "high/medium/low"
  },
  "communication_style": {
    "sentence_structure": "simple/complex/varied",
    "communication_pace": "fast/moderate/slow",
    "question_usage": "frequent/moderate/rare",
    "storytelling_tendency": "high/medium/low"
  },
  "speech_patterns": {
    "filler_words": ["um", "uh", "you know"],
    "common_phrases": ["absolutely", "for sure", "great question"],
    "transition_words": ["however", "additionally", "furthermore"],
    "emphasis_patterns": "description of how they emphasize points"
  },
  "professional_indicators": {
    "industry_expertise_level": "novice/intermediate/expert",
    "client_relationship_style": "transactional/relational/consultative",
    "technical_comfort": "high/medium/low",
    "market_knowledge_depth": "basic/intermediate/advanced"
  },
  "content_generation_preferences": {
    "preferred_content_types": ["email", "social", "scripts"],
    "audience_focus": "first_time_buyers/investors/luxury_clients/general",
    "marketing_approach": "educational/promotional/relationship_building",
    "compliance_awareness": "high/medium/low"
  },
  "unique_voice_markers": {
    "signature_phrases": ["phrase1", "phrase2"],
    "value_propositions": ["unique_selling_point1", "unique_selling_point2"],
    "client_approach": "description of their unique approach",
    "industry_positioning": "how they position themselves"
  },
  "truetone_settings": {
    "detail_orientation": "one of: essential, overview, balanced, comprehensive, exhaustive",
    "vocabulary": "one of: elementary, accessible, professional, sophisticated, specialized",
    "content_length": "one of: minimal, brief, moderate, thorough, comprehensive",
    "engagement_style": "one of: informative, interactive, narrative, consultative, inspirational",
    "tone_of_voice": "one of: professional, friendly, authoritative, conversational, empathetic",
    "formality": "one of: ceremonial, professional, balanced, relaxed, intimate",
    "humor": "one of: dry, witty, playful, satirical, absurdist",
    "emotional_expression": "one of: stoic, reserved, balanced, expressive, passionate"
  },
  "analysis_metadata": {
    "confidence_score": 0.85,
    "analysis_version": "1.0",
    "key_insights": ["insight1", "insight2", "insight3"],
    "recommendations": ["rec1", "rec2", "rec3"]
  }
}

Ensure all responses are valid JSON and all TrueTone settings use exactly the specified values.`;

  const userPrompt = `Please analyze this voice transcript from a mortgage professional and provide the detailed analysis:

TRANSCRIPT:
${transcript}

Focus on understanding their communication style, personality, professional approach, and map these to the TrueTone dimensions. Pay attention to their vocabulary choices, sentence structure, emotional expression, and how they explain complex concepts.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const analysis = JSON.parse(content) as VoiceAnalysis;

    // Validate the analysis has required fields
    if (!analysis.truetone_settings || !analysis.persona) {
      throw new Error('Invalid analysis format');
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing voice transcript:', error);

    // Return a fallback analysis
    return {
      persona: "Professional mortgage advisor with balanced communication style",
      personality_traits: {
        confidence_level: "medium",
        communication_style: "consultative",
        energy_level: "medium",
        relationship_focus: "high"
      },
      communication_style: {
        sentence_structure: "varied",
        communication_pace: "moderate",
        question_usage: "moderate",
        storytelling_tendency: "medium"
      },
      speech_patterns: {
        filler_words: [],
        common_phrases: [],
        transition_words: [],
        emphasis_patterns: "Moderate emphasis on key points"
      },
      professional_indicators: {
        industry_expertise_level: "intermediate",
        client_relationship_style: "consultative",
        technical_comfort: "medium",
        market_knowledge_depth: "intermediate"
      },
      content_generation_preferences: {
        preferred_content_types: ["email", "social"],
        audience_focus: "general",
        marketing_approach: "relationship_building",
        compliance_awareness: "high"
      },
      unique_voice_markers: {
        signature_phrases: [],
        value_propositions: [],
        client_approach: "Relationship-focused approach",
        industry_positioning: "Trusted advisor"
      },
      truetone_settings: {
        detail_orientation: "balanced",
        vocabulary: "professional",
        content_length: "moderate",
        engagement_style: "consultative",
        tone_of_voice: "professional",
        formality: "professional",
        humor: "dry",
        emotional_expression: "balanced"
      },
      analysis_metadata: {
        confidence_score: 0.5,
        analysis_version: "1.0",
        key_insights: ["Analysis failed, using default settings"],
        recommendations: ["Please retry voice onboarding for better analysis"]
      }
    };
  }
}