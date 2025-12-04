"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, FileText, CheckCircle, Archive, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface StatusCounts {
  all: number;
  draft: number;
  published: number;
  archived: number;
}

interface ArticlesFilterToolbarProps {
  counts: StatusCounts;
  onSearchChange?: (query: string) => void;
}

const statusOptions = [
  { value: "all", label: "All Articles", icon: Layers },
  { value: "draft", label: "Pending Review", icon: FileText },
  { value: "published", label: "Published", icon: CheckCircle },
  { value: "archived", label: "Archived", icon: Archive },
] as const;

export function ArticlesFilterToolbar({ counts, onSearchChange }: ArticlesFilterToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const currentStatus = (searchParams.get("status") || "draft") as keyof StatusCounts;
  const currentOption = statusOptions.find((opt) => opt.value === currentStatus) || statusOptions[1];

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (status === "draft") {
        params.delete("status"); // Default, no need to include in URL
      } else {
        params.set("status", status);
      }
      router.push(`/admin/articles?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Status Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-auto justify-between gap-2 min-w-[200px]",
              "border-2 hover:border-primary/50 transition-all duration-200",
              isPending && "opacity-70"
            )}
            disabled={isPending}
          >
            <span className="flex items-center gap-2">
              <currentOption.icon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{currentOption.label}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {counts[currentStatus]}
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isPending && "animate-pulse"
              )} />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.value === currentStatus;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  isActive && "bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className={cn(
                    "h-4 w-4",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(isActive && "font-medium")}>{option.label}</span>
                </span>
                <span className={cn(
                  "inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-xs font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {counts[option.value]}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search articles by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9 border-2 focus-visible:border-primary/50 transition-colors"
        />
      </div>
    </div>
  );
}
