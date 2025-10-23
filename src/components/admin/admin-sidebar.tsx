"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Archive,
  Settings,
  Bell,
} from "lucide-react";

// TODO: Add userRole prop for role-based navigation filtering when implementing permission-based menu items
interface AdminSidebarProps {
  pendingCount?: number;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Review Queue",
    href: "/admin/articles",
    icon: FileText,
    badge: "pending",
  },
  {
    name: "Published",
    href: "/admin/articles/published",
    icon: CheckCircle,
  },
  {
    name: "Archived",
    href: "/admin/articles/archived",
    icon: Archive,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ pendingCount }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navigation.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
            {item.badge === "pending" && (
              <span
                className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                aria-label={`${pendingCount ?? 0} pending articles`}
              >
                {pendingCount ?? 0}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
