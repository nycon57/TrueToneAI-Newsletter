import { createClient } from "@/lib/supabase/server";
import { ArticlesPageClient } from "@/components/admin/articles-page-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

async function getArticles(status: string = "draft") {
  const supabase = await createClient();

  // Build query - support 'all' status to fetch all articles
  let query = supabase
    .from("articles")
    .select("*, createdBy:users!created_by_admin_id(name, email)")
    .order("created_at", { ascending: false });

  // Only filter by status if not 'all'
  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: articles, error } = await query;

  if (error || !articles) {
    console.error("Error fetching articles:", error);
    return { articles: [], counts: { all: 0, draft: 0, published: 0, archived: 0 } };
  }

  // Get counts for all statuses
  const { data: allArticles } = await supabase
    .from("articles")
    .select("status");

  const counts = { all: 0, draft: 0, published: 0, archived: 0 };
  allArticles?.forEach((article) => {
    const s = article.status as keyof typeof counts;
    if (counts[s] !== undefined) {
      counts[s]++;
    }
    counts.all++;
  });

  // Transform to plain objects for client component
  const transformedArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    status: article.status,
    category: article.category,
    tags: article.tags,
    createdAt: article.created_at,
    submittedAt: article.submitted_at,
    publishedAt: article.published_at,
    archivedAt: article.archived_at,
    createdBy: article.createdBy,
  }));

  return { articles: transformedArticles, counts };
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status || "draft";
  const { articles, counts } = await getArticles(status);

  return <ArticlesPageClient articles={articles} counts={counts} currentStatus={status} />;
}
