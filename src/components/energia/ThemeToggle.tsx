"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = theme === "system" ? systemTheme : theme;
  if (!mounted) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      className="inline-flex items-center gap-2"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      aria-label="Alternar tema"
      title="Alternar tema claro/escuro"
    >
      {current === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm">{current === "dark" ? "Claro" : "Escuro"}</span>
    </Button>
  );
}
