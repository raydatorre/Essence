"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalBackHome() {
  const pathname = usePathname();
  if (!pathname?.startsWith("/mapa")) return null;

  return (
    <div className="fixed right-4 top-4 z-[1000]">
      <Link
        href="/"
        className="inline-flex items-center rounded-xl border bg-white/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur
                   hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2
                   dark:bg-[#14181d]/90 dark:text-gray-100"
        aria-label="Voltar à Home"
      >
        Voltar à Home
      </Link>
      <style jsx global>{`
        .fixed.right-4.top-4 a { display: inline-flex !important; visibility: visible !important; opacity: 1 !important; }
      `}</style>
    </div>
  );
}
