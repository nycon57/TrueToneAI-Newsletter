/**
 * Platform-Specific Social Media Content Generation API
 *
 * Supports:
 * - Multi-platform generation (1-4 platforms simultaneously)
 * - Streaming responses with real-time progress
 * - Per-platform error handling
 * - Platform-specific character limits and style guidelines
 * - Usage tracking (1 generation per platform)
 * - Per-platform regeneration
 */

import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementAIUsage, setAnonymousSessionCookie, rollbackUserGenerations, rollbackAnonymousGenerations } from '@/lib/ai/usage-limits';
import { getOrCreateAnonymousSession } from '@/lib/ai/anonymous-session';
import { getUserSubscriptionStatus, checkAndResetGenerationQuota } from '@/lib/stripe/subscription-guards';
import { buildPlatformPrompt, validatePlatformContent, getPlatformDisplayName } from '@/lib/ai/platform-prompts';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/utils/rateLimit';
import type { SocialPlatform } from '@/types/social-media';
import type {
  PlatformSpecificGenerationRequest,
  PlatformGenerationStreamEvent,
  GenerationResult
} from '@/types/social-generation';

/**
 * POST /api/ai/social-generate
 *
 * Request body:
 * {
 *   articleId: string;
 *   platforms: SocialPlatform[]; // 1-4 platforms
 *   regenerate?: boolean;
 *   customInstructions?: string;
 * }
 *
 * Response: Server-Sent Events (SSE) stream with platform generation progress
 */
