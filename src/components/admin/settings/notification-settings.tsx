"use client";

import { useState } from "react";
import { Bell, Mail, Clock, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { AdminSettings } from "./settings-page-client";

interface NotificationSettingsProps {
  settings: AdminSettings;
  onSave: (updates: Partial<AdminSettings>) => Promise<void>;
  isSaving: boolean;
}

export function NotificationSettings({ settings, onSave, isSaving }: NotificationSettingsProps) {
  const [emailOnSubmission, setEmailOnSubmission] = useState(settings.email_on_submission);
  const [digestFrequency, setDigestFrequency] = useState<'immediate' | 'daily' | 'weekly'>(settings.digest_frequency);
  const [adminEmails, setAdminEmails] = useState<string[]>(settings.admin_emails);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handleEmailToggle = (checked: boolean) => {
    setEmailOnSubmission(checked);
    setHasChanges(true);
  };

  const handleFrequencyChange = (value: 'immediate' | 'daily' | 'weekly') => {
    setDigestFrequency(value);
    setHasChanges(true);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const email = newEmail.trim().toLowerCase();

    if (!email) return;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (adminEmails.includes(email)) {
      setEmailError("This email is already added");
      return;
    }

    setAdminEmails([...adminEmails, email]);
    setNewEmail("");
    setEmailError("");
    setHasChanges(true);
  };

  const handleRemoveEmail = (index: number) => {
    setAdminEmails(adminEmails.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave({
      email_on_submission: emailOnSubmission,
      digest_frequency: digestFrequency,
      admin_emails: adminEmails,
    });
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure how you receive notifications about admin events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email on Submission Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-toggle" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email on New Submission
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive an email when a new article is submitted for review
            </p>
          </div>
          <Switch
            id="email-toggle"
            checked={emailOnSubmission}
            onCheckedChange={handleEmailToggle}
          />
        </div>

        {/* Digest Frequency */}
        <div className="space-y-2">
          <Label htmlFor="digest-frequency" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Digest Frequency
          </Label>
          <p className="text-sm text-muted-foreground">
            How often to receive summary notifications
          </p>
          <Select value={digestFrequency} onValueChange={handleFrequencyChange}>
            <SelectTrigger id="digest-frequency" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Admin Email Recipients */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Admin Email Recipients
          </Label>
          <p className="text-sm text-muted-foreground">
            Email addresses that will receive admin notifications
          </p>

          {adminEmails.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {adminEmails.map((email, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5 px-3"
                >
                  {email}
                  <button
                    onClick={() => handleRemoveEmail(index)}
                    className="ml-1 hover:text-destructive transition-colors"
                    aria-label={`Remove ${email}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Add email address..."
                className="flex-1 max-w-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddEmail}
                disabled={!newEmail.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
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
