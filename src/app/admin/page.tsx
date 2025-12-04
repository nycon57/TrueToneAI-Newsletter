import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { FileText, CheckCircle, Clock, Archive, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getArticleStats() {
  const supabase = await createClient();

  const [draftResult, publishedResult, totalResult, recentResult] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase
      .from('articles')
      .select('*, createdBy:users!created_by_admin_id(name, email)')
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    draftCount: draftResult.count ?? 0,
    publishedCount: publishedResult.count ?? 0,
    archivedCount: (totalResult.count ?? 0) - (draftResult.count ?? 0) - (publishedResult.count ?? 0),
    totalCount: totalResult.count ?? 0,
    recentArticles: recentResult.data ?? [],
  };
}

export default async function AdminDashboard() {
  const stats = await getArticleStats();

  const statCards = [
    {
      title: "Pending Review",
      value: stats.draftCount,
      description: "Articles awaiting review",
      icon: Clock,
      color: "text-yellow-600",
      href: "/admin/articles",
    },
    {
      title: "Published",
      value: stats.publishedCount,
      description: "Live articles",
      icon: CheckCircle,
      color: "text-green-600",
      href: "/admin/articles/published",
    },
    {
      title: "Archived",
      value: stats.archivedCount,
      description: "Archived content",
      icon: Archive,
      color: "text-gray-600",
      href: "/admin/articles/archived",
    },
    {
      title: "Total Articles",
      value: stats.totalCount,
      description: "All time",
      icon: FileText,
      color: "text-blue-600",
      href: "/admin/articles",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Manage and review article submissions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Articles Pending Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Latest articles waiting for review
              </CardDescription>
            </div>
            <Link href="/admin/articles">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentArticles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No articles pending review
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.summary?.substring(0, 100)}...
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Created by:{" "}
                        {article.createdBy?.name || article.createdBy?.email}
                      </span>
                      <span>•</span>
                      <span>
                        {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{article.status}</Badge>
                    <Link href={`/admin/articles/${article.id}`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
