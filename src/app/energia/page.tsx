"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeEnergiaMock, EnergiaOutput } from "@/lib/energia";

export default function EnergiaPage() {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnergiaOutput | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const copyRef = useRef<HTMLTextAreaElement>(null);

  // Máscara simples DD/MM/AAAA
  const onDataChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    const p = [];
    if (digits.length > 0) p.push(digits.slice(0, 2));
    if (digits.length > 2) p.push(digits.slice(2, 4));
    if (digits.length > 4) p.push(digits.slice(4, 8));
    setData(p.join("/"));
  };

  const preventEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleCalcular = useCallback(async () => {
    if (!nome.trim() || !data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setStatus("error");
      setResult(null);
      return;
    }
    setLoading(true);
    setStatus("idle");
    setResult(null);

    const payload = { nome: nome.trim(), data, sentimentos: sent.trim() };

    // Primeiro tenta bater na API existente (/api/oraculo) para manter fluxo,
    // mas usamos apenas como "ping" — o cálculo é local e determinístico.
    try {
      await fetch("/api/oraculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: payload.nome, data: payload.data }),
      }).catch(() => {});
    } catch (_) {
      // ignorar falha: faremos mock local de qualquer forma
    }

    // Mock local
    const out = computeEnergiaMock(payload);
    setResult(out);
    setStatus("ok");
    setLoading(false);
  }, [nome, data, sent]);

  const copyJSON = () => {
    if (!result) return;
    const json = JSON.stringify(result, null, 2);
    navigator.clipboard
      .writeText(json)
      .then(() => {
        if (copyRef.current) {
          copyRef.current.value = json;
        }
      })
      .catch(() => {
        if (copyRef.current) {
          copyRef.current.value = json; // fallback visual
        }
      });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Energia (Premium)</h1>
        <Link href="/" className="text-sm underline">
          Voltar à Home
        </Link>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border px-3 py-1 text-xs">Preview</span>
          <span className="rounded-full border px-3 py-1 text-xs">Sem cobrança</span>
          <span className="rounded-full border px-3 py-1 text-xs">Mock determinístico</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Calcule uma leitura rápida de energia (R, Q, FP, FPC, φ°). O resultado é estável para os mesmos
          dados de entrada. Versão preview/premium.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={preventEnter}
              placeholder="Ex.: Rafael Sanchez Torres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data de nascimento</Label>
            <Input
              id="data"
              value={data}
              onChange={(e) => onDataChange(e.target.value)}
              onKeyDown={preventEnter}
              placeholder="DD/MM/AAAA"
              inputMode="numeric"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="sent">Sentimentos (opcional)</Label>
            <textarea
              id="sent"
              value={sent}
              onChange={(e) => setSent(e.target.value)}
              onKeyDown={preventEnter}
              placeholder="Como você está se sentindo hoje?"
              className="w-full rounded-xl border p-3 text-sm outline-none focus:ring-2"
              rows={4}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" onClick={handleCalcular} disabled={loading}>
            {loading ? "Calculando..." : "Calcular energia"}
          </Button>
          {status === "error" && (
            <span className="text-sm text-red-600">
              Verifique nome e data no formato DD/MM/AAAA.
            </span>
          )}
        </div>
      </Card>

      {result && (
        <Card className="mt-6 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Métricas</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border p-4">
              <div className="text-xs uppercase opacity-70">R</div>
              <div className="text-2xl font-bold">{result.R}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs uppercase opacity-70">Q</div>
              <div className="text-2xl font-bold">{result.Q}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs uppercase opacity-70">FP</div>
              <div className="text-2xl font-bold">{result.FP}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs uppercase opacity-70">FPC</div>
              <div className="text-2xl font-bold">{result.FPC}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs uppercase opacity-70">φ°</div>
              <div className="text-2xl font-bold">{result.phi_deg}°</div>
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="text-sm font-medium">Diagnóstico</div>
            <p className="text-sm mt-1">{result.diagnostic.summary}</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {result.diagnostic.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Exportar</div>
            <div className="flex items-center gap-3">
              <Button type="button" onClick={copyJSON}>Copiar JSON</Button>
              <span className="text-xs opacity-70">Copia para área de transferência</span>
            </div>
            <textarea
              ref={copyRef}
              readOnly
              rows={6}
              className="w-full rounded-xl border p-3 text-xs"
              placeholder="JSON copiado aparecerá aqui (fallback visual)."
            />
          </div>

          <div className="text-xs opacity-70">
            * Preview/Premium — sujeita a ajustes. Resultados não substituem aconselhamento profissional.
          </div>
        </Card>
      )}
    </div>
  );
}

