import type { MetadataRoute } from "next";

function abs(path: string) {
  const env = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const base = env || "http://localhost:3000";
  try { return new URL(path, base).toString(); } catch { return path; }
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: abs("/sitemap.xml"),
  };
}
