"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Mapa() {
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [sentimentos, setSentimentos] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

 const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setResult(null);

  const resp = await fetch("/api/oraculo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, nascimento, sentimentos, mode: "basic" }),
  });

  // opcional: se a API responder erro HTTP, mostre algo amigável
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    setResult({ ok: false, status: resp.status, error: text || "Erro na API" });
    setLoading(false);
    return;
  }

  const data = await resp.json();
  setResult(data.result ?? data);
  setLoading(false);
};
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-serif">Gerar Mapa (Grátis)</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Nome completo</Label>
          <Input value={nome} onChange={(e)=>setNome(e.target.value)} required />
        </div>

        <div>
          <Label>Data de nascimento (DD/MM/AAAA)</Label>
          <Input value={nascimento} onChange={(e)=>setNascimento(e.target.value)} placeholder="10/05/1983" required />
        </div>

        <div>
          <Label>Sentimentos recentes (opcional)</Label>
          <Input value={sentimentos} onChange={(e)=>setSentimentos(e.target.value)} />
        </div>

        <Button type="submit" disabled={loading}>{loading ? "Gerando…" : "Gerar mapa"}</Button>
      </form>

      {result && (
  <div className="rounded-2xl border p-4 space-y-3 bg-white">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Seu Mapa (prévia)</h2>
      <button
        onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
        className="text-sm underline"
        type="button"
      >
        Copiar JSON
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-medium mb-1">Harmônico</h3>
        <p className="text-sm text-gray-600">{result.block_B_harmonic}</p>
      </div>
      <div>
        <h3 className="font-medium mb-1">Energia</h3>
        <p className="text-sm text-gray-600">{result.block_C_energy}</p>
      </div>
      <div className="md:col-span-2">
        <h3 className="font-medium mb-1">Resumo (ELI5)</h3>
        <p className="text-sm text-gray-600">{result.block_E_triptych?.eli5}</p>
      </div>
    </div>

    <details className="mt-2">
      <summary className="cursor-pointer text-sm">Ver JSON completo</summary>
      <pre className="mt-2 bg-gray-100 p-3 rounded-xl overflow-auto text-xs">
        {JSON.stringify(result, null, 2)}
      </pre>
    </details>
  </div>
)}
    </main>
  );
}
