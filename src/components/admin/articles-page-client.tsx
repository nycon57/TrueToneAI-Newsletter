"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BulkSelectionProvider } from "@/lib/contexts/bulk-selection-context";
import { SelectableArticleTable } from "./bulk/selectable-article-table";
import { BulkActionsBar } from "./bulk/bulk-actions-bar";
import { ArticlesFilterToolbar } from "./articles-filter-toolbar";
import { FileText, CheckCircle, Archive, Layers } from "lucide-react";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  category: string | null;
  tags: string[];
  createdAt: Date;
  submittedAt: Date | null;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
  createdBy: {
    name: string | null;
    email: string;
  } | null;
}

interface StatusCounts {
  all: number;
  draft: number;
  published: number;
  archived: number;
}

interface ArticlesPageClientProps {
  articles: Article[];
  counts: StatusCounts;
  currentStatus: string;
}

const statusConfig = {
  all: { label: "All Articles", icon: Layers, emptyMessage: "No articles found" },
  draft: { label: "Pending Review", icon: FileText, emptyMessage: "No articles pending review" },
  published: { label: "Published", icon: CheckCircle, emptyMessage: "No published articles" },
  archived: { label: "Archived", icon: Archive, emptyMessage: "No archived articles" },
};

export function ArticlesPageClient({ articles, counts, currentStatus }: ArticlesPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.draft;

  // Filter articles by search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query) ||
        article.category?.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  const handleComplete = () => {
    router.refresh();
  };

  return (
    <BulkSelectionProvider>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground mt-1">
            Manage all articles across different statuses
          </p>
        </div>

        {/* Filter Toolbar */}
        <ArticlesFilterToolbar counts={counts} onSearchChange={setSearchQuery} />

        {/* Articles Table */}
        {filteredArticles.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <config.icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchQuery ? "No matching articles found" : config.emptyMessage}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : currentStatus === "draft"
                  ? "New articles will appear here when submitted"
                  : `${config.label} articles will appear here`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <SelectableArticleTable articles={filteredArticles} showStatus={currentStatus === "all"} />
        )}

        {/* Bulk Actions Bar (shows when items selected) */}
        <BulkActionsBar onComplete={handleComplete} />
      </div>
    </BulkSelectionProvider>
  );
}
