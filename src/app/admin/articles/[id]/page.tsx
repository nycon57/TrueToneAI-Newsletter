import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { ArticleStatusBadge } from "@/components/admin/article-status-badge";
import { ApprovalActions } from "@/components/admin/approval-actions";
import { ReviewHistoryTimeline } from "@/components/admin/review-history-timeline";
import { Calendar, User, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      lastEditedBy: { select: { name: true, email: true } },
    },
  });

  if (!article) {
    return null;
  }

  return article;
}

export default async function ArticleReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{article.title}</h2>
            <ArticleStatusBadge status={article.status} />
          </div>
          <p className="mt-2 text-muted-foreground">{article.summary}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Article Details */}
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {article.createdBy?.name || article.createdBy?.email || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {article.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{article.category}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Content */}
              {article.content && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Full Content</h4>
                  <div className="prose prose-sm max-w-none rounded-lg border bg-muted/50 p-4">
                    {article.content}
                  </div>
                </div>
              )}

              {/* Key Insights */}
              {article.defaultKeyInsights.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                  <ul className="space-y-2 rounded-lg border bg-muted/50 p-4">
                    {article.defaultKeyInsights.map((insight, index) => (
                      <li key={index} className="text-sm flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video Script */}
              {article.defaultVideoScript && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Video Script</h4>
                  <div className="rounded-lg border bg-muted/50 p-4 text-sm whitespace-pre-wrap">
                    {article.defaultVideoScript}
                  </div>
                </div>
              )}

              {/* Email Template */}
              {article.defaultEmailTemplate && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Email Template</h4>
                  <div className="rounded-lg border bg-muted/50 p-4 text-sm whitespace-pre-wrap">
                    {article.defaultEmailTemplate}
                  </div>
                </div>
              )}

              {/* Social Content */}
              {article.defaultSocialContent && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Social Media Content</h4>
                  <div className="grid gap-4 rounded-lg border bg-muted/50 p-4">
                    {Object.entries(
                      article.defaultSocialContent as Record<string, string>
                    ).map(([platform, content]) => (
                      <div key={platform}>
                        <div className="text-xs font-medium uppercase text-muted-foreground mb-1">
                          {platform}
                        </div>
                        <div className="text-sm">{content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Approval Actions */}
          <ApprovalActions articleId={article.id} currentStatus={article.status} />

          {/* Review History */}
          <ReviewHistoryTimeline article={article} />
        </div>
      </div>
    </div>
  );
}
