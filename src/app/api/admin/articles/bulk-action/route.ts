import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { checkAndTriggerNewsletter } from "@/lib/newsletter/trigger";
import {
  sendArticleApprovedNotification,
  sendArticleRejectedNotification,
} from "@/emails/service/send";
import { logArticleActivity } from "@/lib/admin/activity-logger";

interface BulkActionRequest {
  action: "approve" | "reject";
  articleIds: string[];
  reviewNotes?: string;
  rejectionReason?: string;
}

interface BulkActionResult {
  success: boolean;
  processed: number;
  failed: string[];
  errors: Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();

    // Check admin role (both admin and super_admin can perform bulk actions)
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body: BulkActionRequest = await req.json();
    const { action, articleIds, reviewNotes, rejectionReason } = body;

    // Validate request
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { error: "No articles selected" },
        { status: 400 }
      );
    }

    if (action === "reject" && !rejectionReason?.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required when rejecting articles" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const result: BulkActionResult = {
      success: true,
      processed: 0,
      failed: [],
      errors: {},
    };

    const now = new Date().toISOString();

    // Process each article
    for (const articleId of articleIds) {
      try {
        // Fetch article with creator details
        const { data: article, error: fetchError } = await supabase
          .from("articles")
          .select(
            `
            *,
            createdBy:created_by_admin_id(name, email)
          `
          )
          .eq("id", articleId)
          .eq("status", "draft")
          .single();

        if (fetchError || !article) {
          result.failed.push(articleId);
          result.errors[articleId] = "Article not found or already processed";
          continue;
        }

        // Prepare update data
        const updateData =
          action === "approve"
            ? {
                status: "published" as const,
                published_at: now,
                reviewed_at: now,
                last_edited_by_admin_id: user.id,
                review_notes: reviewNotes || null,
              }
            : {
                status: "draft" as const, // Keep as draft for revision
                reviewed_at: now,
                rejection_reason: rejectionReason,
                review_notes: reviewNotes || null,
                last_edited_by_admin_id: user.id,
              };

        // Update the article
        const { error: updateError } = await supabase
          .from("articles")
          .update(updateData)
          .eq("id", articleId);

        if (updateError) {
          result.failed.push(articleId);
          result.errors[articleId] = updateError.message;
          continue;
        }

        result.processed++;

        // Send email notification (don't fail if email fails)
        try {
          const creatorEmail = article.createdBy?.email;
          const creatorName = article.createdBy?.name || "User";

          if (creatorEmail) {
            if (action === "approve") {
              await sendArticleApprovedNotification({
                to: creatorEmail,
                creatorName,
                articleTitle: article.title,
                articleSummary: article.summary || undefined,
                reviewNotes: reviewNotes || undefined,
                reviewedBy: user.name || user.email,
                articleUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/articles/${article.id}`,
              });
            } else {
              await sendArticleRejectedNotification({
                to: creatorEmail,
                creatorName,
                articleTitle: article.title,
                articleSummary: article.summary || undefined,
                rejectionReason: rejectionReason!,
                reviewNotes: reviewNotes || undefined,
                reviewedBy: user.name || user.email,
                editArticleUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/articles/${article.id}`,
              });
            }
          }
        } catch (emailError) {
          console.error(
            `[Bulk Action] Failed to send email for article ${articleId}:`,
            emailError
          );
          // Don't fail the action if email fails
        }

        // Log admin activity
        try {
          await logArticleActivity(
            action === "approve" ? "approved" : "rejected",
            articleId,
            article.title,
            user.id,
            action === "reject" ? { rejection_reason: rejectionReason, bulk_action: true } : { bulk_action: true }
          );
        } catch (activityError) {
          console.error(`[Bulk Action] Failed to log activity for article ${articleId}:`, activityError);
          // Don't fail if activity logging fails
        }
      } catch (articleError) {
        console.error(`[Bulk Action] Error processing article ${articleId}:`, articleError);
        result.failed.push(articleId);
        result.errors[articleId] =
          articleError instanceof Error ? articleError.message : "Unknown error";
      }
    }

    // After bulk approval, check if we should trigger newsletter
    if (action === "approve" && result.processed > 0) {
      try {
        await checkAndTriggerNewsletter();
      } catch (triggerError) {
        console.error("[Bulk Action] Newsletter trigger error:", triggerError);
        // Don't fail the bulk action if newsletter trigger fails
      }
    }

    // Set success to false if all articles failed
    if (result.processed === 0 && result.failed.length > 0) {
      result.success = false;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Bulk Action] Error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process bulk action" },
      { status: 500 }
    );
  }
}
