import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { ArticleStatusBadge } from "@/components/admin/article-status-badge";

export const dynamic = "force-dynamic";

async function getPendingArticles() {
  const articles = await prisma.article.findMany({
    where: { status: "DRAFT" },
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { name: true, email: true } },
      lastEditedBy: { select: { name: true, email: true } },
    },
  });

  return articles;
}

export default async function ArticlesReviewQueue() {
  const articles = await getPendingArticles();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground">
          Articles pending approval ({articles.length})
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-muted-foreground">
                No articles pending review
              </p>
              <p className="text-sm text-muted-foreground">
                New articles will appear here when submitted
              </p>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <ArticleStatusBadge status={article.status} />
                    </div>
                    <CardDescription className="mt-2">
                      {article.summary}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>
                        Created by:{" "}
                        {article.createdBy?.name || article.createdBy?.email || "Unknown"}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {article.submittedAt && (
                      <span className="text-xs">
                        Submitted:{" "}
                        {new Date(article.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                    {article.category && (
                      <div className="mt-1">
                        <Badge variant="outline">{article.category}</Badge>
                        {article.tags.length > 0 && (
                          <>
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="ml-1">
                                {tag}
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Link href={`/admin/articles/${article.id}`}>
                    <Button>Review Article</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
