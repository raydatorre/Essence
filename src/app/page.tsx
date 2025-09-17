"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Activity, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Seu código de essência. Sua melhor frequência.</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Do harmônico de nascimento à defasagem do mundo moderno: entenda, meça e ajuste com rituais simples.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="#free"><Button size="lg">Gerar mapa grátis</Button></Link>
          <Link href="/explicacao"><Button size="lg" variant="outline">Entenda o método</Button></Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6" id="free">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Essência (Grátis)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Mapa do nascimento: Caldéia, Cabalística e Védica (resumo) + Tríptico.</p>
            <Link href="/mapa"><Button className="w-full">Gerar mapa</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Energia (Premium)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Defasagem (φ°), R, Q, FPC, FP e rituais práticos.</p>
            <Button className="w-full" variant="secondary" disabled>Em breve</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Chat (Premium)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Orientação contínua com re-estimativa de R/Q a cada mensagem.</p>
            <Button className="w-full" variant="ghost" disabled>Em breve</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
