import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/services",
  "/pricing",
  "/devices",
  "/door-to-door",
  "/insurance-quote",
  "/book-repair",
  "/track-repair",
  "/request-quote",
  "/contact",
  "/faq",
  "/blog",
  "/privacy-policy",
  "/terms",
  "/login",
  "/register",
  "/forgot-password"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-07-05"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
