"use client";

import { useState } from "react";
import { Clock, FileText, Archive, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminSettings } from "./settings-page-client";

interface ReviewSettingsProps {
  settings: AdminSettings;
  onSave: (updates: Partial<AdminSettings>) => Promise<void>;
  isSaving: boolean;
}

export function ReviewSettings({ settings, onSave, isSaving }: ReviewSettingsProps) {
  const [slaHours, setSlaHours] = useState(settings.review_sla_hours);
  const [autoArchiveDays, setAutoArchiveDays] = useState(settings.auto_archive_days);
  const [templates, setTemplates] = useState<string[]>(settings.rejection_templates);
  const [newTemplate, setNewTemplate] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handleSlaChange = (value: number) => {
    setSlaHours(value);
    setHasChanges(true);
  };

  const handleAutoArchiveChange = (value: number) => {
    setAutoArchiveDays(value);
    setHasChanges(true);
  };

  const handleAddTemplate = () => {
    if (newTemplate.trim() && !templates.includes(newTemplate.trim())) {
      setTemplates([...templates, newTemplate.trim()]);
      setNewTemplate("");
      setHasChanges(true);
    }
  };

  const handleRemoveTemplate = (index: number) => {
    setTemplates(templates.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave({
      review_sla_hours: slaHours,
      auto_archive_days: autoArchiveDays,
      rejection_templates: templates,
    });
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review Workflow
        </CardTitle>
        <CardDescription>
          Configure how articles are reviewed and managed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review SLA */}
        <div className="space-y-2">
          <Label htmlFor="sla-hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Review SLA Reminder (hours)
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="sla-hours"
              type="number"
              min={1}
              max={168}
              value={slaHours}
              onChange={(e) => handleSlaChange(parseInt(e.target.value) || 48)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              Articles will be flagged as urgent after {slaHours} hours without review
            </span>
          </div>
        </div>

        {/* Auto-Archive */}
        <div className="space-y-2">
          <Label htmlFor="auto-archive" className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            Auto-Archive (days)
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="auto-archive"
              type="number"
              min={0}
              max={365}
              value={autoArchiveDays}
              onChange={(e) => handleAutoArchiveChange(parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              {autoArchiveDays === 0
                ? "Articles will not be auto-archived"
                : `Published articles will auto-archive after ${autoArchiveDays} days`}
            </span>
          </div>
        </div>

        {/* Rejection Templates */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Rejection Reason Templates
          </Label>
          <p className="text-sm text-muted-foreground">
            Predefined reasons for quick selection when rejecting articles
          </p>

          <div className="flex flex-wrap gap-2">
            {templates.map((template, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 py-1.5 px-3"
              >
                {template}
                <button
                  onClick={() => handleRemoveTemplate(index)}
                  className="ml-1 hover:text-destructive transition-colors"
                  aria-label={`Remove "${template}"`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={newTemplate}
              onChange={(e) => setNewTemplate(e.target.value)}
              placeholder="Add rejection reason..."
              className="flex-1 max-w-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddTemplate()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddTemplate}
              disabled={!newTemplate.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
