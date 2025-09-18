"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OraculoResponse } from "@/types/oraculo";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  birth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA"),
  feelings: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function MapaFree() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OraculoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      setLoading(true); setError(null); setResult(null);
      const res = await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.name,
          nascimento: data.birth,
          sentimentos: data.feelings,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: OraculoResponse = await res.json();
      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Falha ao gerar o mapa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Gerar Mapa (Grátis)</h1>
        <p className="text-muted-foreground">Preencha os campos abaixo e receba o JSON do seu mapa (mock por enquanto).</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Dados</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Ex.: Rafael Sanchez Torres" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="birth">Data de nascimento (DD/MM/AAAA)</Label>
              <Input id="birth" placeholder="10/05/1983" inputMode="numeric"
                {...register("birth")}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  let out = v.slice(0,2);
                  if (v.length > 2) out += "/" + v.slice(2,4);
                  if (v.length > 4) out += "/" + v.slice(4,8);
                  e.target.value = out;
                }}
              />
              {errors.birth && <p className="text-sm text-red-600 mt-1">{errors.birth.message}</p>}
            </div>

            <div>
              <Label htmlFor="feelings">Sentimentos recentes (opcional)</Label>
              <Input id="feelings" placeholder="ansioso, animado, focado..." {...register("feelings")} />
            </div>

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Gerando..." : "Gerar mapa"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-2xl border p-4 text-sm text-red-700 bg-red-50 border-red-200">{error}</div>
      )}

      {result && (
        <div className="space-y-6">
          <section className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><span className="text-foreground font-medium">Nome:</span> {result.pessoa.nome}</p>
                <p><span className="text-foreground font-medium">Nascimento:</span> {result.pessoa.nascimento}</p>
                {result.pessoa.sentimentos && <p><span className="text-foreground font-medium">Sentimentos:</span> {result.pessoa.sentimentos}</p>}
                <p className="text-[11px] mt-2">Gerado: {new Date(result.ts).toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Tríptico (DC)</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><span className="text-foreground font-medium">A:</span> {result.dc.triptico.A}</p>
                <p><span className="text-foreground font-medium">B:</span> {result.dc.triptico.B}</p>
                <p><span className="text-foreground font-medium">C:</span> {result.dc.triptico.C}</p>
                <p className="mt-2"><span className="text-foreground font-medium">Destinos:</span> {result.dc.destinos.join(", ")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Métricas (AC)</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-foreground font-medium">R:</span> {result.ac.R}</div>
                  <div><span className="text-foreground font-medium">Q:</span> {result.ac.Q}</div>
                  <div><span className="text-foreground font-medium">FPC:</span> {result.ac.FPC}</div>
                  <div><span className="text-foreground font-medium">FP:</span> {result.ac.FP}</div>
                  <div className="col-span-2"><span className="text-foreground font-medium">φ°:</span> {result.ac.phi}°</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader><CardTitle>Recomendações</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                {result.recomendacoes.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Resultado (JSON)</CardTitle>
              <Button
                variant="outline" size="sm"
                onClick={() => typeof navigator !== "undefined" && navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
              >
                Copiar JSON
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs md:text-sm rounded-xl p-4 bg-muted">
{JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
