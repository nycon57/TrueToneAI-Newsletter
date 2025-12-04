"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Crown, Mail, Building, Calendar, Sparkles, CreditCard } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  monthly_generations_used: number | null;
  monthly_generation_limit: number | null;
  createdAt: string;
  company: string | null;
}

interface UserDetailSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  if (!user) return null;

  const tier = user.subscription_tier || "free";
  const isPaid = tier !== "free";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {user.name || "Unnamed User"}
            {user.role === "admin" && (
              <Badge variant="default" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Profile
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">First Name</span>
                <span className="text-sm font-medium">{user.firstName || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Name</span>
                <span className="text-sm font-medium">{user.lastName || "-"}</span>
              </div>
              {user.company && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Company
                  </span>
                  <span className="text-sm font-medium">{user.company}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined
                </span>
                <span className="text-sm font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Subscription */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge
                  variant={isPaid ? "default" : "secondary"}
                  className={isPaid ? "bg-blue-600" : ""}
                >
                  {isPaid ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      {tier.toUpperCase()}
                    </>
                  ) : (
                    "FREE"
                  )}
                </Badge>
              </div>
              {user.subscription_status && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={user.subscription_status === "active" ? "default" : "secondary"}
                    className={user.subscription_status === "active" ? "bg-green-600" : ""}
                  >
                    {user.subscription_status}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Generations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generations
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Used This Period</span>
                <span className="text-sm font-medium">
                  {user.monthly_generations_used || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Limit</span>
                <span className="text-sm font-medium">
                  {user.monthly_generation_limit || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-sm font-medium">
                  {Math.max(
                    0,
                    (user.monthly_generation_limit || 0) - (user.monthly_generations_used || 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Access
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role || "user"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
                  {user.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
