import { NextRequest, NextResponse } from 'next/server';
import { getCachedApiUserSafe } from '@/lib/api/auth-cached';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/stripe/subscription-guards';

/**
 * Cursor structure for pagination
 * Format: {timestamp}_{id} for handling ties in sorting
 */
interface Cursor {
  timestamp: string;
  id: string;
}

/**
 * Parse cursor string into structured object
 */
function parseCursor(cursorString: string): Cursor | null {
  if (!cursorString) return null;
  const parts = cursorString.split('_');
  if (parts.length !== 2) return null;
  return {
    timestamp: parts[0],
    id: parts[1]
  };
}

/**
 * Create cursor string from article
 */
function createCursor(article: { id: string; title: string; published_at: string }, sort: string): string {
  if (sort.startsWith('alpha-')) {
    // For alphabetical sorting, use title as timestamp equivalent
    return `${article.title}_${article.id}`;
  }
  // For date-based sorting, use published_at
  return `${article.published_at}_${article.id}`;
}

/**
 * Apply cursor-based pagination to Supabase query
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyCursorPagination(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  cursor: Cursor | null,
  sort: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!cursor) return query;

  const { timestamp, id } = cursor;

  switch (sort) {
    case 'oldest':
      // For oldest: WHERE published_at > cursor_timestamp OR (published_at = cursor_timestamp AND id > cursor_id)
      query = query.or(
        `published_at.gt.${timestamp},and(published_at.eq.${timestamp},id.gt.${id})`
      );
      break;

    case 'alpha-asc':
      // For alphabetical ascending: WHERE title > cursor_title OR (title = cursor_title AND id > cursor_id)
      query = query.or(
        `title.gt.${timestamp},and(title.eq.${timestamp},id.gt.${id})`
      );
      break;

    case 'alpha-desc':
      // For alphabetical descending: WHERE title < cursor_title OR (title = cursor_title AND id < cursor_id)
      query = query.or(
        `title.lt.${timestamp},and(title.eq.${timestamp},id.lt.${id})`
      );
      break;

    case 'newest':
    default:
      // For newest: WHERE published_at < cursor_timestamp OR (published_at = cursor_timestamp AND id < cursor_id)
      query = query.or(
        `published_at.lt.${timestamp},and(published_at.eq.${timestamp},id.lt.${id})`
      );
      break;
  }

  return query;
}

/**
 * Get total count of articles matching the filters
 */
