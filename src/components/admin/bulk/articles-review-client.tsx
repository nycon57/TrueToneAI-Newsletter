"use client";

import { useRouter } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BulkSelectionProvider } from "@/lib/contexts/bulk-selection-context";
import { SelectableArticleTable } from "./selectable-article-table";
import { BulkActionsBar } from "./bulk-actions-bar";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  category: string | null;
  tags: string[];
  createdAt: Date;
  submittedAt: Date | null;
  createdBy: {
    name: string | null;
    email: string;
  } | null;
}

interface ArticlesReviewClientProps {
  articles: Article[];
}

export function ArticlesReviewClient({ articles }: ArticlesReviewClientProps) {
  const router = useRouter();

  const handleComplete = () => {
    // Refresh the page to get updated article list
    router.refresh();
  };

  return (
    <BulkSelectionProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-muted-foreground">
            Articles pending approval ({articles.length})
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search articles..." className="pl-8" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Articles Table */}
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
          <SelectableArticleTable articles={articles} />
        )}

        {/* Bulk Actions Bar (shows when items selected) */}
        <BulkActionsBar onComplete={handleComplete} />
      </div>
    </BulkSelectionProvider>
  );
}