export async function POST(req: NextRequest) {
  // Apply rate limiting before any processing
  const clientId = getClientIdentifier(req, 'ai-social-generate');
  if (!checkRateLimit(clientId, RATE_LIMIT_CONFIGS.AI_SOCIAL_GENERATE)) {
    const headers = getRateLimitHeaders(clientId, RATE_LIMIT_CONFIGS.AI_SOCIAL_GENERATE);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  const controller = new AbortController();
  const encoder = new TextEncoder();

  // Create streaming response
  const stream = new ReadableStream({
    async start(streamController) {
      // Variables for rollback tracking (must be in outer scope for catch block)
      let incrementedCount = 0;
      let rollbackUserId: string | undefined;
      let rollbackSessionId: string | undefined;

      try {
        // Helper function to send SSE events
        const sendEvent = (event: PlatformGenerationStreamEvent) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          streamController.enqueue(encoder.encode(data));
        };

        // Try to get authenticated user
        let user = null;
        let isAuthenticated = false;

        try {
          user = await getApiUser();
          isAuthenticated = true;
        } catch {
          console.log('[SocialGenerate] Anonymous generation request');
        }

        // Parse request body
        let body: PlatformSpecificGenerationRequest;
        try {
          body = await req.json();
        } catch (error) {
          sendEvent({
            type: 'error',
            error: 'Invalid JSON in request body',
            timestamp: new Date().toISOString()
          });
          streamController.close();
          return;
        }

        const { articleId, platforms, customInstructions } = body;

        // Validate request
        if (!articleId || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
          sendEvent({
            type: 'error',
            error: 'articleId and platforms (array) are required',
            timestamp: new Date().toISOString()
          });
          streamController.close();
          return;
        }

        if (platforms.length > 4) {
          sendEvent({
            type: 'error',
            error: 'Maximum 4 platforms can be generated at once',
            timestamp: new Date().toISOString()
          });
          streamController.close();
          return;
        }

        // Validate platforms
        const validPlatforms: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin'];
        const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
        if (invalidPlatforms.length > 0) {
          sendEvent({
            type: 'error',
            error: `Invalid platforms: ${invalidPlatforms.join(', ')}`,
            timestamp: new Date().toISOString()
          });
          streamController.close();
          return;
        }

        // Check usage limits for EACH platform (each platform = 1 generation)
        const platformsCount = platforms.length;
        const usageChecks = [];

        for (let i = 0; i < platformsCount; i++) {
          let usageCheck;
          let sessionId: string | undefined;
          let ipAddress: string | null = null;

          if (isAuthenticated && user) {
            // Check and reset quota if needed (monthly reset)
            await checkAndResetGenerationQuota(user.id);

            // Atomic check and increment for authenticated user
            usageCheck = await checkAndIncrementAIUsage({ userId: user.id });

            // Track for potential rollback
            rollbackUserId = user.id;

            // Get subscription status for additional context
            const subscriptionStatus = await getUserSubscriptionStatus(user.id);

            // Add subscription info to response
            usageCheck.tier = subscriptionStatus.tier.toLowerCase() as 'free' | 'paid' | 'anonymous';
            usageCheck.limit = subscriptionStatus.monthlyGenerationLimit;
            usageCheck.used = subscriptionStatus.monthlyGenerationsUsed;
            usageCheck.remaining = subscriptionStatus.generationsRemaining;
          } else {
            // Get or create anonymous session
            const session = await getOrCreateAnonymousSession();
            sessionId = session.sessionId;
            ipAddress = session.ipAddress;

            // Track for potential rollback
            rollbackSessionId = sessionId;

            // Atomic check and increment for anonymous user
            usageCheck = await checkAndIncrementAIUsage({
              sessionId,
              ipAddress: ipAddress || undefined
            });

            // Set session cookie if not already set
            await setAnonymousSessionCookie(sessionId);
          }

          // Check if generation was allowed
          if (!usageCheck.allowed) {
            // Rollback all previous increments
            if (incrementedCount > 0) {
              if (rollbackUserId) {
                await rollbackUserGenerations(rollbackUserId, incrementedCount);
                console.log(`[SocialGenerate] Rolled back ${incrementedCount} user generations due to limit reached`);
              } else if (rollbackSessionId) {
                await rollbackAnonymousGenerations(rollbackSessionId, incrementedCount);
                console.log(`[SocialGenerate] Rolled back ${incrementedCount} anonymous generations due to limit reached`);
              }
            }

            sendEvent({
              type: 'error',
              error: usageCheck.message || 'Generation limit reached',
              generationsRemaining: usageCheck.remaining,
              timestamp: new Date().toISOString()
            });
            streamController.close();
            return;
          }

          incrementedCount++;
          usageChecks.push(usageCheck);
        }

        // Get final usage status (last check has most current values)
        const finalUsageCheck = usageChecks[usageChecks.length - 1];

        // Fetch article
        const supabase = await createClient();
        const { data: article, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .eq('status', 'published')
          .single();

        if (articleError || !article) {
          // Rollback all increments since article fetch failed
          if (incrementedCount > 0) {
            if (rollbackUserId) {
              await rollbackUserGenerations(rollbackUserId, incrementedCount);
              console.log(`[SocialGenerate] Rolled back ${incrementedCount} user generations due to article not found`);
            } else if (rollbackSessionId) {
              await rollbackAnonymousGenerations(rollbackSessionId, incrementedCount);
              console.log(`[SocialGenerate] Rolled back ${incrementedCount} anonymous generations due to article not found`);
            }
          }

          sendEvent({
            type: 'error',
            error: 'Article not found',
            timestamp: new Date().toISOString()
          });
          streamController.close();
          return;
        }

        // Fetch extended user profile for authenticated users (for better personalization)
        let enrichedUser = user;
        if (isAuthenticated && user) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('tone_of_voice, formality, humor, emotional_expression, detail_orientation, vocabulary, content_length, engagement_style, user_persona, communication_style, speech_patterns, professional_indicators, unique_voice_markers')
            .eq('id', user.id)
            .single();

          if (userProfile) {
            enrichedUser = { ...user, ...userProfile };
          }
        }

        // Generate content for each platform in parallel
        const generationResults: GenerationResult[] = [];
        const platformPromises = platforms.map(async (platform) => {
          const startTime = Date.now();

          try {
            // Send platform start event
            sendEvent({
              type: 'platform_start',
              platform,
              timestamp: new Date().toISOString()
            });

            // Build platform-specific prompt
            const prompt = buildPlatformPrompt({
              article: {
                title: article.title,
                summary: article.summary,
                article_topic: article.article_topic,
                category: article.category,
                content: article.content
              },
              userProfile: enrichedUser,
              platform,
              customInstructions
            });

            // Stream generation for this platform
            let fullContent = '';
            const result = await streamText({
              model: openai('gpt-4o-mini'),
              prompt,
              temperature: 0.7,
              maxTokens: 1000,
              abortSignal: controller.signal
            });

            // Stream chunks to client
            for await (const chunk of result.textStream) {
              fullContent += chunk;
              sendEvent({
                type: 'platform_chunk',
                platform,
                chunk,
                timestamp: new Date().toISOString()
              });
            }

            // Validate content against platform limits
            const validation = validatePlatformContent(platform, fullContent);
            if (!validation.valid) {
              throw new Error(validation.error);
            }

            // Send platform complete event
            sendEvent({
              type: 'platform_complete',
              platform,
              content: fullContent,
              timestamp: new Date().toISOString()
            });

            const duration = Date.now() - startTime;

            // Save successful generation to database (if authenticated)
            if (isAuthenticated && user) {
              try {
                // Get TrueTone snapshot
                const { data: userProfile } = await supabase
                  .from('users')
                  .select('tone_of_voice, formality, humor, emotional_expression, detail_orientation, vocabulary, content_length, engagement_style')
                  .eq('id', user.id)
                  .single();

                const truetoneSnapshot = userProfile ? {
                  tone_of_voice: userProfile.tone_of_voice,
                  formality: userProfile.formality,
                  humor: userProfile.humor,
                  emotional_expression: userProfile.emotional_expression,
                  detail_orientation: userProfile.detail_orientation,
                  vocabulary: userProfile.vocabulary,
                  content_length: userProfile.content_length,
                  engagement_style: userProfile.engagement_style
                } : null;

                // Map platform to database enum
                const platformMap: Record<SocialPlatform, string> = {
                  'facebook': 'FACEBOOK',
                  'instagram': 'INSTAGRAM',
                  'twitter': 'TWITTER',
                  'linkedin': 'LINKEDIN'
                };

                // Save to generations table
                await supabase
                  .from('generations')
                  .upsert({
                    user_id: user.id,
                    article_id: articleId,
                    content_type: 'SOCIAL_MEDIA',
                    platform: platformMap[platform],
                    content: fullContent,
                    content_array: [],
                    tokens_used: result.usage ? result.usage.totalTokens : 0,
                    generated_at: new Date().toISOString(),
                    truetone_snapshot: truetoneSnapshot
                  }, {
                    onConflict: 'user_id,article_id,content_type,platform',
                    ignoreDuplicates: false
                  });

                console.log(`[SocialGenerate] Saved ${platform} generation to database`);
              } catch (saveError) {
                console.error(`[SocialGenerate] Failed to save ${platform} generation:`, saveError);
                // Don't fail the whole generation if save fails
              }
            }

            // Track result
            generationResults.push({
              platform,
              success: true,
              content: fullContent,
              tokensUsed: result.usage ? result.usage.totalTokens : 0,
              generatedAt: new Date().toISOString(),
              duration
            });

            console.log(`[SocialGenerate] ${getPlatformDisplayName(platform)} generated successfully in ${duration}ms`);
          } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            console.error(`[SocialGenerate] Error generating ${platform}:`, errorMessage);

            sendEvent({
              type: 'error',
              platform,
              error: errorMessage,
              timestamp: new Date().toISOString()
            });

            generationResults.push({
              platform,
              success: false,
              error: errorMessage,
              generatedAt: new Date().toISOString(),
              duration
            });
          }
        });

        // Wait for all platforms to complete
        await Promise.all(platformPromises);

        // Send final completion event with usage update
        const successfulPlatforms = generationResults.filter(r => r.success).length;
        const failedPlatforms = generationResults.filter(r => !r.success).length;
        const totalTokens = generationResults.reduce((sum, r) => sum + (r.tokensUsed || 0), 0);

        // If ALL platforms failed, rollback all increments
        if (successfulPlatforms === 0 && failedPlatforms > 0) {
          if (rollbackUserId) {
            const rollbackResult = await rollbackUserGenerations(rollbackUserId, platformsCount);
            console.log(`[SocialGenerate] All platforms failed - rolled back ${rollbackResult.rolledBack} user generations`);

            // Update final usage check with rollback values
            finalUsageCheck.used = rollbackResult.used;
            finalUsageCheck.remaining = rollbackResult.remaining;
          } else if (rollbackSessionId) {
            const rollbackResult = await rollbackAnonymousGenerations(rollbackSessionId, platformsCount);
            console.log(`[SocialGenerate] All platforms failed - rolled back ${rollbackResult.rolledBack} anonymous generations`);

            // Update final usage check with rollback values
            finalUsageCheck.used = rollbackResult.used;
            finalUsageCheck.remaining = rollbackResult.remaining;
          }
        }

        sendEvent({
          type: 'all_complete',
          generationsUsed: successfulPlatforms, // Only count successful generations
          generationsRemaining: finalUsageCheck.remaining,
          timestamp: new Date().toISOString()
        });

        // Log analytics
        console.log('[SocialGenerate] Completed:', {
          userId: user?.id || 'anonymous',
          articleId,
          platformsRequested: platforms.length,
          platformsSucceeded: successfulPlatforms,
          platformsFailed: failedPlatforms,
          generationsUsed: successfulPlatforms, // Only count successful generations
          generationsRemaining: finalUsageCheck.remaining,
          totalTokens,
          tier: finalUsageCheck.tier
        });

        streamController.close();
      } catch (error) {
        console.error('[SocialGenerate] Unexpected error:', error);

        // Rollback increments on unexpected error
        if (incrementedCount > 0) {
          if (rollbackUserId) {
            await rollbackUserGenerations(rollbackUserId, incrementedCount);
            console.log(`[SocialGenerate] Unexpected error - rolled back ${incrementedCount} user generations`);
          } else if (rollbackSessionId) {
            await rollbackAnonymousGenerations(rollbackSessionId, incrementedCount);
            console.log(`[SocialGenerate] Unexpected error - rolled back ${incrementedCount} anonymous generations`);
          }
        }

        const sendEvent = (event: PlatformGenerationStreamEvent) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          streamController.enqueue(encoder.encode(data));
        };

        sendEvent({
          type: 'error',
          error: error instanceof Error ? error.message : 'Internal server error',
          timestamp: new Date().toISOString()
        });

        streamController.close();
      }
    },

    cancel() {
      console.log('[SocialGenerate] Stream cancelled by client');
      controller.abort();
    }
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
