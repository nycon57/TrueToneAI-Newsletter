/**
 * Admin Reminder Cron Job
 *
 * Sends daily digest email to admins with articles pending review.
 * Configure this endpoint in Vercel Cron or use an external scheduler.
 *
 * Example Vercel Cron configuration in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/admin-reminders",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 *
 * Schedule: Daily at 9:00 AM
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminEmails, isAdminEmailConfigured } from '@/lib/admin/config';
import { sendPendingReviewDigest } from '@/emails/service/send';
import type { PendingArticle } from '@/emails/service/send';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (optional but recommended for security)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if admin emails are configured
    if (!isAdminEmailConfigured()) {
      console.warn('[Admin Reminders] No admin emails configured. Skipping reminder.');
      return NextResponse.json({
        success: false,
        message: 'No admin emails configured',
      });
    }

    const adminEmails = getAdminEmails();
    console.log(`[Admin Reminders] Checking for pending articles. Admins: ${adminEmails.length}`);

    const supabase = await createClient();

    // Fetch all draft articles with creator details
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        summary,
        submitted_at,
        created_at,
        createdBy:created_by_admin_id(name, email)
      `)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Reminders] Error fetching articles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    if (!articles || articles.length === 0) {
      console.log('[Admin Reminders] No pending articles found.');
      return NextResponse.json({
        success: true,
        message: 'No pending articles',
        count: 0,
      });
    }

    // Calculate days waiting and prepare article data
    const now = new Date();
    const pendingArticles: PendingArticle[] = articles.map((article) => {
      const submittedDate = article.submitted_at
        ? new Date(article.submitted_at)
        : new Date(article.created_at);
      const daysWaiting = Math.floor(
        (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: article.id,
        title: article.title,
        summary: article.summary || undefined,
        creatorName: article.createdBy?.name || article.createdBy?.email || 'Unknown',
        submittedAt: submittedDate,
        daysWaiting,
        reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/articles/${article.id}`,
      };
    });

    // Send digest email
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/articles`;

    const emailResult = await sendPendingReviewDigest({
      to: adminEmails,
      pendingArticles,
      totalCount: articles.length,
      dashboardUrl,
    });

    if (!emailResult.success) {
      console.error('[Admin Reminders] Failed to send digest email:', emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          details: emailResult.error,
        },
        { status: 500 }
      );
    }

    console.log(
      `[Admin Reminders] Digest sent successfully. Articles: ${articles.length}, Recipients: ${adminEmails.length}`
    );

    return NextResponse.json({
      success: true,
      message: 'Reminder sent successfully',
      count: articles.length,
      recipients: adminEmails.length,
    });
  } catch (error) {
    console.error('[Admin Reminders] Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
