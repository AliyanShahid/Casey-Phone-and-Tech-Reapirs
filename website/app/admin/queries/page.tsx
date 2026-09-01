import { AdminQueries } from "@/components/admin-queries";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin Queries" };

export default function AdminQueriesPage() {
  return (
    <AdminShell eyebrow="Admin queries" title="Customer pricing queries">
      <AdminQueries />
    </AdminShell>
  );
}
