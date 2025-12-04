"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeviceToggle, type DeviceType } from "@/components/admin/preview/device-toggle";
import { DeviceFrame } from "@/components/admin/preview/device-frame";
import { PreviewContentRenderer } from "@/components/admin/preview/preview-content-renderer";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  defaultKeyInsights: string[];
  defaultVideoScript: string | null;
  defaultEmailTemplate: string | null;
  defaultSocialContent: Record<string, string> | null;
  category: string | null;
  tags: string[];
  status: string;
}

export default function ArticlePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceType>("desktop");

  const articleId = params.id as string;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/admin/articles/${articleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Review
        </Button>

        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Article Not Found
            </h2>
            <p className="text-muted-foreground">
              {error || "The requested article could not be found."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Review
          </Button>
          <div className="hidden sm:block h-6 w-px bg-border" />
          <div>
            <h1 className="text-xl font-semibold">Preview Article</h1>
            <p className="text-sm text-muted-foreground truncate max-w-md">
              {article.title}
            </p>
          </div>
        </div>

        <DeviceToggle value={device} onValueChange={setDevice} />
      </div>

      {/* Preview Frame */}
      <div className="bg-muted/50 rounded-xl border min-h-[700px]">
        <DeviceFrame device={device}>
          <PreviewContentRenderer article={article} />
        </DeviceFrame>
      </div>
    </div>
  );
}
