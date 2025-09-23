import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user (may be null for unauthenticated users)
    let user = null;
    try {
      user = await getApiUser();
    } catch (error) {
      // User not authenticated - continue as free tier
      console.log('User not authenticated, serving free tier content');
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query for articles
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published');

    // Apply category filtering for authenticated users with preferences
    if (user && user.category_preferences && user.category_preferences.length > 0) {
      query = query.in('article_topic', user.category_preferences);
    }

    // Fetch published articles with filtering
    const { data: articles, error } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    // Transform articles to match expected API format
    const transformedArticles = (articles || []).map(article => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      content_type: article.content_type,
      article_topic: article.article_topic,
      category: article.category || null,
      tags: article.tags || [],
      position: article.position || 1,
      image_url: article.image_url || null,
      published_at: article.published_at,

      // Content outputs from default fields
      keyInsights: article.default_key_insights || [],
      videoScript: article.default_video_script || '',
      emailTemplate: article.default_email_template || '',
      socialContent: article.default_social_content || {},

      // Personalization metadata (default for free tier)
      is_personalized: false,
      personalization_id: null,
      last_generated_at: null,
      generation_count: 0,
      truetone_settings: null,
      tier: 'free'
    }));

    if (!user || user.subscription_tier === 'free') {
      // Free users get default content only
      return NextResponse.json({
        articles: transformedArticles,
        user_tier: 'free',
        total_count: transformedArticles.length,
        has_more: transformedArticles.length === limit
      });
    }

    // For paid users, check for personalizations in personalized_outputs table
    if (transformedArticles.length > 0) {
      const { data: personalizations, error: persError } = await supabase
        .from('personalized_outputs')
        .select('*')
        .eq('user_id', user.id);

      if (!persError && personalizations) {
        // Apply personalizations to articles
        transformedArticles.forEach(article => {
          const userPersonalizations = personalizations.filter(p =>
            p.article_id === article.id
          );

          if (userPersonalizations.length > 0) {
            const latestPersonalization = userPersonalizations.sort((a, b) =>
              new Date(b.last_generated_at || b.created_at).getTime() - new Date(a.last_generated_at || a.created_at).getTime()
            )[0];

            // Apply personalized content if available
            if (latestPersonalization.personalized_key_insights) {
              article.keyInsights = latestPersonalization.personalized_key_insights;
            }
            if (latestPersonalization.personalized_video_script) {
              article.videoScript = latestPersonalization.personalized_video_script;
            }
            if (latestPersonalization.personalized_email_template) {
              article.emailTemplate = latestPersonalization.personalized_email_template;
            }
            if (latestPersonalization.personalized_social_content) {
              article.socialContent = latestPersonalization.personalized_social_content;
            }

            article.is_personalized = true;
            article.last_generated_at = latestPersonalization.last_generated_at;
            article.generation_count = latestPersonalization.generation_count;
            article.truetone_settings = latestPersonalization.truetone_settings;
            article.tier = user.subscription_tier || 'paid';
          }
        });
      }
    }

    // Get user's usage stats for paid users
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const { data: usageData, error: usageError } = await supabase
      .from('personalized_outputs')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonth}-01T00:00:00.000Z`)
      .lt('created_at', `${currentMonth}-31T23:59:59.999Z`);

    const monthlyGenerationsUsed = usageData?.length || 0;
    const monthlyGenerationLimit = user.subscription_tier === 'premium' ? 100 : 25;

    return NextResponse.json({
      articles: transformedArticles,
      user_tier: user.subscription_tier || 'paid',
      user_id: user.id,
      monthly_generations_used: monthlyGenerationsUsed,
      monthly_generation_limit: monthlyGenerationLimit,
      total_count: transformedArticles.length,
      has_more: transformedArticles.length === limit
    });

  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}