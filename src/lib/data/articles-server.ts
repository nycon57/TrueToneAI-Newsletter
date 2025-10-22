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
}

/**
 * Fetch articles on the server with caching
 * Uses React's cache() to deduplicate requests within the same render
 */
export const prefetchArticles = cache(async (params: FetchArticlesParams) => {
  const { industry, category, tags, saved, isAuthenticated = false, limit = 50 } = params;

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

    // Optimize with LEFT JOIN for personalizations
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

    const { data: articlesWithPersonalizations } = await query;

    // Process and filter personalizations
    const enrichedArticles = articlesWithPersonalizations?.map(article => {
      const personalizations = Array.isArray(article.personalized_outputs)
        ? article.personalized_outputs
        : (article.personalized_outputs ? [article.personalized_outputs] : []);

      const personalization = personalizations.find(p => p?.user_id === user.id);
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

    return {
      articles: enrichedArticles || [],
      user_tier: subscriptionStatus?.tier || user.subscription_tier,
      subscription_status: subscriptionStatus?.status || null,
      monthly_generations_used: subscriptionStatus?.monthlyGenerationsUsed || 0,
      monthly_generation_limit: subscriptionStatus?.monthlyGenerationLimit || 0,
      saved_article_ids: user.saved_article_ids || [],
      total_count: enrichedArticles?.length || 0
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