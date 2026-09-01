import { AdminShell } from "@/components/admin-shell";
import { AdminUsers } from "@/components/admin-users";

export const metadata = { title: "Admin Users" };

export default function AdminUsersPage() {
  return (
    <AdminShell eyebrow="Admin users" title="Customers">
      <AdminUsers />
    </AdminShell>
  );
}
