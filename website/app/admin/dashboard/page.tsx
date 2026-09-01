import { AdminOverview } from "@/components/admin-overview";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <AdminShell eyebrow="Admin overview" title="Repair business control centre">
      <AdminOverview />
    </AdminShell>
  );
}
