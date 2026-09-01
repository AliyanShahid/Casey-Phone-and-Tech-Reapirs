 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav, RegisterNav } from "@/components/auth-nav";
import { CaseyLogo } from "@/components/casey-logo";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/repair", label: "Repair Booking" },
  { href: "/door-to-door", label: "Door-to-door" },
  { href: "/it-services", label: "IT services" },
  { href: "/refurbished-devices", label: "Refurbished Devices" },
  { href: "/insurance-quote", label: "Insurance quote" },
  { href: "/track-repair", label: "Track" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container nav">
        <CaseyLogo />
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <AuthNav />
          <RegisterNav />
          <Link className="button primary" href="/repair">
            Book Repair
          </Link>
        </div>
      </div>
    </header>
  );
}
