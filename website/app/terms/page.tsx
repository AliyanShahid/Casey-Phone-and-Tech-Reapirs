import { SimplePage } from "@/components/simple-page";

export const metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <SimplePage eyebrow="Terms" title="Repair terms draft." intro="Final repair terms should be checked against Australian Consumer Law before launch.">
      <div className="card">
        <p>
          Repair work should be approved by the customer before it begins. Warranty terms,
          non-genuine parts, pre-existing damage, data risk and unclaimed device handling
          must be disclosed clearly in writing.
        </p>
      </div>
    </SimplePage>
  );
}
