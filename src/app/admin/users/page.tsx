import { createClient } from "@/lib/supabase/server";
import { UsersManagementClient } from "@/components/admin/users/users-management-client";

export const dynamic = "force-dynamic";

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

async function getUsers(): Promise<User[]> {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      firstName,
      lastName,
      role,
      subscription_tier,
      subscription_status,
      monthly_generations_used,
      monthly_generation_limit,
      createdAt,
      company
    `)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return users || [];
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and subscriptions ({users.length} users)
        </p>
      </div>
      <UsersManagementClient users={users} />
    </div>
  );
}
