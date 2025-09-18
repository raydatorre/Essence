import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Essence — Oráculo 3.1",
  description: "Seu código de essência. Sua melhor frequência.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Essence — Oráculo 3.1",
    description: "Do harmônico de nascimento à defasagem do mundo moderno: entenda, meça e ajuste.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Essence — Oráculo 3.1" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Essence — Oráculo 3.1",
    description:
      "Do harmônico de nascimento à defasagem do mundo moderno: entenda, meça e ajuste.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground">
        <div className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
