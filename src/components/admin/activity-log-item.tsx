"use client";

import Link from "next/link";
import {
  FileText,
  CheckCircle,
  XCircle,
  UserPlus,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  Archive,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  resource_type: string | null;
  resource_id: string | null;
  actor: { id: string; name: string | null; email: string } | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface ActivityLogItemProps {
  activity: Activity;
}

const eventConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string }> = {
  article_submitted: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  article_approved: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  article_rejected: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  article_archived: {
    icon: Archive,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
  },
  article_restored: {
    icon: RotateCcw,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  user_signup: {
    icon: UserPlus,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  user_upgraded: {
    icon: ArrowUpCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  user_downgraded: {
    icon: ArrowDownCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  settings_updated: {
    icon: Settings,
    color: "text-slate-600",
    bgColor: "bg-slate-100 dark:bg-slate-900/30",
  },
};

export function ActivityLogItem({ activity }: ActivityLogItemProps) {
  const config = eventConfig[activity.event_type] || {
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  };
  const Icon = config.icon;

  const actorName = activity.actor?.name || activity.actor?.email?.split("@")[0] || "System";
  const actorInitials = actorName.substring(0, 2).toUpperCase();

  const formattedTime = new Date(activity.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Determine if this activity links to a resource
  const resourceLink = getResourceLink(activity);

  const content = (
    <Card
      className={cn(
        "transition-all duration-200 border-l-4",
        resourceLink && "hover:shadow-md cursor-pointer",
        config.color.replace("text-", "border-l-")
      )}
    >
      <CardContent className="flex items-start gap-4 py-4">
        {/* Event Icon */}
        <div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground leading-tight">{activity.title}</p>
          {activity.description && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {activity.description}
            </p>
          )}

          {/* Metadata Pills */}
          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground"
                >
                  {formatMetadataKey(key)}: {formatMetadataValue(value)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actor and Time */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{actorName}</p>
            <p className="text-xs text-muted-foreground">{formattedTime}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {actorInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );

  if (resourceLink) {
    return <Link href={resourceLink}>{content}</Link>;
  }

  return content;
}

function getResourceLink(activity: Activity): string | null {
  if (!activity.resource_type || !activity.resource_id) return null;

  switch (activity.resource_type) {
    case "article":
      return `/admin/articles/${activity.resource_id}`;
    case "user":
      return `/admin/users?id=${activity.resource_id}`;
    default:
      return null;
  }
}

function formatMetadataKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMetadataValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value.length > 20 ? `${value.substring(0, 20)}...` : value;
  return JSON.stringify(value);
}
