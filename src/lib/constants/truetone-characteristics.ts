export interface TrueToneOption {
  value: string;
  label: string;
  example: string;
  description: string;
}

export interface TrueToneCharacteristic {
  id: string;
  label: string;
  description: string;
  options: TrueToneOption[];
  defaultValue: string;
}

export const TRUETONE_CHARACTERISTICS: TrueToneCharacteristic[] = [
  {
    id: 'tone_of_voice',
    label: 'Tone of Voice',
    description: 'How you want to sound when communicating with clients',
    options: [
      {
        value: 'Professional',
        label: 'Professional',
        example: 'Market data shows rates decreased by 0.25%',
        description: 'Business-focused and formal communication style'
      },
      {
        value: 'Friendly',
        label: 'Friendly',
        example: 'Great news! Rates just dropped, let\'s chat about your options',
        description: 'Warm and approachable tone that builds rapport'
      },
      {
        value: 'Authoritative',
        label: 'Authoritative',
        example: 'Based on my 15 years of experience, now is the time to act',
        description: 'Expert and confident voice that establishes credibility'
      },
      {
        value: 'Conversational',
        label: 'Conversational',
        example: 'You know what? This rate change could be perfect for you',
        description: 'Casual and relatable, like talking to a friend'
      },
      {
        value: 'Empathetic',
        label: 'Empathetic',
        example: 'I understand buying a home can feel overwhelming, I\'m here to help',
        description: 'Understanding and supportive tone that shows you care'
      }
    ],
    defaultValue: 'Friendly',
  },
  {
    id: 'humor',
    label: 'Humor',
    description: 'The type of humor you use to engage your audience',
    options: [
      {
        value: 'Dry',
        label: 'Dry',
        example: 'Interest rates dropped. Shocking, I know.',
        description: 'Subtle, understated humor with deadpan delivery'
      },
      {
        value: 'Witty',
        label: 'Witty',
        example: 'Rates are falling faster than my New Year\'s resolutions',
        description: 'Clever wordplay and sharp observations'
      },
      {
        value: 'Playful',
        label: 'Playful',
        example: 'Time to do the happy dance - rates are down! 💃',
        description: 'Light-hearted and fun, uses emojis and enthusiasm'
      },
      {
        value: 'Satirical',
        label: 'Satirical',
        example: 'Because waiting for lower rates has been such a relaxing experience',
        description: 'Ironic commentary on industry situations'
      },
      {
        value: 'Absurdist',
        label: 'Absurdist',
        example: 'If rates keep dropping, we might need to start paying people to borrow',
        description: 'Exaggerated and unexpected comparisons'
      }
    ],
    defaultValue: 'Dry',
  },
  {
    id: 'detail_orientation',
    label: 'Detail Orientation',
    description: 'How much detail and context you provide',
    options: [
      {
        value: 'Essential',
        label: 'Essential',
        example: 'Rates: 6.5%',
        description: 'Just the key facts, nothing extra'
      },
      {
        value: 'Overview',
        label: 'Overview',
        example: 'Rates dropped to 6.5% this week',
        description: 'Brief summary with main points'
      },
      {
        value: 'Balanced',
        label: 'Balanced',
        example: 'Rates decreased to 6.5%, down from 6.75% last month',
        description: 'Moderate detail with some context'
      },
      {
        value: 'Comprehensive',
        label: 'Comprehensive',
        example: 'Rates fell to 6.5% due to Fed policy, affecting 30-year fixed mortgages',
        description: 'Detailed information with background and implications'
      },
      {
        value: 'Exhaustive',
        label: 'Exhaustive',
        example: 'The 0.25% rate decrease brings 30-year fixed mortgages to 6.5%, influenced by...',
        description: 'In-depth analysis with complete context and data'
      }
    ],
    defaultValue: 'Comprehensive',
  },
  {
    id: 'content_length',
    label: 'Content Length',
    description: 'How long your content and messages should be',
    options: [
      {
        value: 'Minimal',
        label: 'Minimal',
        example: '1-2 sentences',
        description: 'Very brief, quick-read content'
      },
      {
        value: 'Brief',
        label: 'Brief',
        example: 'Short paragraph (3-4 sentences)',
        description: 'Concise but complete thoughts'
      },
      {
        value: 'Moderate',
        label: 'Moderate',
        example: '2-3 paragraphs',
        description: 'Standard length with good coverage'
      },
      {
        value: 'Thorough',
        label: 'Thorough',
        example: '4-5 paragraphs',
        description: 'Detailed exploration of topics'
      },
      {
        value: 'Comprehensive',
        label: 'Comprehensive',
        example: '6+ paragraphs',
        description: 'Long-form, in-depth content'
      }
    ],
    defaultValue: 'Thorough',
  },
  {
    id: 'formality',
    label: 'Formality',
    description: 'The level of formality in your communication',
    options: [
      {
        value: 'Ceremonial',
        label: 'Ceremonial',
        example: 'Dear Valued Client, I am pleased to inform you...',
        description: 'Very formal, traditional business language'
      },
      {
        value: 'Professional',
        label: 'Professional',
        example: 'Hi Sarah, I wanted to share this important update with you',
        description: 'Professional but approachable'
      },
      {
        value: 'Balanced',
        label: 'Balanced',
        example: 'Hey Sarah! Quick update on those rates we discussed',
        description: 'Mix of professional and casual'
      },
      {
        value: 'Relaxed',
        label: 'Relaxed',
        example: 'Sarah - you\'re gonna love this rate news!',
        description: 'Casual and laid-back tone'
      },
      {
        value: 'Intimate',
        label: 'Intimate',
        example: 'Sarah! Remember when you said you were waiting? Well...',
        description: 'Personal and familiar, like close friends'
      }
    ],
    defaultValue: 'Professional',
  },
  {
    id: 'emotional_expression',
    label: 'Emotional Expression',
    description: 'How much emotion you show in your content',
    options: [
      {
        value: 'Stoic',
        label: 'Stoic',
        example: 'Rates decreased by 0.25%. Contact me for details.',
        description: 'Neutral and factual, minimal emotion'
      },
      {
        value: 'Reserved',
        label: 'Reserved',
        example: 'This rate change is noteworthy. Let\'s discuss your options.',
        description: 'Controlled emotion, professional restraint'
      },
      {
        value: 'Balanced',
        label: 'Balanced',
        example: 'This is good news! I\'m pleased to share this update with you.',
        description: 'Appropriate emotional responses'
      },
      {
        value: 'Expressive',
        label: 'Expressive',
        example: 'I\'m so excited to share this! This could be exactly what you\'ve been waiting for!',
        description: 'Clear emotional engagement and enthusiasm'
      },
      {
        value: 'Passionate',
        label: 'Passionate',
        example: 'I can\'t contain my excitement! This is HUGE and I had to tell you immediately!',
        description: 'High energy and strong emotional investment'
      }
    ],
    defaultValue: 'Reserved',
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    description: 'The complexity of language you use',
    options: [
      {
        value: 'Elementary',
        label: 'Elementary',
        example: 'Rates went down. Good for you.',
        description: 'Simple, everyday words'
      },
      {
        value: 'Accessible',
        label: 'Accessible',
        example: 'Interest rates decreased, which means lower monthly payments',
        description: 'Clear language anyone can understand'
      },
      {
        value: 'Professional',
        label: 'Professional',
        example: 'The Fed\'s rate adjustment impacts conventional mortgage pricing',
        description: 'Industry-standard terminology'
      },
      {
        value: 'Sophisticated',
        label: 'Sophisticated',
        example: 'Monetary policy shifts have created favorable lending conditions',
        description: 'Advanced vocabulary showing expertise'
      },
      {
        value: 'Specialized',
        label: 'Specialized',
        example: 'The 25 basis point reduction in the federal funds rate impacts conforming loan pricing',
        description: 'Technical industry jargon for experts'
      }
    ],
    defaultValue: 'Sophisticated',
  },
  {
    id: 'engagement_style',
    label: 'Engagement Style',
    description: 'How you engage and interact with your audience',
    options: [
      {
        value: 'Informative',
        label: 'Informative',
        example: 'Here are the current market rates and what they mean for buyers',
        description: 'Educational, focuses on providing information'
      },
      {
        value: 'Interactive',
        label: 'Interactive',
        example: 'What are your thoughts on these new rates? Let\'s talk!',
        description: 'Encourages dialogue and questions'
      },
      {
        value: 'Narrative',
        label: 'Narrative',
        example: 'Let me tell you about a client who was in your exact situation...',
        description: 'Story-driven, uses examples and anecdotes'
      },
      {
        value: 'Consultative',
        label: 'Consultative',
        example: 'Based on your situation, here\'s what I recommend...',
        description: 'Advisory approach, offers guidance and solutions'
      },
      {
        value: 'Inspirational',
        label: 'Inspirational',
        example: 'Imagine walking into your dream home knowing you got the best rate possible!',
        description: 'Motivating and aspirational, paints a vision'
      }
    ],
    defaultValue: 'Interactive',
  },
];

export type TrueToneSettings = {
  [key: string]: string;
};
