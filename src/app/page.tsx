"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Oráculo 3.1</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 (exemplo existente) */}
        <Card className="p-6">
          <div className="text-sm opacity-70 mb-2">Introdução</div>
          <div className="text-lg font-semibold mb-3">Explicação</div>
          <Link href="/explicacao" className="underline text-sm">Ir para /explicacao</Link>
        </Card>

        {/* Card 2 (Mapa) */}
        <Card className="p-6">
          <div className="text-sm opacity-70 mb-2">Ferramenta</div>
          <div className="text-lg font-semibold mb-3">Mapa</div>
          <Link href="/mapa" className="underline text-sm">Ir para /mapa</Link>
        </Card>

        {/* Card 3 (Energia Premium) — agora ativo */}
        <Card className="p-6">
          <div className="text-sm opacity-70 mb-2">Premium</div>
          <div className="text-lg font-semibold mb-3">Energia (Premium)</div>
          <Link href="/energia" className="underline text-sm">Ir para /energia</Link>
        </Card>
      </div>
    </div>
  );
}
