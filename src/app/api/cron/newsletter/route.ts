import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, EMAIL_CONFIG, generateNewsletterSubject, generateUnsubscribeUrl } from '@/lib/email/resend';
import { personalizeContent } from '@/lib/ai/personalize';

export async function GET(req: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Get today's published newsletter
    const today = new Date().toISOString().split('T')[0];
    const { data: todaysPost } = await supabase
      .from('newsletter_posts')
      .select('*')
      .eq('publishedStatus', 'PUBLISHED')
      .gte('publishedAt', today)
      .order('publishedAt', { ascending: false })
      .limit(1)
      .single();

    if (!todaysPost) {
      return NextResponse.json({
        message: 'No newsletter published for today',
        date: today
      });
    }

    // Get all active subscribers who have completed onboarding
    const { data: subscribers } = await supabase
      .from('users')
      .select('*')
      .eq('has_completed_onboarding', true)
      .eq('status', 'active')
      .not('subscription_status', 'eq', 'canceled');

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: 'No active subscribers found',
        postId: todaysPost.id
      });
    }

    console.log(`Processing newsletter delivery for ${subscribers.length} subscribers`);

    // Filter articles by user category preferences
    const articlesInNewsletter = todaysPost.content?.articles || [];
    const articleCategories = articlesInNewsletter
      .map((article: any) => article.category)
      .filter(Boolean);

    console.log(`Newsletter contains articles from categories: ${articleCategories.join(', ')}`);

    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        try {
          // Filter newsletter content by user's category preferences
          let filteredContent = todaysPost.content;
          const userPreferences = subscriber.category_preferences;

          if (userPreferences && userPreferences.length > 0) {
            // User has preferences - only send articles matching their categories
            const filteredArticles = articlesInNewsletter.filter((article: any) => {
              // If article has no category, include it for all users
              if (!article.category) return true;

              // Check if article category matches user preferences
              return userPreferences.includes(article.category);
            });

            // Skip sending if no articles match user's preferences
            if (filteredArticles.length === 0) {
              console.log(`Skipping ${subscriber.email} - no articles match category preferences`);
              return { success: false, email: subscriber.email, skipped: true };
            }

            // Update content with filtered articles
            filteredContent = {
              ...todaysPost.content,
              articles: filteredArticles
            };

            console.log(`Sending ${filteredArticles.length} filtered articles to ${subscriber.email}`);
          }

          // Generate personalized content if user has TrueTone profile
          let personalizedContent = null;
          if (subscriber.tone_of_voice) {
            // Simple personalization for email - in production, you'd use the full AI pipeline
            personalizedContent = {
              subject: generateNewsletterSubject(todaysPost.title, subscriber.name),
              preheader: `Personalized insights just for ${subscriber.firstName || 'you'}`,
              content: filteredContent
            };
          }

          const unsubscribeUrl = generateUnsubscribeUrl(subscriber.id);

          // Send email
          await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: subscriber.email,
            subject: personalizedContent?.subject || generateNewsletterSubject(todaysPost.title),
            html: generateNewsletterHTML({
              user: {
                id: subscriber.id,
                email: subscriber.email,
                name: subscriber.name,
                firstName: subscriber.firstName
              },
              newsletter: {
                id: todaysPost.id,
                title: todaysPost.title,
                content: filteredContent,
                personalizedContent
              },
              unsubscribeUrl
            })
          });

          // Update user's last active timestamp
          await supabase
            .from('users')
            .update({ last_active: new Date().toISOString() })
            .eq('id', subscriber.id);

          return { success: true, email: subscriber.email };

        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          return { success: false, email: subscriber.email, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success && !r.value.skipped).length;
    const skipped = results.filter(r => r.status === 'fulfilled' && r.value.skipped).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success && !r.value.skipped)).length;

    console.log(`Newsletter delivery complete: ${successful} sent, ${skipped} skipped, ${failed} failed`);

    return NextResponse.json({
      success: true,
      postId: todaysPost.id,
      postTitle: todaysPost.title,
      totalSubscribers: subscribers.length,
      sent: successful,
      skipped,
      failed,
      date: today
    });

  } catch (error) {
    console.error('Newsletter cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to process newsletter delivery' },
      { status: 500 }
    );
  }
}

// Simple HTML email template
function generateNewsletterHTML(data: any): string {
  const { user, newsletter, unsubscribeUrl } = data;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsletter.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        .personalized-badge { display: inline-block; background: #4f46e5; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }
        .article { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e1e5e9; }
        .article:last-child { border-bottom: none; }
        .article h3 { color: #1f2937; margin-top: 0; }
        .unsubscribe { margin-top: 20px; }
        .unsubscribe a { color: #6b7280; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 TrueTone Insights</h1>
        <p>Personalized mortgage insights for ${user.firstName || user.name}</p>
    </div>

    <div class="content">
        ${newsletter.personalizedContent ? '<div class="personalized-badge">✨ Personalized with Your TrueTone</div>' : ''}

        <h2>${newsletter.title}</h2>

        ${generateArticlesHTML(newsletter.content)}

        <div style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
            <h3>💡 Ready to Use This Content?</h3>
            <p>Log in to your TrueTone dashboard to:</p>
            <ul>
                <li>Personalize this content with your unique voice</li>
                <li>Generate email templates, social posts, and video scripts</li>
                <li>Publish directly to your social media accounts</li>
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Open Dashboard →</a></p>
        </div>
    </div>

    <div class="footer">
        <p>This email was sent to ${user.email}</p>
        <div class="unsubscribe">
            <a href="${unsubscribeUrl}">Unsubscribe</a> |
            <a href="${process.env.NEXT_PUBLIC_URL}/settings">Manage Preferences</a>
        </div>
        <p style="margin-top: 10px;">© TrueTone AI - Personalized mortgage marketing content</p>
    </div>
</body>
</html>
  `.trim();
}

function generateArticlesHTML(content: any): string {
  if (!content || !content.articles) {
    return '<p>No articles available today.</p>';
  }

  return content.articles
    .filter((article: any) => article.content_type === 'article')
    .map((article: any) => `
      <div class="article">
        <h3>${article.title}</h3>
        <p><strong>Summary:</strong> ${article.summary}</p>

        ${article.key_insights ? `
        <div style="margin: 15px 0;">
          <h4>Key Insights:</h4>
          <ul>
            ${article.key_insights.map((insight: string) => `<li>${insight}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `).join('');
}