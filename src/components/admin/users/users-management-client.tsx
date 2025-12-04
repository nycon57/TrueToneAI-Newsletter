"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { Search, MoreHorizontal, Shield, User as UserIcon, Crown, Mail, Building } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDetailSheet } from "./user-detail-sheet";
import { RoleChangeDialog } from "./role-change-dialog";

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

interface UsersManagementClientProps {
  users: User[];
}

const columnHelper = createColumnHelper<User>();

export function UsersManagementClient({ users }: UsersManagementClientProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleChangeUserId, setRoleChangeUserId] = useState<string>("");
  const [roleChangeUserName, setRoleChangeUserName] = useState<string>("");
  const [roleChangeCurrentRole, setRoleChangeCurrentRole] = useState<string | null>(null);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailSheetOpen(true);
  };

  const handleChangeRole = (user: User) => {
    setRoleChangeUserId(user.id);
    setRoleChangeUserName(user.name || user.email);
    setRoleChangeCurrentRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      toast.success("User role updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
      throw error;
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (tierFilter !== "all" && user.subscription_tier !== tierFilter) return false;
      if (globalFilter) {
        const search = globalFilter.toLowerCase();
        return (
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.company?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [users, roleFilter, tierFilter, globalFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "User",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{row.original.name || "No name"}</span>
              {row.original.role === "admin" && (
                <Badge variant="default" className="text-xs bg-violet-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.original.email}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("company", {
        header: "Company",
        cell: ({ getValue }) => {
          const company = getValue();
          return company ? (
            <span className="text-sm flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              {company}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          );
        },
      }),
      columnHelper.accessor("subscription_tier", {
        header: "Subscription",
        cell: ({ row }) => {
          const tier = row.original.subscription_tier || "free";
          const status = row.original.subscription_status;
          return (
            <div className="flex flex-col gap-1">
              <Badge
                variant={tier === "free" ? "secondary" : "default"}
                className={tier !== "free" ? "bg-emerald-600" : ""}
              >
                {tier === "free" ? (
                  "FREE"
                ) : (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    {tier.toUpperCase()}
                  </>
                )}
              </Badge>
              {status && status !== "active" && (
                <span className="text-xs text-muted-foreground">{status}</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "generations",
        header: "Generations",
        cell: ({ row }) => {
          const used = row.original.monthly_generations_used || 0;
          const limit = row.original.monthly_generation_limit || 0;
          const percentage = limit > 0 ? (used / limit) * 100 : 0;
          return (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {used} / {limit}
              </span>
              <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Joined",
        cell: ({ getValue }) => {
          const date = getValue();
          return (
            <span className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
                <UserIcon className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeRole(row.original)}>
                <Shield className="h-4 w-4 mr-2" />
                Change Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Sheet */}
      <UserDetailSheet
        user={selectedUser}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      {/* Role Change Dialog */}
      <RoleChangeDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        userId={roleChangeUserId}
        userName={roleChangeUserName}
        currentRole={roleChangeCurrentRole}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
