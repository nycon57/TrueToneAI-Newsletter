import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleStatusBadge } from "@/components/admin/article-status-badge";
import { ApprovalActions } from "@/components/admin/approval-actions";
import { ReviewHistoryTimeline } from "@/components/admin/review-history-timeline";
import { ArticleContentEditor } from "@/components/admin/article-content-editor";

export const dynamic = "force-dynamic";

async function getArticle(id: string) {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      createdBy:users!created_by_admin_id(id, name, email),
      lastEditedBy:users!last_edited_by_admin_id(name, email)
    `)
    .eq('id', id)
    .single();

  if (error || !article) {
    return null;
  }

  return article;
}

async function getAdminUsers() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email')
    .in('role', ['admin', 'super_admin'])
    .order('name');

  if (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }

  return users || [];
}

export default async function ArticleReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, adminUsers] = await Promise.all([
    getArticle(id),
    getAdminUsers(),
  ]);

  if (!article) {
    notFound();
  }

  // Transform article for components that expect specific types
  const articleForTimeline = {
    id: article.id,
    status: article.status || 'draft',
    createdAt: new Date(article.created_at || Date.now()),
    updatedAt: new Date(article.updated_at || Date.now()),
    submittedAt: article.submitted_at ? new Date(article.submitted_at) : null,
    reviewedAt: article.reviewed_at ? new Date(article.reviewed_at) : null,
    publishedAt: article.published_at ? new Date(article.published_at) : null,
    rejectionReason: article.rejection_reason,
    reviewNotes: article.review_notes,
    createdBy: article.createdBy,
    lastEditedBy: article.lastEditedBy,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <ArticleStatusBadge status={article.status || 'draft'} />
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{article.title}</h2>
        <p className="mt-2 text-muted-foreground">{article.summary}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          <ArticleContentEditor article={article} availableAuthors={adminUsers} />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Approval Actions */}
          <ApprovalActions articleId={article.id} currentStatus={article.status || 'draft'} />

          {/* Review History */}
          <ReviewHistoryTimeline article={articleForTimeline} />
        </div>
      </div>
    </div>
  );
}
