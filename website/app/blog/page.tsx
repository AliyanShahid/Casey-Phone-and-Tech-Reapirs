import { SimplePage } from "@/components/simple-page";

export const metadata = { title: "Blog" };

const posts = [
  "How to tell if your phone needs a battery or charging port",
  "What to do after water damage",
  "Is a cracked screen worth repairing?",
  "Why motherboard repair needs proper diagnostics"
];

export default function BlogPage() {
  return (
    <SimplePage eyebrow="Blog" title="Repair advice and local updates." intro="SEO content foundation for future launch posts.">
      <div className="card-grid">
        {posts.map((post) => <article className="card" key={post}><h3>{post}</h3><p className="muted">Draft topic planned for launch content.</p></article>)}
      </div>
    </SimplePage>
  );
}
