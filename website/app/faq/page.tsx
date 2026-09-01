import { SimplePage } from "@/components/simple-page";

export const metadata = { title: "FAQ" };

const faqs = [
  ["Do you offer same-day repairs?", "Simple screen, battery and port jobs may be same day once parts and capacity are confirmed."],
  ["Do you use genuine parts?", "Part type will be disclosed before repair. Genuine, refurbished and aftermarket options should be clearly labelled."],
  ["Can I get an insurance quote?", "Yes. The system is planned to generate professional PDF repair quotes for customer insurance claims."],
  ["Do you repair water damage?", "Water damage needs diagnostic review before a final quote or repair guarantee can be given."]
];

export default function FaqPage() {
  return (
    <SimplePage eyebrow="FAQ" title="Common repair questions." intro="Launch-ready answers will be refined before the website goes live.">
      <div className="card-grid">
        {faqs.map(([q, a]) => <article className="card" key={q}><h3>{q}</h3><p>{a}</p></article>)}
      </div>
    </SimplePage>
  );
}
