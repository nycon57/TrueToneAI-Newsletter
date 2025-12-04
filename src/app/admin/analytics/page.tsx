import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard";

export const dynamic = "force-dynamic";

interface AnalyticsData {
  totalViews: number;
  totalGenerations: number;
  totalUsers: number;
  activeUsers: number;
  generationsByType: {
    type: string;
    count: number;
  }[];
  generationsOverTime: {
    date: string;
    count: number;
  }[];
  topArticles: {
    id: string;
    title: string;
    generationCount: number;
  }[];
  recentActivity: {
    id: string;
    type: string;
    userId: string;
    userName: string;
    articleTitle: string;
    createdAt: string;
  }[];
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get total page views (last 30 days)
  const { count: totalViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("timestamp", thirtyDaysAgo.toISOString());

  // Get total generations
  const { count: totalGenerations } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true });

  // Get total users
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Get active users (generated content in last 30 days)
  const { data: activeUsersData } = await supabase
    .from("generations")
    .select("user_id")
    .gte("generated_at", thirtyDaysAgo.toISOString());

  const activeUsers = new Set(activeUsersData?.map(g => g.user_id) || []).size;

  // Get generations by content type
  const { data: generationsByTypeData } = await supabase
    .from("generations")
    .select("content_type");

  const typeCount: Record<string, number> = {};
  generationsByTypeData?.forEach(g => {
    typeCount[g.content_type] = (typeCount[g.content_type] || 0) + 1;
  });
  const generationsByType = Object.entries(typeCount).map(([type, count]) => ({ type, count }));

  // Get generations over time (last 30 days, grouped by day)
  const { data: generationsTimeData } = await supabase
    .from("generations")
    .select("generated_at")
    .gte("generated_at", thirtyDaysAgo.toISOString())
    .order("generated_at", { ascending: true });

  const dateCount: Record<string, number> = {};
  generationsTimeData?.forEach(g => {
    const date = new Date(g.generated_at).toISOString().split("T")[0];
    dateCount[date] = (dateCount[date] || 0) + 1;
  });
  const generationsOverTime = Object.entries(dateCount).map(([date, count]) => ({ date, count }));

  // Get top articles by generation count
  const { data: topArticlesData } = await supabase
    .from("generations")
    .select("article_id, articles(id, title)")
    .limit(100);

  const articleCount: Record<string, { title: string; count: number }> = {};
  topArticlesData?.forEach(g => {
    const article = g.articles as { id: string; title: string } | null;
    if (article) {
      if (!articleCount[article.id]) {
        articleCount[article.id] = { title: article.title, count: 0 };
      }
      articleCount[article.id].count++;
    }
  });
  const topArticles = Object.entries(articleCount)
    .map(([id, { title, count }]) => ({ id, title, generationCount: count }))
    .sort((a, b) => b.generationCount - a.generationCount)
    .slice(0, 10);

  // Get recent activity (last 10 generations)
  const { data: recentActivityData } = await supabase
    .from("generations")
    .select(`
      id,
      content_type,
      user_id,
      generated_at,
      users(name),
      articles(title)
    `)
    .order("generated_at", { ascending: false })
    .limit(10);

  const recentActivity = (recentActivityData || []).map(g => ({
    id: g.id,
    type: g.content_type,
    userId: g.user_id,
    userName: (g.users as { name: string } | null)?.name || "Unknown",
    articleTitle: (g.articles as { title: string } | null)?.title || "Unknown",
    createdAt: g.generated_at,
  }));

  return {
    totalViews: totalViews || 0,
    totalGenerations: totalGenerations || 0,
    totalUsers: totalUsers || 0,
    activeUsers,
    generationsByType,
    generationsOverTime,
    topArticles,
    recentActivity,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Content performance and user engagement metrics
        </p>
      </div>
      <AnalyticsDashboard data={data} />
    </div>
  );
}
