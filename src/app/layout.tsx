import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";

function safeURL(v?: string) {
  try { return v ? new URL(v) : undefined; } catch { return undefined; }
}
const base = safeURL(site.url);

export const metadata: Metadata = {
  ...(base ? { metadataBase: base } : {}),
  title: { default: "Essence — Oráculo 3.1", template: "%s — Essence" },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: "Essence",
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Essence — Oráculo 3.1",
    description: site.description,
    images: [site.ogImage],
  },
  alternates: { canonical: site.url },,
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
