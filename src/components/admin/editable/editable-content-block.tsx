"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

interface EditableContentBlockProps {
  label: string;
  value: string;
  field: string;
  articleId: string;
  renderMarkdown?: boolean;
  className?: string;
  onSave?: (field: string, value: string) => Promise<void>;
}

export function EditableContentBlock({
  label,
  value,
  field,
  articleId,
  renderMarkdown = false,
  className,
  onSave,
}: EditableContentBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
    setHasChanges(false);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(field, editValue);
      } else {
        const response = await fetch(`/api/admin/articles/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: editValue }),
        });
        if (!response.ok) throw new Error("Failed to save");
      }
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleChange = (newValue: string) => {
    setEditValue(newValue);
    setHasChanges(newValue !== value);
  };

  return (
    <div className={cn("group relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          {label}
        </h4>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing-controls"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1.5"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={cn(
                  "h-7 px-3 transition-all",
                  hasChanges
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5 mr-1" />
                )}
                Save
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="edit-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {renderMarkdown ? (
              <RichTextEditor
                value={editValue}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            ) : (
              <Textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => handleChange(e.target.value)}
                className={cn(
                  "min-h-[200px] font-mono text-sm resize-y",
                  "border-2 border-violet-500/50 focus:border-violet-500",
                  "bg-background/80 backdrop-blur-sm",
                  "transition-all duration-200"
                )}
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "rounded-lg border bg-muted/30 p-4",
              "transition-all duration-200",
              "hover:bg-muted/50 hover:border-muted-foreground/20",
              "cursor-pointer"
            )}
            onClick={() => setIsEditing(true)}
          >
            {renderMarkdown ? (
              <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-lg prose-h1:mt-6 prose-h1:mb-3 prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-sm prose-h3:mt-5 prose-h3:mb-2 prose-p:my-4 prose-p:leading-relaxed prose-p:text-foreground/90 prose-strong:text-foreground prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-li:text-foreground/90 [&>:first-child]:mt-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value || "*No content*"}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="text-sm whitespace-pre-wrap text-foreground/90">
                {value || <span className="text-muted-foreground italic">No content</span>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
