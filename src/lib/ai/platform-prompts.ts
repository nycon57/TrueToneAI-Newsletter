/**
 * Platform-Specific Prompt Engineering
 *
 * Generates AI prompts tailored to each social media platform's unique requirements
 */

import type { SocialPlatform } from '@/types/social-media';
import { PLATFORM_LIMITS, PLATFORM_STYLES } from '@/types/social-generation';

interface PromptContext {
  article: {
    title: string;
    summary?: string;
    article_topic?: string;
    category?: string;
    content?: string;
  };
  userProfile?: {
    user_persona?: string;
    tone_of_voice?: string;
    formality?: string;
    humor?: string;
    emotional_expression?: string;
    vocabulary?: string;
    engagement_style?: string;
    speech_patterns?: {
      common_phrases?: string[];
      sentence_structure?: string;
    };
    professional_indicators?: Record<string, unknown>;
  };
  platform: SocialPlatform;
  customInstructions?: string;
}

/**
 * Build TrueTone profile context for personalization
 */
function buildTrueToneContext(userProfile?: PromptContext['userProfile']): string {
  if (!userProfile) {
    return `
VOICE PROFILE:
- Tone: Professional
- Formality: Semi-formal
- Style: Informative and client-focused
`;
  }

  return `
TRUETONE VOICE PROFILE:
- Persona: ${userProfile.user_persona || 'Professional loan officer'}
- Tone of Voice: ${userProfile.tone_of_voice || 'professional'}
- Formality Level: ${userProfile.formality || 'semi-formal'}
- Humor Style: ${userProfile.humor || 'minimal'}
- Emotional Expression: ${userProfile.emotional_expression || 'moderate'}
- Vocabulary Level: ${userProfile.vocabulary || 'professional'}
- Engagement Style: ${userProfile.engagement_style || 'informative'}

SPEECH PATTERNS:
${userProfile.speech_patterns?.common_phrases ?
  `- Common phrases: ${userProfile.speech_patterns.common_phrases.join(', ')}` :
  '- Standard professional communication'}
${userProfile.speech_patterns?.sentence_structure ?
  `- Sentence structure: ${userProfile.speech_patterns.sentence_structure}` : ''}

PROFESSIONAL MARKERS:
${userProfile.professional_indicators ?
  JSON.stringify(userProfile.professional_indicators, null, 2) :
  'Mortgage and real estate industry terminology'}
`;
}

/**
 * Build article context
 */
function buildArticleContext(article: PromptContext['article']): string {
  return `
ARTICLE CONTEXT:
Title: ${article.title}
${article.summary ? `Summary: ${article.summary}` : ''}
${article.article_topic ? `Topic: ${article.article_topic}` : ''}
${article.category ? `Category: ${article.category}` : ''}
${article.content ? `\nFull Content:\n${article.content.substring(0, 1000)}${article.content.length > 1000 ? '...' : ''}` : ''}
`;
}

/**
 * Generate platform-specific prompt for Facebook
 */
function buildFacebookPrompt(context: PromptContext): string {
  const limits = PLATFORM_LIMITS.facebook;
  const style = PLATFORM_STYLES.facebook;
  const truetoneContext = buildTrueToneContext(context.userProfile);
  const articleContext = buildArticleContext(context.article);

  return `You are personalizing mortgage industry content for a loan officer's Facebook post.

${truetoneContext}

${articleContext}

PLATFORM: FACEBOOK
${context.customInstructions ? `\nCUSTOM INSTRUCTIONS:\n${context.customInstructions}\n` : ''}

FACEBOOK POST REQUIREMENTS:

CHARACTER LIMITS:
- Target length: ${limits.ideal} characters (ideal for engagement)
- Maximum length: ${limits.max} characters (practical limit)
- Hard limit: ${limits.hard} characters (never exceed)

TONE & STYLE:
- ${style.tone}
- ${style.hook}
- ${style.cta}
- Emoji usage: ${style.emojis} (match user's humor level: ${context.userProfile?.humor || 'minimal'})

STRUCTURE:
1. Opening hook (question or relatable statement)
2. Main value/insight (2-3 sentences)
3. Call-to-action (encourage engagement)

VOICE MATCHING:
- Formality: ${context.userProfile?.formality || 'semi-formal'}
- Use natural, conversational language as if speaking to a friend
- Match user's typical phrases and communication style
- Focus on building community and trust

CONSTRAINTS:
- Mobile-optimized: Short paragraphs, easy to scan
- Value-first: Lead with what matters to homebuyers/homeowners
- Authentic: Sound like a real person, not a brand
- Actionable: Give readers a clear next step

OUTPUT:
Return ONLY the Facebook post text. No explanations, no meta-commentary, no formatting markers.
The post should be ready to copy and paste directly into Facebook.`;
}