async function getTotalCount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  filters: {
    industry?: string | null;
    category?: string | null;
    tags?: string[] | null;
    userId?: string;
    hasGenerationFilters?: boolean;
    contentTypes?: string[];
    platforms?: string[];
    dateRange?: string;
    dateFrom?: string | null;
    dateTo?: string | null;
    showSavedOnly?: boolean;
    savedArticleIds?: string[];
  }
): Promise<number> {
  let countQuery = supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  // Apply the same filters as the main query
  if (filters.industry) {
    countQuery = countQuery.eq('industry', filters.industry);
  }
  if (filters.category) {
    countQuery = countQuery.eq('category', filters.category);
  }
  if (filters.tags && filters.tags.length > 0) {
    countQuery = countQuery.overlaps('tags', filters.tags);
  }

  // Handle generation filters for paid users
  if (filters.hasGenerationFilters && filters.contentTypes && filters.contentTypes.length > 0 && filters.userId) {
    const generationsSelect = `
      id,
      generations!inner (
        id,
        content_type,
        platform,
        generated_at
      )
    `;

    countQuery = countQuery
      .select(generationsSelect, { count: 'exact', head: true })
      .eq('generations.user_id', filters.userId);

    if (filters.contentTypes.length > 0) {
      countQuery = countQuery.in('generations.content_type', filters.contentTypes);
    }

    if (filters.platforms && filters.platforms.length > 0 && filters.contentTypes.includes('SOCIAL_MEDIA')) {
      countQuery = countQuery.in('generations.platform', filters.platforms);
    }

    // Apply date filters
    if (filters.dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      countQuery = countQuery.gte('generations.generated_at', weekAgo.toISOString());
    } else if (filters.dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      countQuery = countQuery.gte('generations.generated_at', monthAgo.toISOString());
    } else if (filters.dateRange === 'custom' && filters.dateFrom) {
      countQuery = countQuery.gte('generations.generated_at', filters.dateFrom);
      if (filters.dateTo) {
        countQuery = countQuery.lte('generations.generated_at', filters.dateTo);
      }
    }
  }

  // Filter by saved articles if requested
  if (filters.showSavedOnly && filters.savedArticleIds && filters.savedArticleIds.length > 0) {
    countQuery = countQuery.in('id', filters.savedArticleIds);
  }

  const { count } = await countQuery;
  return count || 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // URL parameter filtering (works for ALL users - free & paid)
    const industry = searchParams.get('industry');
    const category = searchParams.get('category'); // Old singular parameter (backward compat)
    const categories = searchParams.get('categories')?.split(',').filter(Boolean); // New plural parameter
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const showSavedOnly = searchParams.get('saved') === 'true';
    const searchQuery = searchParams.get('search');

    // Pagination parameters
    const cursorParam = searchParams.get('cursor');
    const cursor = parseCursor(cursorParam || '');
    const pageSizeParam = searchParams.get('page_size');

    // Generation filtering parameters (PAID users only)
    const contentTypesParam = searchParams.get('contentTypes');
    const platformsParam = searchParams.get('platforms');
    const personalizationsParam = searchParams.get('personalizations'); // New parameter from frontend
    const dateRange = searchParams.get('dateRange') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sort = searchParams.get('sort') || 'newest';

    // Map frontend personalization types to backend content types
    const generationTypes = personalizationsParam ? personalizationsParam.split(',') : [];
    const mappedContentTypes: string[] = [];
    const includeDefaultContent = generationTypes.includes('default');

    generationTypes.forEach(genType => {
      switch (genType) {
        case 'key_insights':
          mappedContentTypes.push('KEY_INSIGHTS');
          break;
        case 'video_script':
          mappedContentTypes.push('VIDEO_SCRIPT');
          break;
        case 'email_template':
          mappedContentTypes.push('EMAIL_TEMPLATE');
          break;
        case 'social_media':
          mappedContentTypes.push('SOCIAL_MEDIA');
          break;
        // 'default' doesn't map to a content type - handled separately
      }
    });

    const contentTypes = contentTypesParam ? contentTypesParam.split(',') : mappedContentTypes;
    const platforms = platformsParam ? platformsParam.split(',') : [];
    const hasGenerationFilters = contentTypes.length > 0 || platforms.length > 0 || dateRange !== 'all' || includeDefaultContent;

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
    // Support both singular and plural category filtering
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    } else if (category) {
      query = query.eq('category', category);
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
    // Search in title and summary
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
    }

    // Check subscription status for authenticated users
    let subscriptionStatus = null;
    if (isAuthenticated && user) {
      subscriptionStatus = await getUserSubscriptionStatus(user.id);
    }

    // FREE/UNAUTHENTICATED: Only 3 most recent articles (no pagination)
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
          content: a.content, // Full markdown article content for modal
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
        has_more: false,
        next_cursor: null,
        requires_upgrade: true,
        saved_article_ids: [],
        monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
        monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || 3
      });

      // Cache for 1 minute for free/unauthenticated users
      response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

      return response;
    }

    // PAID: Full access with cursor-based pagination
    // At this point, user is guaranteed to be authenticated and not null

    // Determine page size (default: 10 for paid users)
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 10;
    const effectivePageSize = Math.min(Math.max(pageSize, 1), 50); // Clamp between 1 and 50

    // If generation filters are active, use INNER JOIN to only show articles with matching generations
    // Special case: if only 'default' is selected, we want articles WITHOUT generations
    if (hasGenerationFilters && contentTypes.length > 0) {
      const generationsSelect = `
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

    // Apply URL parameter filters (for PAID users)
    if (industry) {
      query = query.eq('industry', industry);
    }
    // Support both singular and plural category filtering
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    } else if (category) {
      query = query.eq('category', category);
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
    // Search in title and summary
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
    }

    // Filter by saved articles if requested
    if (showSavedOnly && user.saved_article_ids?.length > 0) {
      query = query.in('id', user.saved_article_ids);
    }

    // If NOT filtering by generations, just select articles
    if (!hasGenerationFilters) {
      query = query.select('*');
    }

    // Apply cursor-based pagination
    query = applyCursorPagination(query, cursor, sort);

    // Apply sorting
    switch (sort) {
      case 'oldest':
        query = query.order('published_at', { ascending: true }).order('id', { ascending: true });
        break;
      case 'alpha-asc':
        query = query.order('title', { ascending: true }).order('id', { ascending: true });
        break;
      case 'alpha-desc':
        query = query.order('title', { ascending: false }).order('id', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('published_at', { ascending: false }).order('id', { ascending: false });
        break;
    }

    // Fetch one extra to determine if there are more results
    query = query.limit(effectivePageSize + 1);

    const { data: articles, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Determine if there are more results
    const hasMore = (articles?.length || 0) > effectivePageSize;
    const articlesToReturn = hasMore ? articles?.slice(0, effectivePageSize) : articles;

    // Create next cursor from the last article
    let nextCursor: string | null = null;
    if (hasMore && articlesToReturn && articlesToReturn.length > 0) {
      const lastArticle = articlesToReturn[articlesToReturn.length - 1];
      nextCursor = createCursor(lastArticle, sort);
    }

    // Get total count for the current filters
    const totalCount = await getTotalCount(supabase, {
      industry,
      category,
      tags,
      userId: user.id,
      hasGenerationFilters,
      contentTypes,
      platforms,
      dateRange,
      dateFrom,
      dateTo,
      showSavedOnly,
      savedArticleIds: user.saved_article_ids || []
    });

    // Fetch all generations for these articles in a single query
    const articleIds = articlesToReturn?.map(a => a.id) || [];
    const generationsMap = new Map();

    if (articleIds.length > 0) {
      const { data: generations } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .in('article_id', articleIds);

      // Build a map of article_id -> generations array
      generations?.forEach(gen => {
        if (!generationsMap.has(gen.article_id)) {
          generationsMap.set(gen.article_id, []);
        }
        generationsMap.get(gen.article_id).push(gen);
      });
    }

    // Process articles with their generations
    let enrichedArticles = articlesToReturn?.map(article => {
      const articleGenerations = generationsMap.get(article.id) || [];

      // Find the most recent generation for each content type
      const videoScriptGen = articleGenerations
        .filter(g => g.content_type === 'VIDEO_SCRIPT')
        .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())[0];

      const emailTemplateGen = articleGenerations
        .filter(g => g.content_type === 'EMAIL_TEMPLATE')
        .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())[0];

      const keyInsightsGen = articleGenerations
        .filter(g => g.content_type === 'KEY_INSIGHTS')
        .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())[0];

      // Get social media generations
      const socialGens = articleGenerations.filter(g => g.content_type === 'SOCIAL_MEDIA');
      const socialContent: Record<string, string> = {};
      socialGens.forEach(gen => {
        if (gen.platform) {
          socialContent[gen.platform.toLowerCase()] = gen.content;
        }
      });

      const hasGenerations = articleGenerations.length > 0;

      // Build generation stats
      const generationStats = {
        total: articleGenerations.length,
        hasKeyInsights: !!keyInsightsGen,
        hasVideoScript: !!videoScriptGen,
        hasEmailTemplate: !!emailTemplateGen,
        hasSocialMedia: socialGens.length > 0,
        socialPlatforms: socialGens.map(g => g.platform?.toLowerCase()).filter(Boolean)
      };

      // Build social media generation IDs map
      const socialMediaGenIds: Record<string, string> = {};
      socialGens.forEach(gen => {
        if (gen.platform) {
          socialMediaGenIds[gen.platform.toLowerCase()] = gen.id;
        }
      });

      // Remove any joined data from the article object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { personalized_outputs, generations, ...articleData } = article as any;

      return {
        id: articleData.id,
        title: articleData.title,
        summary: articleData.summary,
        content: articleData.content, // Full markdown article content for modal
        content_type: articleData.content_type,
        industry: articleData.industry,
        category: articleData.category,
        tags: articleData.tags || [],
        published_at: articleData.published_at,
        // Use generated content if available, fallback to default
        keyInsights: keyInsightsGen?.content_array || articleData.default_key_insights || [],
        videoScript: videoScriptGen?.content || articleData.default_video_script || '',
        emailTemplate: emailTemplateGen?.content || articleData.default_email_template || '',
        // Merge default social content with AI-generated content (AI takes precedence)
        socialContent: { ...(articleData.default_social_content || {}), ...socialContent },
        // Always include default content separately for display purposes
        defaultKeyInsights: articleData.default_key_insights || [],
        defaultVideoScript: articleData.default_video_script || '',
        defaultEmailTemplate: articleData.default_email_template || '',
        is_personalized: hasGenerations,
        tier: user.subscription_tier,
        generation_stats: generationStats,
        generation_ids: {
          keyInsights: keyInsightsGen?.id,
          videoScript: videoScriptGen?.id,
          emailTemplate: emailTemplateGen?.id,
          socialMedia: Object.keys(socialMediaGenIds).length > 0 ? socialMediaGenIds : undefined
        }
      };
    });

    // If "default" filter is selected (only show articles WITHOUT any generations)
    if (includeDefaultContent && contentTypes.length === 0) {
      enrichedArticles = enrichedArticles?.filter(article => !article.is_personalized);
    }

    // Apply search filter (search in title and summary)
    if (searchQuery && searchQuery.trim()) {
      const lowerSearchQuery = searchQuery.toLowerCase().trim();
      enrichedArticles = enrichedArticles?.filter(article =>
        article.title?.toLowerCase().includes(lowerSearchQuery) ||
        article.summary?.toLowerCase().includes(lowerSearchQuery)
      );
    }

    const response = NextResponse.json({
      articles: enrichedArticles,
      user_tier: subscriptionStatus?.tier || user.subscription_tier,
      subscription_status: subscriptionStatus?.status || null,
      monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
      monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || 0,
      saved_article_ids: user.saved_article_ids || [],
      total_count: totalCount,
      has_more: hasMore,
      next_cursor: nextCursor,
      page_size: effectivePageSize
    });

    // Cache for 5 minutes for authenticated paid users
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return response;

  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
