/**
 * Server-side data fetching utilities
 * These functions run on the server and can be used in Server Components
 */

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserSubscriptionStatus } from '@/lib/stripe/subscription-guards';

interface FetchArticlesParams {
  industry?: string | null;
  category?: string | null;
  tags?: string | null;
  saved?: string | null;
  isAuthenticated?: boolean;
  limit?: number;
  page_size?: number;
}

/**
 * Fetch articles on the server with caching
 * Uses React's cache() to deduplicate requests within the same render
 */
export const prefetchArticles = cache(async (params: FetchArticlesParams) => {
  const { industry, category, tags, saved, isAuthenticated = false, limit = 50, page_size = 9 } = params;

  try {
    const supabase = await createClient();

    // Base query
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published');

    // Apply filters
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (tags) {
      const tagArray = tags.split(',').filter(Boolean);
      if (tagArray.length > 0) {
        query = query.overlaps('tags', tagArray);
      }
    }

    // For unauthenticated users, only show 3 most recent
    if (!isAuthenticated) {
      query = query
        .order('published_at', { ascending: false })
        .limit(3);

      const { data: articles } = await query;

      return {
        articles: articles?.map(a => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          content: a.content, // Full markdown article content
          content_type: a.content_type,
          industry: a.industry,
          category: a.category,
          tags: a.tags || [],
          published_at: a.published_at,
          keyInsights: a.default_key_insights || [],
          videoScript: a.default_video_script || '',
          emailTemplate: a.default_email_template || '',
          socialContent: a.default_social_content || {},
          is_personalized: false,
          tier: 'FREE',
          is_saved: false
        })),
        user_tier: 'FREE',
        subscription_status: null,
        total_count: 3,
        requires_upgrade: true,
        saved_article_ids: [],
        monthly_generations_used: 0,
        monthly_generation_limit: 3
      };
    }

    // For authenticated users, get full data with personalizations
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      throw new Error('User not authenticated');
    }

    // Get user data
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('kinde_id', kindeUser.id)
      .single();

    if (!user) {
      throw new Error('User not found');
    }

    // Check subscription status
    const subscriptionStatus = await getUserSubscriptionStatus(user.id);

    // Apply saved filter if needed
    if (saved === 'true' && user.saved_article_ids?.length > 0) {
      query = query.in('id', user.saved_article_ids);
    }

    // Fetch articles with pagination - fetch one extra to check if more exist
    const effectivePageSize = Math.min(page_size, 50);
    query = query
      .order('published_at', { ascending: false })
      .limit(effectivePageSize + 1); // Fetch one extra to detect if there are more

    const { data: articles } = await query;

    // DEBUG: Log what we got from database
    console.log('[prefetchArticles] Fetched articles from DB:', {
      count: articles?.length || 0,
      firstArticleContent: articles?.[0]?.content ? `${articles[0].content.substring(0, 100)}...` : 'NO CONTENT',
      firstArticleHasContent: !!articles?.[0]?.content,
      firstArticleKeys: articles?.[0] ? Object.keys(articles[0]) : []
    });

    // Check if there are more articles
    const hasMore = articles && articles.length > effectivePageSize;
    const articlesToReturn = hasMore ? articles.slice(0, effectivePageSize) : articles || [];

    // Create cursor for next page (if there are more articles)
    const nextCursor = hasMore && articlesToReturn.length > 0
      ? `${articlesToReturn[articlesToReturn.length - 1].published_at}_${articlesToReturn[articlesToReturn.length - 1].id}`
      : null;

    // Fetch all generations for this user in a single query
    const articleIds = articlesToReturn?.map(a => a.id) || [];
    const { data: generations } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .in('article_id', articleIds);

    // Process articles with generations
    const enrichedArticles = articlesToReturn?.map(article => {
      // Get generations for this article
      const articleGenerations = generations?.filter(g => g.article_id === article.id) || [];

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
      const socialContent: any = {};
      socialGens.forEach(gen => {
        if (gen.platform) {
          socialContent[gen.platform.toLowerCase()] = gen.content;
        }
      });

      const hasGenerations = articleGenerations.length > 0;

      // Build social media generation IDs map
      const socialMediaGenIds: Record<string, string> = {};
      socialGens.forEach(gen => {
        if (gen.platform) {
          socialMediaGenIds[gen.platform.toLowerCase()] = gen.id;
        }
      });

      return {
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content, // Full markdown article content
        content_type: article.content_type,
        industry: article.industry,
        category: article.category,
        tags: article.tags || [],
        published_at: article.published_at,
        // Use generated content if available, fallback to default
        keyInsights: keyInsightsGen?.content_array || article.default_key_insights || [],
        videoScript: videoScriptGen?.content || article.default_video_script || '',
        emailTemplate: emailTemplateGen?.content || article.default_email_template || '',
        socialContent: Object.keys(socialContent).length > 0 ? socialContent : (article.default_social_content || {}),
        is_personalized: hasGenerations,
        tier: user.subscription_tier,
        generation_stats: {
          total: articleGenerations.length,
          hasKeyInsights: !!keyInsightsGen,
          hasVideoScript: !!videoScriptGen,
          hasEmailTemplate: !!emailTemplateGen,
          hasSocialMedia: socialGens.length > 0,
          socialPlatforms: socialGens.map(g => g.platform).filter(Boolean)
        },
        generation_ids: {
          keyInsights: keyInsightsGen?.id,
          videoScript: videoScriptGen?.id,
          emailTemplate: emailTemplateGen?.id,
          socialMedia: Object.keys(socialMediaGenIds).length > 0 ? socialMediaGenIds : undefined
        }
      };
    });

    // DEBUG: Log what we're returning
    console.log('[prefetchArticles] Returning enriched articles:', {
      count: enrichedArticles?.length || 0,
      firstArticleHasContent: !!enrichedArticles?.[0]?.content,
      firstArticleContentLength: enrichedArticles?.[0]?.content?.length || 0,
      firstArticleKeys: enrichedArticles?.[0] ? Object.keys(enrichedArticles[0]) : []
    });

    return {
      articles: enrichedArticles || [],
      user_tier: subscriptionStatus?.tier || user.subscription_tier,
      subscription_status: subscriptionStatus?.status || null,
      monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
      monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || 0,
      saved_article_ids: user.saved_article_ids || [],
      total_count: enrichedArticles?.length || 0,
      has_more: hasMore,
      next_cursor: nextCursor,
      page_size: effectivePageSize
    };

  } catch (error) {
    console.error('Error prefetching articles:', error);
    // Return empty state on error
    return {
      articles: [],
      user_tier: 'FREE',
      subscription_status: null,
      total_count: 0,
      requires_upgrade: true,
      saved_article_ids: [],
      monthly_generations_used: 0,
      monthly_generation_limit: 3
    };
  }
});

/**
 * Fetch user data on the server with caching
 */
export const prefetchUser = cache(async (kindeId: string) => {
  try {
    const supabase = await createClient();

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('kinde_id', kindeId)
      .single();

    if (!user) {
      // Create user if doesn't exist
      const { getUser } = getKindeServerSession();
      const kindeUser = await getUser();

      if (!kindeUser) return null;

      const now = new Date().toISOString();
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          kinde_id: kindeUser.id,
          email: kindeUser.email,
          firstName: kindeUser.given_name || 'Not Set',
          lastName: kindeUser.family_name || 'Not Set',
          name: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim() || 'Not Set',
          subscription_tier: 'free',
          createdAt: now,
          updatedAt: now,
        })
        .select('*')
        .single();

      return newUser;
    }

    return user;
  } catch (error) {
    console.error('Error prefetching user:', error);
    return null;
  }
});