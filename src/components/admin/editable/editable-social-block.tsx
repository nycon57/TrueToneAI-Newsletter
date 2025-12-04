"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Check, X, Loader2, Linkedin } from "lucide-react";
import { SiX, SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SocialContent {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

interface EditableSocialBlockProps {
  label: string;
  content: SocialContent;
  field: string;
  articleId: string;
  className?: string;
  onSave?: (field: string, value: SocialContent) => Promise<void>;
}

const platformConfig = {
  twitter: {
    label: "X (Twitter)",
    icon: SiX,
    color: "text-foreground",
    bg: "bg-foreground/5",
  },
  facebook: {
    label: "Facebook",
    icon: SiFacebook,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-700",
    bg: "bg-blue-700/10",
  },
  instagram: {
    label: "Instagram",
    icon: SiInstagram,
    color: "text-pink-600",
    bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
  },
};

export function EditableSocialBlock({
  label,
  content,
  field,
  articleId,
  className,
  onSave,
}: EditableSocialBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<SocialContent>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(field, editContent);
      } else {
        const response = await fetch(`/api/admin/articles/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: editContent }),
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
    setEditContent(content);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handlePlatformChange = (platform: string, value: string) => {
    setEditContent({ ...editContent, [platform]: value });
    setHasChanges(true);
  };

  const platforms = Object.keys(platformConfig) as (keyof typeof platformConfig)[];

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
            className="space-y-4"
          >
            {platforms.map((platform) => {
              const config = platformConfig[platform];
              const Icon = config.icon;
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", config.color)} />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                  <Textarea
                    value={editContent[platform] || ""}
                    onChange={(e) => handlePlatformChange(platform, e.target.value)}
                    className="min-h-[80px] border-2 border-violet-500/30 focus:border-violet-500"
                    placeholder={`${config.label} content...`}
                  />
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "rounded-lg border bg-muted/30",
              "transition-all duration-200",
              "hover:bg-muted/50 hover:border-muted-foreground/20",
              "cursor-pointer"
            )}
            onClick={() => setIsEditing(true)}
          >
            <div className="grid grid-cols-1 divide-y">
              {platforms.map((platform) => {
                const config = platformConfig[platform];
                const Icon = config.icon;
                const platformContent = content[platform];
                return (
                  <div key={platform} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("p-1.5 rounded-md", config.bg)}>
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">
                      {platformContent || (
                        <span className="text-muted-foreground italic">No content</span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
