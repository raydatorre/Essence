"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  birth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA"),
  feelings: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function MapaFree() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      birth: "",
      feelings: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
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
      const json = await res.json();
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
        <CardHeader>
          <CardTitle>Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Ex.: Rafael Sanchez Torres" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="birth">Data de nascimento (DD/MM/AAAA)</Label>
              <Input id="birth" placeholder="10/05/1983" {...register("birth")} />
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
        <div className="rounded-2xl border p-4 text-sm text-red-700 bg-red-50 border-red-200">
          {error}
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto text-xs md:text-sm rounded-xl p-4 bg-muted">
{JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
