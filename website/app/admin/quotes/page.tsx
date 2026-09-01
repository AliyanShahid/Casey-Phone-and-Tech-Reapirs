import { AdminQuotes } from "@/components/admin-quotes";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin Quotes" };

export default function AdminQuotesPage() {
  return (
    <AdminShell eyebrow="Admin quotes" title="Quote requests">
      <AdminQuotes />
    </AdminShell>
  );
}
