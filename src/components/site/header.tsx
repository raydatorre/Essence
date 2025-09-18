"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const nav = [
  { href: "/", label: "Home" },
  { href: "/explicacao", label: "Explicação" },
  { href: "/mapa", label: "Mapa Free" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Essence</Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors",
                pathname === item.href && "bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
