import { SimplePage } from "@/components/simple-page";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SimplePage
      eyebrow="About"
      title="Founder-led repairs from a focused garage workshop."
      intro="Casey Phone & Tech Repairs is built around honest diagnostics, careful repair work and clear customer communication."
    >
      <div className="card-grid">
        <article className="card"><h3>Honest advice</h3><p>No unnecessary upsell. Customers get a real explanation before approving work.</p></article>
        <article className="card"><h3>Technical depth</h3><p>Standard repairs and motherboard-level diagnostics are part of the service direction.</p></article>
        <article className="card"><h3>Local focus</h3><p>Built for Clyde North, Casey and South-East Melbourne customers.</p></article>
      </div>
    </SimplePage>
  );
}
