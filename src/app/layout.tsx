import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/site";
import GlobalBackHome from "@/components/global-back-home";

export const metadata: Metadata = {
  title: site?.title ?? "Oráculo 3.1",
  description: site?.description ?? "Leituras e mapas do Oráculo 3.1",
  metadataBase: new URL(site?.url ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <body className="min-h-dvh bg-white text-gray-900 transition-colors duration-300 dark:bg-[#0b0d10] dark:text-gray-100">
        <ThemeProvider>
          <GlobalBackHome />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
