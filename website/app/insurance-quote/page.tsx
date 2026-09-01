import { InsuranceQuoteForm } from "@/components/insurance-quote-form";

export const metadata = {
  title: "Insurance Quote",
  description: "Request a formal device repair quote document for insurance claims."
};

const steps = [
  ["Send details", "Customer submits device, damage and photos."],
  ["Admin review", "Casey Repairs checks damage and prepares quote fee."],
  ["Pay quote fee", "Customer pays before formal document release."],
  ["Download PDF", "Insurance-ready quote is available on website and email."]
];

export default function InsuranceQuotePage() {
  return (
    <main className="insurance-page">
      <section className="insurance-hero">
        <div className="container insurance-hero-grid">
          <div>
            <p className="eyebrow">Insurance quote</p>
            <h1>Formal repair quote documents for device insurance claims.</h1>
            <p>
              Upload device photos, damage details and identifiers. We review it,
              confirm payment, then issue a professional quote document for your insurer.
            </p>
          </div>
          <div className="insurance-doc-preview" aria-hidden="true">
            <span>CASEY</span>
            <strong>Insurance Quote</strong>
            <i />
            <i />
            <i />
            <em>PDF ready after approval</em>
          </div>
        </div>
      </section>

      <section className="insurance-body">
        <div className="container insurance-layout">
          <aside className="insurance-side">
            <p className="eyebrow">Process</p>
            <h2>Clear steps for claim paperwork</h2>
            <div className="insurance-step-list">
              {steps.map(([title, copy], index) => (
                <article key={title}>
                  <span>{index + 1}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </aside>
          <InsuranceQuoteForm />
        </div>
      </section>
    </main>
  );
}
