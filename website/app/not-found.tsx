import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="section alt">
        <div className="container auth-card">
          <p className="eyebrow">404</p>
          <h1>Page not found.</h1>
          <p className="muted">The page you are looking for is not available.</p>
          <Link className="button primary" href="/">Go home</Link>
        </div>
      </section>
    </main>
  );
}
