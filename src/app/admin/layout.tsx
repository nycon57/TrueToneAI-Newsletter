import { redirect } from "next/navigation";
import { getApiUser } from "@/lib/api/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and role
  let user;
  try {
    user = await getApiUser();
  } catch (error) {
    redirect("/");
  }

  // Verify user has admin or super_admin role
  if (!user.role || !["admin", "super_admin"].includes(user.role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <a href="/admin" className="flex items-center gap-2 font-semibold">
                <span className="text-lg">Admin Dashboard</span>
              </a>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <AdminSidebar userRole={user.role} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top header */}
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold md:text-2xl">
                Article Management
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {user.role}
              </span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
