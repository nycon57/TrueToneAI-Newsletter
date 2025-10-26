import { NextRequest, NextResponse } from 'next/server';
import { getCachedApiUserSafe } from '@/lib/api/auth-cached';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/stripe/subscription-guards';

/**
 * GET /api/articles/[id]
 * Fetch a single article by ID with user's personalized content if available
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Check if user is authenticated
    const user = await getCachedApiUserSafe();
    const isAuthenticated = !!user;

    const supabase = await createClient();

    // Fetch the article
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      console.error('Error fetching article:', error);
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Check subscription status for authenticated users
    let subscriptionStatus = null;
    if (isAuthenticated && user) {
      subscriptionStatus = await getUserSubscriptionStatus(user.id);
    }

    const canAccessPaidFeatures = subscriptionStatus?.canAccessPaidFeatures || false;

    // FREE/UNAUTHENTICATED: Return default content only
    if (!isAuthenticated || !user || !canAccessPaidFeatures) {
      const response = NextResponse.json({
        article: {
          id: article.id,
          title: article.title,
          summary: article.summary,
          content: article.content, // Full markdown article content for modal
          content_type: article.content_type,
          industry: article.industry,
          category: article.category,
          tags: article.tags || [],
          published_at: article.published_at,
          // Free users get default content
          keyInsights: article.default_key_insights || [],
          videoScript: article.default_video_script || '',
          emailTemplate: article.default_email_template || '',
          socialContent: article.default_social_content || {},
          is_personalized: false,
          tier: subscriptionStatus?.tier || 'FREE',
        }
      });

      // Cache for 1 minute for free/unauthenticated users
      response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

      return response;
    }

    // PAID: Fetch user's personalized content (generations)
    const { data: generations } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .eq('article_id', id);

    const articleGenerations = generations || [];

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
      socialPlatforms: socialGens.map(g => g.platform).filter(Boolean)
    };

    const response = NextResponse.json({
      article: {
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content, // Full markdown article content for modal
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
        generation_stats: generationStats
      }
    });

    // Cache for 5 minutes for authenticated paid users
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return response;

  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
