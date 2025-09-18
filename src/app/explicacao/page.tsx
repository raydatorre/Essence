"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Explicacao() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Entenda o método: DC → AC</h1>
        <p className="text-muted-foreground max-w-3xl">
          Usamos a metáfora elétrica para simplificar: <b>DC</b> (corrente contínua) representa o <b>código de essência</b> — seus números de base, derivados do nascimento e do nome.
          <br className="hidden md:block" />
          <b>AC</b> (corrente alternada) representa a <b>energia em movimento</b> — o quanto a vida real (pressões, ritmo, ambiente) faz você se afastar ou se alinhar ao seu código.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="text-xl font-semibold">DC — Código de Essência (Mapa)</h2>
          <p className="text-sm text-muted-foreground">
            Combinamos tradições <b>Caldéia</b>, <b>Cabalística</b> e <b>Védica</b> para revelar padrões de origem (missões, talentos, caminhos). É estável — seu “polo norte”.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Destino, essência, desafios e tríptico A–C.</li>
            <li>Linguagem acessível + notas técnicas para aprofundar.</li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="text-xl font-semibold">AC — Energia em Movimento (Defasagem)</h2>
          <p className="text-sm text-muted-foreground">
            Medimos seu estado atual: <b>R</b> (força real), <b>Q</b> (carga externa), <b>FPC</b> (coeficiente de performance), <b>φ°</b> (defasagem), <b>FP</b> (fator de potência).
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Leitura da semana/momento (AC).</li>
            <li>Rituais simples para reduzir φ° e aumentar FPC.</li>
            <li>Chat re-estima R/Q a cada conversa.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="text-xl font-semibold">Como o app funciona</h2>
        <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
          <li>Você preenche nome, data de nascimento e como está se sentindo.</li>
          <li>Geramos o <b>Mapa (DC)</b> em JSON com blocos A–E e métricas.</li>
          <li>Sugerimos rituais/ações para elevar FPC e reduzir φ° (<b>AC</b>).</li>
          <li>No chat, reavaliamos R/Q e ajustamos as recomendações.</li>
        </ol>
      </section>

      <div className="flex items-center gap-3">
        <Link href="/mapa"><Button size="lg">Gerar mapa grátis</Button></Link>
        <Link href="/"><Button variant="outline" size="lg">Voltar à Home</Button></Link>
      </div>
    </main>
  );
}
