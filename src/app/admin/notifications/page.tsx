import { ActivityLogClient } from "@/components/admin/activity-log-client";

export const dynamic = "force-dynamic";

export default function ActivityLogPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground mt-1">
          Track all admin actions and system events
        </p>
      </div>

      <ActivityLogClient />
    </div>
  );
}
