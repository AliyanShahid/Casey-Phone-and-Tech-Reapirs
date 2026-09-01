import { AdminPricing } from "@/components/admin-pricing";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin Pricing" };

export default function AdminPricingPage() {
  return (
    <AdminShell eyebrow="Admin pricing" title="Repair cost database">
      <AdminPricing />
    </AdminShell>
  );
}
