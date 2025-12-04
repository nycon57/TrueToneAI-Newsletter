"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditableContentBlock } from "@/components/admin/editable/editable-content-block";
import { EditableListBlock } from "@/components/admin/editable/editable-list-block";
import { EditableSocialBlock } from "@/components/admin/editable/editable-social-block";
import { EditableMetadataSection } from "@/components/admin/editable/editable-metadata-section";

interface Author {
  id: string;
  name: string | null;
  email: string;
}

interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  created_at: string | null;
  created_by_admin_id: string | null;
  default_key_insights: string[] | null;
  default_video_script: string | null;
  default_email_template: string | null;
  default_social_content: Record<string, string> | null;
  createdBy: Author | null;
}

interface ArticleContentEditorProps {
  article: Article;
  availableAuthors?: Author[];
}

export function ArticleContentEditor({ article, availableAuthors = [] }: ArticleContentEditorProps) {
  const router = useRouter();

  const handleSave = async (field: string, value: unknown) => {
    const response = await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.error || "Failed to save changes");
      throw new Error(error.error);
    }

    toast.success("Changes saved successfully");
    router.refresh();
  };

  // Ensure createdBy has an id for the metadata section
  const createdByWithId = article.createdBy && article.created_by_admin_id
    ? { ...article.createdBy, id: article.created_by_admin_id }
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Editable Metadata Section */}
        <EditableMetadataSection
          articleId={article.id}
          tags={article.tags || []}
          category={article.category}
          createdAt={article.created_at || new Date().toISOString()}
          createdBy={createdByWithId}
          availableAuthors={availableAuthors}
          onSave={handleSave}
        />

        <Separator />

        {/* Full Content - Markdown */}
        <EditableContentBlock
          label="Full Content"
          value={article.content || ""}
          field="content"
          articleId={article.id}
          renderMarkdown={true}
          onSave={handleSave}
        />

        {/* Key Insights - Editable List */}
        <EditableListBlock
          label="Key Insights"
          items={article.default_key_insights || []}
          field="default_key_insights"
          articleId={article.id}
          onSave={handleSave}
        />

        {/* Video Script */}
        <EditableContentBlock
          label="Video Script"
          value={article.default_video_script || ""}
          field="default_video_script"
          articleId={article.id}
          renderMarkdown={false}
          onSave={handleSave}
        />

        {/* Email Template */}
        <EditableContentBlock
          label="Email Template"
          value={article.default_email_template || ""}
          field="default_email_template"
          articleId={article.id}
          renderMarkdown={false}
          onSave={handleSave}
        />

        {/* Social Content */}
        <EditableSocialBlock
          label="Social Media Content"
          content={article.default_social_content || {}}
          field="default_social_content"
          articleId={article.id}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
}
