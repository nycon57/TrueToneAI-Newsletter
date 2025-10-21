import { NextRequest, NextResponse } from 'next/server';
import { getCachedApiUserSafe } from '@/lib/api/auth-cached';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/stripe/subscription-guards';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // URL parameter filtering (works for ALL users - free & paid)
    const industry = searchParams.get('industry');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const limit = parseInt(searchParams.get('limit') || '50');
    const showSavedOnly = searchParams.get('saved') === 'true';

    // Check if user is authenticated (using cached auth for performance)
    const user = await getCachedApiUserSafe();
    const isAuthenticated = !!user;

    const supabase = await createClient();
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published');

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

    // Check subscription status for authenticated users
    let subscriptionStatus = null;
    if (isAuthenticated && user) {
      subscriptionStatus = await getUserSubscriptionStatus(user.id);
    }

    // FREE/UNAUTHENTICATED: Only 3 most recent
    const canAccessPaidFeatures = subscriptionStatus?.canAccessPaidFeatures || false;

    if (!isAuthenticated || !user || !canAccessPaidFeatures) {
      query = query
        .order('published_at', { ascending: false })
        .limit(3);

      const { data: articles, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const response = NextResponse.json({
        articles: articles?.map(a => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          content_type: a.content_type,
          industry: a.industry,
          category: a.category,
          tags: a.tags || [],
          published_at: a.published_at,
          // Free users get default content
          keyInsights: a.default_key_insights || [],
          videoScript: a.default_video_script || '',
          emailTemplate: a.default_email_template || '',
          socialContent: a.default_social_content || {},
          is_personalized: false,
          tier: subscriptionStatus?.tier || 'FREE',
          is_saved: false
        })),
        user_tier: subscriptionStatus?.tier || 'FREE',
        subscription_status: subscriptionStatus?.status || null,
        total_count: 3,
        requires_upgrade: true,
        saved_article_ids: [],
        monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
        monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || 3
      });

      // Cache for 1 minute for free/unauthenticated users
      response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

      return response;
    }

    // PAID: Full access with single query optimization (LEFT JOIN)
    // At this point, user is guaranteed to be authenticated and not null
    // Filter by saved articles if requested
    if (showSavedOnly && user.saved_article_ids?.length > 0) {
      query = query.in('id', user.saved_article_ids);
    }

    // Optimize: Fetch articles with their personalizations in a single query using LEFT JOIN
    // This replaces the N+1 query pattern (1 query for articles + N queries for personalizations)
    query = query
      .select(`
        *,
        personalized_outputs!left (
          id,
          article_id,
          user_id,
          personalized_key_insights,
          personalized_video_script,
          personalized_email_template,
          personalized_social_content
        )
      `)
      .order('published_at', { ascending: false })
      .limit(limit);

    const { data: articlesWithPersonalizations, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter personalizations to only include those for the current user
    // (LEFT JOIN returns all personalizations, we need to filter by user_id)
    const enrichedArticles = articlesWithPersonalizations?.map(article => {
      // Extract personalized_outputs array and find the one for this user
      const personalizations = Array.isArray(article.personalized_outputs)
        ? article.personalized_outputs
        : (article.personalized_outputs ? [article.personalized_outputs] : []);

      const personalization = personalizations.find(p => p?.user_id === user.id);

      // Remove the joined data from the article object
      const { personalized_outputs, ...articleData } = article;

      return {
        id: articleData.id,
        title: articleData.title,
        summary: articleData.summary,
        content_type: articleData.content_type,
        industry: articleData.industry,
        category: articleData.category,
        tags: articleData.tags || [],
        published_at: articleData.published_at,
        // Use personalized content if available, otherwise default
        keyInsights: personalization?.personalized_key_insights || articleData.default_key_insights || [],
        videoScript: personalization?.personalized_video_script || articleData.default_video_script || '',
        emailTemplate: personalization?.personalized_email_template || articleData.default_email_template || '',
        socialContent: personalization?.personalized_social_content || articleData.default_social_content || {},
        is_personalized: !!personalization,
        personalization_id: personalization?.id,
        tier: user.subscription_tier,
        is_saved: user.saved_article_ids?.includes(articleData.id) || false
      };
    });

    const response = NextResponse.json({
      articles: enrichedArticles,
      user_tier: subscriptionStatus?.tier || user.subscription_tier,
      subscription_status: subscriptionStatus?.status || null,
      monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
      monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || 0,
      saved_article_ids: user.saved_article_ids || [],
      total_count: enrichedArticles?.length || 0
    });

    // Cache for 5 minutes for authenticated paid users
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return response;

  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}