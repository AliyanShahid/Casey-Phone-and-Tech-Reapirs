import { AdminBookings } from "@/components/admin-bookings";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin Bookings" };

export default function AdminBookingsPage() {
  return (
    <AdminShell eyebrow="Admin bookings" title="Repair bookings">
      <AdminBookings />
    </AdminShell>
  );
}
