"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import {
  Pencil,
  Check,
  X,
  Loader2,
  Calendar as CalendarIcon,
  Tag,
  User,
  Folder,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Author {
  id: string;
  name: string | null;
  email: string;
}

interface EditableMetadataSectionProps {
  articleId: string;
  tags: string[];
  category: string | null;
  createdAt: string;
  createdBy: Author | null;
  availableCategories?: string[];
  availableAuthors?: Author[];
  onSave: (field: string, value: unknown) => Promise<void>;
}

// Predefined categories - can be extended
const DEFAULT_CATEGORIES = [
  "Mortgage",
  "Real Estate",
  "Personal Finance",
  "Market Update",
  "Industry News",
  "Tips & Advice",
];

export function EditableMetadataSection({
  articleId,
  tags,
  category,
  createdAt,
  createdBy,
  availableCategories = DEFAULT_CATEGORIES,
  availableAuthors = [],
  onSave,
}: EditableMetadataSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Edit states
  const [editTags, setEditTags] = useState<string[]>(tags);
  const [editCategory, setEditCategory] = useState<string>(category || "");
  const [editCreatedAt, setEditCreatedAt] = useState<Date>(
    new Date(createdAt)
  );
  const [editAuthorId, setEditAuthorId] = useState<string>(createdBy?.id || "");
  const [newTagInput, setNewTagInput] = useState("");

  // Reset when props change
  useEffect(() => {
    setEditTags(tags);
    setEditCategory(category || "");
    setEditCreatedAt(new Date(createdAt));
    setEditAuthorId(createdBy?.id || "");
    setHasChanges(false);
  }, [tags, category, createdAt, createdBy]);

  const checkForChanges = () => {
    const tagsChanged = JSON.stringify(editTags) !== JSON.stringify(tags);
    const categoryChanged = editCategory !== (category || "");
    const dateChanged =
      editCreatedAt.toISOString() !== new Date(createdAt).toISOString();
    const authorChanged = editAuthorId !== (createdBy?.id || "");
    setHasChanges(tagsChanged || categoryChanged || dateChanged || authorChanged);
  };

  useEffect(() => {
    checkForChanges();
  }, [editTags, editCategory, editCreatedAt, editAuthorId]);

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      // Save each changed field
      const promises: Promise<void>[] = [];

      if (JSON.stringify(editTags) !== JSON.stringify(tags)) {
        promises.push(onSave("tags", editTags));
      }
      if (editCategory !== (category || "")) {
        promises.push(onSave("category", editCategory || null));
      }
      if (editCreatedAt.toISOString() !== new Date(createdAt).toISOString()) {
        promises.push(onSave("created_at", editCreatedAt.toISOString()));
      }
      if (editAuthorId !== (createdBy?.id || "")) {
        promises.push(onSave("created_by_admin_id", editAuthorId || null));
      }

      await Promise.all(promises);
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTags(tags);
    setEditCategory(category || "");
    setEditCreatedAt(new Date(createdAt));
    setEditAuthorId(createdBy?.id || "");
    setNewTagInput("");
    setIsEditing(false);
    setHasChanges(false);
  };

  const addTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed]);
      setNewTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="group relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Article Details
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
            className="space-y-5 rounded-lg border-2 border-violet-500/30 bg-background/80 p-4"
          >
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5" />
                Category
              </label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addTag}
                  disabled={!newTagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Author */}
            {availableAuthors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Author
                </label>
                <Select value={editAuthorId} onValueChange={setEditAuthorId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAuthors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name || author.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Created Date */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Created Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editCreatedAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editCreatedAt ? (
                      format(editCreatedAt, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editCreatedAt}
                    onSelect={(date) => date && setEditCreatedAt(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  Category
                </span>
                <p className="text-sm font-medium">
                  {category || (
                    <span className="text-muted-foreground italic">
                      No category
                    </span>
                  )}
                </p>
              </div>

              {/* Author */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Author
                </span>
                <p className="text-sm font-medium">
                  {createdBy?.name || createdBy?.email || (
                    <span className="text-muted-foreground italic">
                      Unknown
                    </span>
                  )}
                </p>
              </div>

              {/* Created Date */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Created
                </span>
                <p className="text-sm font-medium">
                  {format(new Date(createdAt), "MMM d, yyyy")}
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-1 col-span-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No tags
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
