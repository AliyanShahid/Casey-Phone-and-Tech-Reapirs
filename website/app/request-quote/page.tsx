import { QuoteForm } from "@/components/quote-form";

export const metadata = { title: "Request Quote" };

export default function RequestQuotePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Repair quote</p>
          <h1>Request a reviewed repair quote.</h1>
          <p>Submit a quote request and review its status from the tracking page.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}
