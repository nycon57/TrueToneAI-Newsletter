import { SettingsPageClient } from "@/components/admin/settings/settings-page-client";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure review workflows and notification preferences
        </p>
      </div>

      <SettingsPageClient />
    </div>
  );
}
