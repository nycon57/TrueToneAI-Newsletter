import { redirect } from "next/navigation";
import Link from "next/link";
import { getApiUser } from "@/lib/api/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNavUser } from "@/components/admin/admin-nav-user";
import { createClient } from "@/lib/supabase/server";

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

  // Get pending articles count for sidebar badge
  const supabase = await createClient();
  const { count: pendingCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/admin" className="flex items-center gap-2 font-semibold">
                <span className="text-lg">Admin Dashboard</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <AdminSidebar pendingCount={pendingCount ?? 0} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top header */}
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex-1">
              {/* Page-specific titles are rendered by individual pages */}
            </div>
            <AdminNavUser
              user={{
                name: user.name || '',
                email: user.email,
                avatar: user.avatar_url || undefined,
                subscription_tier: user.subscription_tier || 'free',
                role: user.role || 'admin',
              }}
            />
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
