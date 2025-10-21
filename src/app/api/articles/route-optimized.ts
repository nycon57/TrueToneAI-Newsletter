import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/stripe/subscription-guards';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // URL parameter filtering (works for ALL users - free & paid)
    const industry = searchParams.get('industry');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Validate and cap the limit parameter
    const rawLimit = searchParams.get('limit');
    const MAX_LIMIT = 100;
    const DEFAULT_LIMIT = 50;
    let limit = DEFAULT_LIMIT;

    if (rawLimit) {
      const parsedLimit = parseInt(rawLimit, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          { error: 'Invalid limit parameter' },
          { status: 400 }
        );
      }
      limit = Math.min(parsedLimit, MAX_LIMIT);
    }

    const showSavedOnly = searchParams.get('saved') === 'true';

    // Check if user is authenticated
    let user = null;
    let isAuthenticated = false;
    try {
      user = await getApiUser();
      isAuthenticated = true;
    } catch {
      // User not authenticated - continue as free tier
      console.log('User not authenticated, serving free tier content');
    }

    const supabase = await createClient();

    // Check subscription status for authenticated users
    let subscriptionStatus = null;
    if (isAuthenticated && user) {
      try {
        subscriptionStatus = await getUserSubscriptionStatus(user.id);
      } catch (error) {
        // Log subscription check failure but don't abort the request
        console.error('[ArticlesAPI] Failed to check subscription status:', {
          userId: user.id,
          error: error instanceof Error ? error.message : String(error)
        });
        // Continue with subscriptionStatus = null (free tier)
      }
    }

    // Determine access level
    const canAccessPaidFeatures = subscriptionStatus?.canAccessPaidFeatures || false;

    // OPTIMIZED: Build query with conditional LEFT JOIN for personalizations
    let query = supabase
      .from('articles')
      .select(
        isAuthenticated && user && canAccessPaidFeatures
          ? `
            *,
            personalizations:personalized_outputs!left(
              id,
              personalized_key_insights,
              personalized_video_script,
              personalized_email_template,
              personalized_social_content
            )
          `
          : '*'
      )
      .eq('status', 'published');

    // Add user filter for personalizations if applicable
    if (isAuthenticated && user && canAccessPaidFeatures) {
      query = query.eq('personalizations.user_id', user.id);
    }

    // Apply URL parameter filters (for ALL users)
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    // Apply saved filter for paid users
    if (showSavedOnly && user?.saved_article_ids?.length > 0 && canAccessPaidFeatures) {
      query = query.in('id', user.saved_article_ids);
    }

    // Apply limits based on subscription
    const effectiveLimit = (!isAuthenticated || !canAccessPaidFeatures) ? 3 : limit;
    query = query
      .order('published_at', { ascending: false })
      .limit(effectiveLimit);

    // Execute single optimized query
    const { data: articles, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform articles based on user tier
    const enrichedArticles = articles?.map(article => {
      // For paid users with personalizations
      if (canAccessPaidFeatures && article.personalizations?.length > 0) {
        const personalization = article.personalizations[0];
        return {
          id: article.id,
          title: article.title,
          summary: article.summary,
          content_type: article.content_type,
          industry: article.industry,
          category: article.category,
          tags: article.tags || [],
          published_at: article.published_at,
          keyInsights: personalization.personalized_key_insights || article.default_key_insights || [],
          videoScript: personalization.personalized_video_script || article.default_video_script || '',
          emailTemplate: personalization.personalized_email_template || article.default_email_template || '',
          socialContent: personalization.personalized_social_content || article.default_social_content || {},
          is_personalized: true,
          personalization_id: personalization.id,
          tier: user?.subscription_tier || 'paid',
          is_saved: user?.saved_article_ids?.includes(article.id) || false
        };
      }

      // For free users or articles without personalization
      return {
        id: article.id,
        title: article.title,
        summary: article.summary,
        content_type: article.content_type,
        industry: article.industry,
        category: article.category,
        tags: article.tags || [],
        published_at: article.published_at,
        keyInsights: article.default_key_insights || [],
        videoScript: article.default_video_script || '',
        emailTemplate: article.default_email_template || '',
        socialContent: article.default_social_content || {},
        is_personalized: false,
        tier: subscriptionStatus?.tier || 'FREE',
        is_saved: false
      };
    });

    // Build response
    const responseData = {
      articles: enrichedArticles,
      user_tier: subscriptionStatus?.tier || (user?.subscription_tier) || 'FREE',
      subscription_status: subscriptionStatus?.status || null,
      monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
      monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || (canAccessPaidFeatures ? 100 : 3),
      saved_article_ids: user?.saved_article_ids || [],
      total_count: enrichedArticles?.length || 0,
      requires_upgrade: !canAccessPaidFeatures
    };

    // Create response with caching headers
    const response = NextResponse.json(responseData);

    // OPTIMIZED: Set cache headers based on user type
    if (isAuthenticated && canAccessPaidFeatures) {
      // Paid users: Cache for 5 minutes, serve stale content while revalidating
      response.headers.set(
        'Cache-Control',
        'private, s-maxage=300, stale-while-revalidate=600'
      );
    } else {
      // Free/Anonymous users: Cache for 1 minute (content changes less frequently)
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=120'
      );
    }

    // Add ETag for conditional requests
    const etag = `"${Buffer.from(JSON.stringify(enrichedArticles?.map(a => a.id))).toString('base64')}"`;
    response.headers.set('ETag', etag);

    // Check if client has cached version
    if (req.headers.get('If-None-Match') === etag) {
      return new NextResponse(null, { status: 304 });
    }

    return response;

  } catch (error) {
    console.error('Articles API error:', error);

    // Return error response with no-cache header
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
    errorResponse.headers.set('Cache-Control', 'no-store');

    return errorResponse;
  }
}