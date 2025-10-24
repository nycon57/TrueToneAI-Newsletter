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

    // Generation filtering parameters (PAID users only)
    const contentTypesParam = searchParams.get('contentTypes');
    const platformsParam = searchParams.get('platforms');
    const dateRange = searchParams.get('dateRange') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sort = searchParams.get('sort') || 'newest';

    const contentTypes = contentTypesParam ? contentTypesParam.split(',') : [];
    const platforms = platformsParam ? platformsParam.split(',') : [];
    const hasGenerationFilters = contentTypes.length > 0 || platforms.length > 0 || dateRange !== 'all';

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

    // If generation filters are active, use INNER JOIN to only show articles with matching generations
    if (hasGenerationFilters) {
      let generationsSelect = `
        *,
        generations!inner (
          id,
          content_type,
          platform,
          generated_at
        )
      `;

      query = query
        .select(generationsSelect)
        .eq('generations.user_id', user.id);

      // Apply content type filters
      if (contentTypes.length > 0) {
        query = query.in('generations.content_type', contentTypes);
      }

      // Apply platform filters (only if SOCIAL_MEDIA is selected)
      if (platforms.length > 0 && contentTypes.includes('SOCIAL_MEDIA')) {
        query = query.in('generations.platform', platforms);
      }

      // Apply date filters
      if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('generations.generated_at', weekAgo.toISOString());
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        query = query.gte('generations.generated_at', monthAgo.toISOString());
      } else if (dateRange === 'custom' && dateFrom) {
        query = query.gte('generations.generated_at', dateFrom);
        if (dateTo) {
          query = query.lte('generations.generated_at', dateTo);
        }
      }
    }

    // Filter by saved articles if requested
    if (showSavedOnly && user.saved_article_ids?.length > 0) {
      query = query.in('id', user.saved_article_ids);
    }

    // If NOT filtering by generations, use LEFT JOIN to get personalizations (old behavior)
    if (!hasGenerationFilters) {
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
        `);
    }

    // Apply sorting
    switch (sort) {
      case 'oldest':
        query = query.order('published_at', { ascending: true });
        break;
      case 'alpha-asc':
        query = query.order('title', { ascending: true });
        break;
      case 'alpha-desc':
        query = query.order('title', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('published_at', { ascending: false });
        break;
    }

    query = query.limit(limit);

    const { data: articlesWithPersonalizations, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch generation counts for all articles (for badges)
    const articleIds = articlesWithPersonalizations?.map(a => a.id) || [];
    let generationCountsMap = new Map();

    if (articleIds.length > 0) {
      const { data: generationCounts } = await supabase
        .from('generations')
        .select('article_id, content_type, platform')
        .eq('user_id', user.id)
        .in('article_id', articleIds);

      // Build a map of article_id -> generation stats
      generationCounts?.forEach(gen => {
        if (!generationCountsMap.has(gen.article_id)) {
          generationCountsMap.set(gen.article_id, {
            total: 0,
            hasKeyInsights: false,
            hasVideoScript: false,
            hasEmailTemplate: false,
            hasSocialMedia: false,
            socialPlatforms: []
          });
        }

        const stats = generationCountsMap.get(gen.article_id);
        stats.total++;

        if (gen.content_type === 'KEY_INSIGHTS') stats.hasKeyInsights = true;
        if (gen.content_type === 'VIDEO_SCRIPT') stats.hasVideoScript = true;
        if (gen.content_type === 'EMAIL_TEMPLATE') stats.hasEmailTemplate = true;
        if (gen.content_type === 'SOCIAL_MEDIA') {
          stats.hasSocialMedia = true;
          if (gen.platform) stats.socialPlatforms.push(gen.platform);
        }
      });
    }

    // Filter personalizations to only include those for the current user
    // (LEFT JOIN returns all personalizations, we need to filter by user_id)
    const enrichedArticles = articlesWithPersonalizations?.map(article => {
      // Extract personalized_outputs array and find the one for this user
      const personalizations = Array.isArray(article.personalized_outputs)
        ? article.personalized_outputs
        : (article.personalized_outputs ? [article.personalized_outputs] : []);

      const personalization = personalizations.find(p => p?.user_id === user.id);

      // Get generation stats for this article
      const generationStats = generationCountsMap.get(article.id) || {
        total: 0,
        hasKeyInsights: false,
        hasVideoScript: false,
        hasEmailTemplate: false,
        hasSocialMedia: false,
        socialPlatforms: []
      };

      // Remove the joined data from the article object
      const { personalized_outputs, generations, ...articleData } = article;

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
        is_saved: user.saved_article_ids?.includes(articleData.id) || false,
        generation_stats: generationStats
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