/**
 * Generate platform-specific prompt for Instagram
 */
function buildInstagramPrompt(context: PromptContext): string {
  const limits = PLATFORM_LIMITS.instagram;
  const style = PLATFORM_STYLES.instagram;
  const truetoneContext = buildTrueToneContext(context.userProfile);
  const articleContext = buildArticleContext(context.article);

  return `You are personalizing mortgage industry content for a loan officer's Instagram post.

${truetoneContext}

${articleContext}

PLATFORM: INSTAGRAM
${context.customInstructions ? `\nCUSTOM INSTRUCTIONS:\n${context.customInstructions}\n` : ''}

INSTAGRAM CAPTION REQUIREMENTS:

CHARACTER LIMITS:
- Target length: ${limits.ideal} characters (ideal for engagement)
- Maximum length: ${limits.max} characters (practical limit)
- Hard limit: ${limits.hard} characters (never exceed)

TONE & STYLE:
- ${style.tone}
- ${style.hook}
- ${style.cta}
- Emoji usage: ${style.emojis} (match user's style: ${context.userProfile?.humor || 'minimal'})
- ${style.hashtags ? `Hashtags: ${style.hashtagCount}` : 'No hashtags'}

STRUCTURE:
1. Attention-grabbing opening (1-2 lines)
2. Core message (2-3 sentences, scannable)
3. Call-to-action (DM, link in bio, or comment)
4. Hashtags (${style.hashtagCount}, separated by a line break)

VOICE MATCHING:
- Formality: ${context.userProfile?.formality || 'semi-formal'} but conversational
- Visual-first: Assume there's a compelling image/graphic
- Authentic and relatable
- Match user's communication patterns

HASHTAG STRATEGY:
- Mix of branded, trending, and niche hashtags
- Industry-specific: #mortgagebroker #homebuying #realestate
- Local if applicable
- Community tags: #firsttimehomebuyer #refinance
- Avoid overused generic hashtags

CONSTRAINTS:
- Designed for visual accompaniment
- Quick to read and scroll-friendly
- Conversational and authentic
- Drive action (comment, save, share, DM)

OUTPUT:
Return ONLY the Instagram caption with hashtags. No explanations, no meta-commentary.
Format:
[Caption text]

[Line break]
[Hashtags separated by spaces]`;
}

/**
 * Generate platform-specific prompt for Twitter/X
 */
function buildTwitterPrompt(context: PromptContext): string {
  const limits = PLATFORM_LIMITS.twitter;
  const style = PLATFORM_STYLES.twitter;
  const truetoneContext = buildTrueToneContext(context.userProfile);
  const articleContext = buildArticleContext(context.article);

  return `You are personalizing mortgage industry content for a loan officer's Twitter/X post.

${truetoneContext}

${articleContext}

PLATFORM: TWITTER/X
${context.customInstructions ? `\nCUSTOM INSTRUCTIONS:\n${context.customInstructions}\n` : ''}

TWITTER POST REQUIREMENTS:

CHARACTER LIMITS:
- Maximum length: ${limits.max} characters (HARD LIMIT)
- Target length: ${limits.ideal} characters (leaves room for retweets)
- Every character counts - be concise

TONE & STYLE:
- ${style.tone}
- ${style.hook} (CRITICAL: first 7 words hook attention)
- ${style.cta}
- Emoji usage: ${style.emojis}
- ${style.hashtags ? `Hashtags: ${style.hashtagCount}` : 'No hashtags'}

STRUCTURE:
1. Hook (first 7 words - make them count)
2. Core insight (1-2 sentences max)
3. CTA or thought-provoking question

VOICE MATCHING:
- Formality: ${context.userProfile?.formality || 'semi-formal'} but more casual/direct
- Punchy and scannable
- ${context.userProfile?.humor === 'frequent' ? 'Can be slightly witty' : 'Professional and clear'}
- Thread-ready if topic is complex (but generate single tweet)

CONSTRAINTS:
- STRICT 280 character limit
- Front-load value in first line
- Mobile-optimized for quick scanning
- One clear message per tweet
- Avoid jargon unless industry-standard

BEST PRACTICES:
- Use numbers/data when available
- Ask questions to drive engagement
- Use line breaks for readability (if space allows)
- Be conversational, not corporate

OUTPUT:
Return ONLY the tweet text. No explanations, no meta-commentary.
The tweet should be ready to copy and paste directly into Twitter/X.
It MUST be under ${limits.max} characters.`;
}

