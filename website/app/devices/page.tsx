import { brands } from "@/lib/site-data";

export const metadata = { title: "Devices" };

export default function DevicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Devices</p>
          <h1>Brand and model database foundation.</h1>
          <p>Search and full model-level pricing are planned for Phase 2.</p>
        </div>
      </section>
      <section className="section">
        <div className="container card-grid">
          {brands.map((brand) => (
            <article className="card" key={brand}>
              <h3>{brand}</h3>
              <p className="muted">Models and repair prices will be managed by admin.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
