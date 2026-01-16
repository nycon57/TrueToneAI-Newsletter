import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/utils/rateLimit';
import { checkBotId } from 'botid/server';

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // Optional but recommended if you have one
});

export async function POST(request: NextRequest) {
  // Bot protection check
  const botVerification = await checkBotId();
  if (botVerification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Apply rate limiting
  const clientId = getClientIdentifier(request, 'ai-chat');
  if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.AI_CHAT)) {
    const headers = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.AI_CHAT);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    );
  }

  try {
    const body = await request.json();
    const { messages, selectedArticle, selectedContentType, articleContent } = body;

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message is required' },
        { status: 400 }
      );
    }

    // Validate message format
    const isValidMessage = (msg: unknown): msg is { content: string; role: 'user' | 'assistant' } => 
      msg !== null && typeof msg === 'object' && 
      'content' in msg && typeof (msg as { content: unknown }).content === 'string' && 
      'role' in msg && ['user', 'assistant'].includes((msg as { role: unknown }).role as string);

    if (!messages.every(isValidMessage)) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Build context based on selected article and content type
    const systemPrompt = `You are an AI assistant helping a loan officer customize marketing content. You are professional, helpful, and knowledgeable about mortgage industry best practices.

Current Context:
- Selected Article: ${selectedArticle}
- Content Focus: ${selectedContentType}
- Article Content: ${JSON.stringify(articleContent, null, 2)}

Guidelines:
- Keep responses concise and actionable
- Maintain a professional tone suitable for loan officer marketing
- Focus on the selected content type when applicable
- Provide specific, implementable suggestions
- Consider compliance and professional standards for mortgage marketing
- If customizing content, preserve key factual information while adapting tone/style`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
      top_p: 0.9,
      frequency_penalty: 0.3, // Reduce repetition
      presence_penalty: 0.1,  // Encourage topic diversity
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle different types of OpenAI errors
    if (error instanceof OpenAI.APIError) {
      const status = error.status || 500;
      const message = error.message || 'OpenAI API error';
      
      return NextResponse.json(
        { error: `API Error: ${message}` },
        { status }
      );
    }
    
    // Handle rate limiting
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Handle authentication errors
    if (error instanceof OpenAI.AuthenticationError) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check API configuration.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}