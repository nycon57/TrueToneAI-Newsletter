"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle,
  XCircle,
  UserPlus,
  ArrowUpCircle,
  Settings,
  Archive,
  RotateCcw,
  ChevronDown,
  Loader2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ActivityLogItem } from "./activity-log-item";

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

interface GroupedActivities {
  label: string;
  date: string;
  activities: Activity[];
}

interface ActivityResponse {
  activities: GroupedActivities[];
  total: number;
  hasMore: boolean;
}

const filterOptions = [
  { value: "all", label: "All Activity", icon: History },
  { value: "submissions", label: "Submissions", icon: FileText },
  { value: "approvals", label: "Approvals", icon: CheckCircle },
  { value: "users", label: "Users", icon: UserPlus },
  { value: "system", label: "System", icon: Settings },
] as const;

export function ActivityLogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activities, setActivities] = useState<GroupedActivities[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const currentFilter = searchParams.get("type") || "all";
  const currentOption = filterOptions.find((opt) => opt.value === currentFilter) || filterOptions[0];

  const fetchActivities = useCallback(async (filterType: string, currentOffset = 0) => {
    try {
      const isLoadMore = currentOffset > 0;
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const params = new URLSearchParams({
        type: filterType,
        limit: "50",
        offset: currentOffset.toString(),
      });

      const response = await fetch(`/api/admin/activity?${params}`);
      if (!response.ok) throw new Error("Failed to fetch activities");

      const data: ActivityResponse = await response.json();

      if (isLoadMore) {
        // Merge new activities into existing groups
        setActivities((prev) => mergeActivityGroups(prev, data.activities));
        setOffset(currentOffset + 50);
      } else {
        setActivities(data.activities);
        setOffset(50);
      }

      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(currentFilter, 0);
  }, [currentFilter, fetchActivities]);

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("type");
    } else {
      params.set("type", filter);
    }
    router.push(`/admin/notifications?${params.toString()}`);
  };

  const handleLoadMore = () => {
    fetchActivities(currentFilter, offset);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Toolbar */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[180px] justify-between gap-2 border-2"
            >
              <span className="flex items-center gap-2">
                <currentOption.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{currentOption.label}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.value === currentFilter;
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    isActive && "bg-primary/5"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(isActive && "font-medium")}>{option.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-sm text-muted-foreground">
          {total} {total === 1 ? "event" : "events"}
        </span>
      </div>

      {/* Activity List */}
      {isLoading ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground">Loading activity...</p>
          </CardContent>
        </Card>
      ) : activities.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Admin actions will appear here as they happen
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {activities.map((group) => (
            <div key={group.date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="space-y-3">
                {group.activities.map((activity) => (
                  <ActivityLogItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[200px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to merge activity groups when loading more
function mergeActivityGroups(
  existing: GroupedActivities[],
  newGroups: GroupedActivities[]
): GroupedActivities[] {
  const merged = [...existing];

  newGroups.forEach((newGroup) => {
    const existingGroup = merged.find((g) => g.date === newGroup.date);
    if (existingGroup) {
      // Add new activities that don't already exist
      const existingIds = new Set(existingGroup.activities.map((a) => a.id));
      const uniqueNewActivities = newGroup.activities.filter((a) => !existingIds.has(a.id));
      existingGroup.activities.push(...uniqueNewActivities);
    } else {
      merged.push(newGroup);
    }
  });

  return merged;
}
