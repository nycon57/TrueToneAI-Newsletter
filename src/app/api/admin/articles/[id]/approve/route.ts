import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/server';
import { checkAndTriggerNewsletter } from '@/lib/newsletter/trigger';
import {
  sendArticleApprovedNotification,
  sendArticleRejectedNotification,
} from '@/emails/service/send';
import { logArticleActivity } from '@/lib/admin/activity-logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser();

    // Check admin role (admin or super_admin)
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({
        error: 'Unauthorized. Admin access required.'
      }, { status: 403 });
    }

    const { id } = await params;
    const { action, rejectionReason, reviewNotes } = await req.json();

    if (!['approve', 'reject', 'unpublish'].includes(action)) {
      return NextResponse.json({
        error: 'Invalid action. Must be "approve", "reject", or "unpublish"'
      }, { status: 400 });
    }

    // Validate rejection reason if rejecting
    if (action === 'reject' && !rejectionReason?.trim()) {
      return NextResponse.json({
        error: 'Rejection reason is required when rejecting an article'
      }, { status: 400 });
    }

    const supabase = await createClient();

    // First, get the article with creator details for email notification
    const expectedStatus = action === 'unpublish' ? 'published' : 'draft';
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select(`
        *,
        createdBy:created_by_admin_id(name, email)
      `)
      .eq('id', id)
      .eq('status', expectedStatus)
      .single();

    if (fetchError || !article) {
      return NextResponse.json({
        error: 'Article not found or already processed'
      }, { status: 404 });
    }

    // Prepare update data
    const now = new Date().toISOString();
    let updateData;

    if (action === 'approve') {
      updateData = {
        status: 'published' as const,
        published_at: now,
        reviewed_at: now,
        last_edited_by_admin_id: user.id,
        review_notes: reviewNotes || null,
      };
    } else if (action === 'unpublish') {
      updateData = {
        status: 'draft' as const,
        published_at: null,
        reviewed_at: now,
        last_edited_by_admin_id: user.id,
        review_notes: reviewNotes || null,
      };
    } else {
      updateData = {
        status: 'draft' as const, // Keep as draft for revision
        reviewed_at: now,
        rejection_reason: rejectionReason,
        review_notes: reviewNotes || null,
        last_edited_by_admin_id: user.id,
      };
    }

    // Update the article
    const { data: updatedArticle, error: updateError } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Send email notification (skip for unpublish)
    if (action !== 'unpublish') {
      try {
        const creatorEmail = article.createdBy?.email;
        const creatorName = article.createdBy?.name || 'User';

        if (creatorEmail) {
          if (action === 'approve') {
            await sendArticleApprovedNotification({
              to: creatorEmail,
              creatorName,
              articleTitle: article.title,
              articleSummary: article.summary || undefined,
              reviewNotes: reviewNotes || undefined,
              reviewedBy: user.name || user.email,
              articleUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/articles/${article.id}`,
            });
          } else {
            await sendArticleRejectedNotification({
              to: creatorEmail,
              creatorName,
              articleTitle: article.title,
              articleSummary: article.summary || undefined,
              rejectionReason,
              reviewNotes: reviewNotes || undefined,
              reviewedBy: user.name || user.email,
              editArticleUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/articles/${article.id}`,
            });
          }
          console.log(`[Article Review] Email notification sent to ${creatorEmail} for ${action}`);
        }
      } catch (emailError) {
        console.error('[Article Review] Failed to send email notification:', emailError);
        // Don't fail the approval/rejection if email fails
      }
    }

    // Log admin activity
    try {
      const activityType = action === 'approve' ? 'approved' : action === 'unpublish' ? 'unpublished' : 'rejected';
      await logArticleActivity(
        activityType,
        id,
        article.title,
        user.id,
        action === 'reject' ? { rejection_reason: rejectionReason } : undefined
      );
    } catch (activityError) {
      console.error('[Article Review] Failed to log activity:', activityError);
      // Don't fail if activity logging fails
    }

    // After approval, check if we should trigger newsletter
    let newsletterTrigger = null;
    if (action === 'approve') {
      try {
        newsletterTrigger = await checkAndTriggerNewsletter();
        console.log('Newsletter trigger check:', newsletterTrigger);
      } catch (triggerError) {
        console.error('Newsletter trigger error:', triggerError);
        // Don't fail the approval if newsletter trigger fails
      }
    }

    return NextResponse.json({
      success: true,
      action,
      article: updatedArticle,
      newsletter: newsletterTrigger
    });

  } catch (error) {
    console.error('Article approval error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to process article' }, { status: 500 });
  }
}
