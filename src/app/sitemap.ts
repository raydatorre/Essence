import type { MetadataRoute } from "next";

function baseUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return env.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();
  const now = new Date();
  const pages = ["/", "/explicacao", "/mapa"];
  return pages.map((p) => ({
    url: base ? `${base}${p}` : p,
    lastModified: now,
  }));
}
