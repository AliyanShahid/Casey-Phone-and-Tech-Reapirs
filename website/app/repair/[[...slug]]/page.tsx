import type { Metadata } from "next";
import { RepairFlow } from "@/components/repair-flow";
import { findBrand, findDevice, findRepair } from "@/lib/repair-flow-data";

type RepairPageProps = {
  params: Promise<{ slug?: string[] }>;
};

function titleFromSlug(value?: string) {
  return value?.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export async function generateMetadata({ params }: RepairPageProps): Promise<Metadata> {
  const slug = (await params).slug || [];
  const brand = findBrand(slug[0]);
  const device = findDevice(slug[1]);
  const repair = findRepair(slug[2]);
  const title = device && repair
    ? `${device.name} ${repair.title}`
    : device
      ? `${device.name} Repair`
      : `${brand.name || titleFromSlug(slug[0]) || "Device"} Repair Booking`;

  return {
    title,
    description: "Select your device, choose the repair, and book mail-in, pickup, or visit service with Casey Phone & Tech Repairs."
  };
}

export default async function RepairPage({ params }: RepairPageProps) {
  const slug = (await params).slug || [];

  return (
    <main>
      <RepairFlow initialBrand={slug[0]} initialDevice={slug[1]} initialRepair={slug[2]} />
    </main>
  );
}
