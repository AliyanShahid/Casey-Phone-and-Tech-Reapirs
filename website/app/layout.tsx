import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: {
    default: "Casey Phone & Tech Repairs | Phone, Laptop and Device Repairs",
    template: "%s | Casey Phone & Tech Repairs"
  },
  description:
    "Premium local phone, laptop, tablet and motherboard repair service for Clyde North, Casey and South-East Melbourne.",
  openGraph: {
    title: "Casey Phone & Tech Repairs",
    description:
      "Book phone, laptop, tablet, door-to-door and insurance quote repairs with Casey Phone & Tech Repairs.",
    type: "website",
    locale: "en_AU"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" data-scroll-behavior="smooth">
      <body>
        <div className="shell">
          <SiteChrome>{children}</SiteChrome>
        </div>
      </body>
    </html>
  );
}
