import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Casey Phone & Tech Repairs</h3>
          <p>
            Garage-based phone, laptop, tablet and motherboard repair service for Clyde
            North, Casey and South-East Melbourne.
          </p>
        </div>
        <div>
          <h4>Book</h4>
          <p><Link href="/login">OTP login</Link></p>
          <p><Link href="/book-repair">Book repair</Link></p>
          <p><Link href="/request-quote">Request quote</Link></p>
          <p><Link href="/insurance-quote">Insurance quote</Link></p>
          <p><Link href="/door-to-door">Door-to-door</Link></p>
        </div>
        <div>
          <h4>Services</h4>
          <p><Link href="/services">Repair services</Link></p>
          <p><Link href="/it-services">IT services</Link></p>
          <p><Link href="/refurbished-devices">Refurbished devices</Link></p>
          <p><Link href="/pricing">Repair costs</Link></p>
        </div>
        <div>
          <h4>Company</h4>
          <p><Link href="/about">About</Link></p>
          <p><Link href="/faq">FAQ</Link></p>
          <p><Link href="/privacy-policy">Privacy policy</Link></p>
          <p><Link href="/terms">Terms</Link></p>
          <p><Link href="/contact">Contact</Link></p>
        </div>
      </div>
    </footer>
  );
}
