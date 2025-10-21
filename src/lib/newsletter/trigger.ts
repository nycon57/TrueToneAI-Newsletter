import { createClient } from '@/lib/supabase/server';

/**
 * Check if today is a newsletter day (Monday, Wednesday, Friday)
 */
export function isNewsletterDay(): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Monday = 1, Wednesday = 3, Friday = 5
  return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
}

/**
 * Get count of approved articles since last newsletter
 */
export async function getApprovedArticlesCount(): Promise<number> {
  const supabase = await createClient();

  // Get the last newsletter sent date
  const { data: lastNewsletter } = await supabase
    .from('newsletter_posts')
    .select('published_at')
    .eq('published_status', 'PUBLISHED')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  const lastNewsletterDate = lastNewsletter?.published_at
    ? new Date(lastNewsletter.published_at)
    : new Date(0); // If no newsletter exists, use epoch

  // Count articles published since last newsletter
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id')
    .eq('status', 'published')
    .gte('published_at', lastNewsletterDate.toISOString());

  if (error) {
    console.error('Error counting approved articles:', error);
    return 0;
  }

  return articles?.length || 0;
}

/**
 * Create newsletter post from approved articles
 */
export async function createNewsletterPost(): Promise<{
  success: boolean;
  newsletterId?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get the last newsletter sent date
    const { data: lastNewsletter } = await supabase
      .from('newsletter_posts')
      .select('published_at')
      .eq('published_status', 'PUBLISHED')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    const lastNewsletterDate = lastNewsletter?.published_at
      ? new Date(lastNewsletter.published_at)
      : new Date(0);

    // Get approved articles since last newsletter
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .gte('published_at', lastNewsletterDate.toISOString())
      .order('published_at', { ascending: false });

    if (articlesError) {
      console.error('Error fetching articles for newsletter:', articlesError);
      return { success: false, error: articlesError.message };
    }

    if (!articles || articles.length === 0) {
      return { success: false, error: 'No articles available for newsletter' };
    }

    // Generate newsletter title
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const title = `TrueTone Insights - ${formattedDate}`;

    // Build newsletter content (compatible with existing Post model structure)
    const newsletterContent = {
      articles: articles.map((article, index) => ({
        id: article.id,
        title: article.title,
        summary: article.summary || '',
        position: index + 1,
        content_type: article.content_type || 'article',
        created_at: article.created_at,
        updated_at: article.updated_at,
        article_topic: article.article_topic,
        category: article.category,
        tags: article.tags || [],
        key_insights: article.default_key_insights || [],
        video_script: article.default_video_script || '',
        email_template: article.default_email_template || '',
        social_content: article.default_social_content || {}
      }))
    };

    // Create newsletter post
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletter_posts')
      .insert({
        title,
        content: newsletterContent,
        published_status: 'PUBLISHED',
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (newsletterError) {
      console.error('Error creating newsletter post:', newsletterError);
      return { success: false, error: newsletterError.message };
    }

    console.log(`Newsletter created successfully: ${newsletter.id}`);
    return { success: true, newsletterId: newsletter.id };

  } catch (error) {
    console.error('Error in createNewsletterPost:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Trigger newsletter send via cron endpoint
 */
export async function triggerNewsletterSend(newsletterId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    if (!cronSecret) {
      console.error('CRON_SECRET not configured');
      return { success: false, error: 'CRON_SECRET not configured' };
    }

    // Call the cron endpoint to send newsletter
    const response = await fetch(`${appUrl}/api/cron/newsletter`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Newsletter send failed:', errorText);
      return { success: false, error: `Newsletter send failed: ${errorText}` };
    }

    const result = await response.json();
    console.log('Newsletter send triggered:', result);

    return { success: true };

  } catch (error) {
    console.error('Error triggering newsletter send:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Main function to check and trigger newsletter if conditions are met
 */
export async function checkAndTriggerNewsletter(): Promise<{
  triggered: boolean;
  reason: string;
  newsletterId?: string;
}> {
  // Check if today is a newsletter day
  if (!isNewsletterDay()) {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    return {
      triggered: false,
      reason: `Today is ${dayName}. Newsletters only send on Monday, Wednesday, and Friday.`
    };
  }

  // Check if we have 3 or more approved articles
  const approvedCount = await getApprovedArticlesCount();

  if (approvedCount < 3) {
    return {
      triggered: false,
      reason: `Only ${approvedCount} article(s) approved since last newsletter. Need 3 to trigger.`
    };
  }

  // Create newsletter post
  const newsletterResult = await createNewsletterPost();

  if (!newsletterResult.success) {
    return {
      triggered: false,
      reason: `Failed to create newsletter: ${newsletterResult.error}`
    };
  }

  // Trigger newsletter send
  const sendResult = await triggerNewsletterSend(newsletterResult.newsletterId!);

  if (!sendResult.success) {
    return {
      triggered: false,
      reason: `Newsletter created but send failed: ${sendResult.error}`,
      newsletterId: newsletterResult.newsletterId
    };
  }

  return {
    triggered: true,
    reason: `Newsletter successfully created and sent with ${approvedCount} articles`,
    newsletterId: newsletterResult.newsletterId
  };
}