/**
 * Generate platform-specific prompt for LinkedIn
 */
function buildLinkedInPrompt(context: PromptContext): string {
  const limits = PLATFORM_LIMITS.linkedin;
  const style = PLATFORM_STYLES.linkedin;
  const truetoneContext = buildTrueToneContext(context.userProfile);
  const articleContext = buildArticleContext(context.article);

  return `You are personalizing mortgage industry content for a loan officer's LinkedIn post.

${truetoneContext}

${articleContext}

PLATFORM: LINKEDIN
${context.customInstructions ? `\nCUSTOM INSTRUCTIONS:\n${context.customInstructions}\n` : ''}

LINKEDIN POST REQUIREMENTS:

CHARACTER LIMITS:
- Target length: ${limits.ideal} characters (ideal for engagement)
- Maximum length: ${limits.max} characters (practical limit)
- Hard limit: ${limits.hard} characters (never exceed)

TONE & STYLE:
- ${style.tone}
- ${style.hook}
- ${style.cta}
- Emoji usage: ${style.emojis} (professional context)
- ${style.hashtags ? `Hashtags: ${style.hashtagCount}` : 'No hashtags'}

STRUCTURE:
1. Thought-provoking opening (lead with insight, data, or question)
2. Context and analysis (2-3 short paragraphs)
3. Professional perspective/expertise
4. Engagement question (end with question to drive comments)
5. Hashtags (${style.hashtagCount}, relevant to mortgage industry)

VOICE MATCHING:
- Formality: ${context.userProfile?.formality || 'semi-formal'} to professional
- Thought leadership positioning
- Industry expertise and credibility
- Match user's professional communication style
- Balance expertise with approachability

LINKEDIN-SPECIFIC BEST PRACTICES:
- Lead with value/insight in first 2 lines (visible before "see more")
- Use short paragraphs (2-3 sentences max)
- Include relevant data/statistics when applicable
- Position yourself as an industry expert
- Drive professional conversation in comments

HASHTAG STRATEGY:
- Industry-specific: #MortgageIndustry #RealEstateFinance
- Trending professional topics
- Local market tags if applicable
- Avoid overused generic hashtags

CONSTRAINTS:
- Professional but personable
- Industry terminology welcome
- Data-driven when possible
- Educational and valuable
- Designed to drive meaningful engagement

OUTPUT:
Return ONLY the LinkedIn post text with hashtags. No explanations, no meta-commentary.
Format:
[Opening hook - keep this under 150 chars for "see more" preview]

[Main content with line breaks between paragraphs]

[Engagement question]

[Hashtags separated by spaces]`;
}

/**
 * Main function: Generate platform-specific prompt
 */
export function buildPlatformPrompt(context: PromptContext): string {
  switch (context.platform) {
    case 'facebook':
      return buildFacebookPrompt(context);
    case 'instagram':
      return buildInstagramPrompt(context);
    case 'twitter':
      return buildTwitterPrompt(context);
    case 'linkedin':
      return buildLinkedInPrompt(context);
    default:
      throw new Error(`Unknown platform: ${context.platform}`);
  }
}

/**
 * Validate generated content against platform limits
 */
export function validatePlatformContent(
  platform: SocialPlatform,
  content: string
): { valid: boolean; error?: string; charCount: number } {
  const limits = PLATFORM_LIMITS[platform];
  const charCount = content.length;

  if (charCount > limits.hard) {
    return {
      valid: false,
      error: `Content exceeds ${platform} hard limit of ${limits.hard} characters (${charCount} chars)`,
      charCount
    };
  }

  if (charCount > limits.max) {
    console.warn(`[PlatformPrompt] Content exceeds ideal ${platform} limit: ${charCount}/${limits.max} chars`);
  }

  return { valid: true, charCount };
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: SocialPlatform): string {
  const names: Record<SocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter/X',
    linkedin: 'LinkedIn'
  };
  return names[platform];
}
