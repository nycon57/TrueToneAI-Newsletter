"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Eye, Sparkles, Users, TrendingUp, FileText, Clock } from "lucide-react";

interface AnalyticsDashboardProps {
  data: {
    totalViews: number;
    totalGenerations: number;
    totalUsers: number;
    activeUsers: number;
    generationsByType: { type: string; count: number }[];
    generationsOverTime: { date: string; count: number }[];
    topArticles: { id: string; title: string; generationCount: number }[];
    recentActivity: {
      id: string;
      type: string;
      userId: string;
      userName: string;
      articleTitle: string;
      createdAt: string;
    }[];
  };
}

const COLORS = ["#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#06b6d4"];

const contentTypeLabels: Record<string, string> = {
  KEY_INSIGHTS: "Key Insights",
  VIDEO_SCRIPT: "Video Script",
  EMAIL_TEMPLATE: "Email Template",
  SOCIAL_MEDIA: "Social Media",
};

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const formattedGenerationsByType = data.generationsByType.map((item) => ({
    name: contentTypeLabels[item.type] || item.type,
    value: item.count,
  }));

  const formattedGenerationsOverTime = data.generationsOverTime.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    generations: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalGenerations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total personalizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Generated content (30d)</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Generations Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Generations Over Time</CardTitle>
            <CardDescription>AI personalizations in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {formattedGenerationsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedGenerationsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="generations"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No generation data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generations by Content Type */}
        <Card>
          <CardHeader>
            <CardTitle>Content Type Breakdown</CardTitle>
            <CardDescription>Distribution of AI personalizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {formattedGenerationsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formattedGenerationsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {formattedGenerationsByType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No generation data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Top Performing Articles
            </CardTitle>
            <CardDescription>Most personalized content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topArticles.length > 0 ? (
                data.topArticles.slice(0, 5).map((article, index) => (
                  <div key={article.id} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{article.title}</p>
                    </div>
                    <Badge variant="secondary">{article.generationCount} generations</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No article data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest AI personalizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName}</span>
                        {" generated "}
                        <Badge variant="outline" className="text-xs">
                          {contentTypeLabels[activity.type] || activity.type}
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.articleTitle}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
