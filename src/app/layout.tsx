import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/site/header";

export const metadata: Metadata = {
  title: "Essence — Oráculo 3.1",
  description: "Seu código de essência. Sua melhor frequência.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground">
        <Header />
        {children}
      </body>
    </html>
  );
}
