"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewSettings } from "./review-settings";
import { NotificationSettings } from "./notification-settings";
import { toast } from "sonner";

export interface AdminSettings {
  review_sla_hours: number;
  rejection_templates: string[];
  auto_archive_days: number;
  email_on_submission: boolean;
  digest_frequency: 'immediate' | 'daily' | 'weekly';
  admin_emails: string[];
}

const defaultSettings: AdminSettings = {
  review_sla_hours: 48,
  rejection_templates: ['Content quality issues', 'Missing required information', 'Duplicate content', 'Off-topic', 'Needs revision'],
  auto_archive_days: 0,
  email_on_submission: true,
  digest_frequency: 'immediate',
  admin_emails: [],
};

export function SettingsPageClient() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings({ ...defaultSettings, ...data.settings });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updates: Partial<AdminSettings>) => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSettings((prev) => ({ ...prev, ...updates }));
      toast.success('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      <ReviewSettings
        settings={settings}
        onSave={handleSave}
        isSaving={isSaving}
      />
      <NotificationSettings
        settings={settings}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
