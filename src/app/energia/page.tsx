"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeEnergiaMock, EnergiaOutput } from "@/lib/energia";
import EnergyBars from "@/components/energia/EnergyBars";
import FpcRadial from "@/components/energia/FpcRadial";
import EnergyRadar from "@/components/energia/EnergyRadar";
import { encodeQuery, parseQuery, isValidDateBR } from "@/lib/url";
import { exportEnergiaPdf } from "@/lib/pdf";
import ThemeToggle from "@/components/energia/ThemeToggle";
import { makeComparison } from "@/lib/trend";

const LS_KEY = "energia:last";

export default function EnergiaPage() {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnergiaOutput | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [radarData, setRadarData] = useState<ReturnType<typeof makeComparison> | null>(null);
  const copyRef = useRef<HTMLTextAreaElement>(null);

  const ForceStyles = () => (
    <style jsx global>{`
      .energia-page{background-color:#ffffff;color:#111827}
      html.dark .energia-page{background-color:#0b0d10;color:#f3f4f6}
      .energia-page .energia-actions button,
      .energia-page .energia-actions [role="button"]{display:inline-flex!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:10!important}
    `}</style>
  );

  const onDataChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    const p: string[] = [];
    if (digits.length > 0) p.push(digits.slice(0, 2));
    if (digits.length > 2) p.push(digits.slice(2, 4));
    if (digits.length > 4) p.push(digits.slice(4, 8));
    setData(p.join("/"));
  };

  const preventEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  useEffect(() => {
    const { nome: qn, data: qd, sent: qs } = parseQuery(window.location.search);
    if (qn || qd || qs) {
      if (qn) setNome(qn);
      if (qd) setData(qd);
      if (qs) setSent(qs);
      if (qn && isValidDateBR(qd || "")) setTimeout(() => handleCalcular(qn, qd!, qs || ""), 0);
      return;
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const { nome: ln, data: ld, sent: ls } = JSON.parse(raw);
        if (ln) setNome(ln);
        if (ld) setData(ld);
        if (ls) setSent(ls);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (n: string, d: string, s: string) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ nome: n, data: d, sent: s })); } catch {}
  };
  const pushUrl = (n: string, d: string, s: string) => {
    const qs = encodeQuery({ nome: n, data: d, sent: s });
    const url = qs ? `/energia?${qs}` : "/energia";
    window.history.replaceState(null, "", url);
  };

  const handleCalcular = useCallback(async (nArg?: string, dArg?: string, sArg?: string) => {
    const n = (nArg ?? nome).trim();
    const d = (dArg ?? data);
    const s = (sArg ?? sent).trim();
    if (!n || !isValidDateBR(d)) { setStatus("error"); setResult(null); setRadarData(null); return; }

    setLoading(true); setStatus("idle"); setResult(null); setRadarData(null);
    try {
      await fetch("/api/oraculo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: n, data: d }) }).catch(() => {});
    } catch {}
    const out = computeEnergiaMock({ nome: n, data: d, sentimentos: s });
    setResult(out); setStatus("ok"); setLoading(false);
    persist(n, d, s); pushUrl(n, d, s);

    // prepara dados do radar comparativo
    const comp = makeComparison(out, `${n}|${d}|${s}`);
    setRadarData(comp);
  }, [nome, data, sent]);

  const copyJSON = () => {
    if (!result) return;
    const json = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(json).then(() => { if (copyRef.current) copyRef.current.value = json; }).catch(() => { if (copyRef.current) copyRef.current.value = json; });
  };
  const copyLink = () => {
    const qs = encodeQuery({ nome, data, sent });
    const url = `${window.location.origin}/energia${qs ? "?" + qs : ""}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };
  const exportPDF = () => { if (result) exportEnergiaPdf(nome, data, sent, result); };
  const handleClear = () => {
    setNome(""); setData(""); setSent(""); setResult(null); setStatus("idle"); setRadarData(null);
    try { localStorage.removeItem(LS_KEY); } catch {}
    window.history.replaceState(null, "", "/energia");
  };

  const Skeleton = () => (
    <div className="grid gap-3 md:grid-cols-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-2xl border p-4">
          <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
          <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );

  const Delta = ({ label, v }: { label: string; v: number }) => (
    <div className="rounded-xl border px-3 py-2 text-sm flex items-center justify-between">
      <span className="opacity-70">{label}</span>
      <span className={v === 0 ? "" : v > 0 ? "text-emerald-600" : "text-rose-600"}>
        {v > 0 ? "↑" : v < 0 ? "↓" : "•"} {Math.abs(v)}
      </span>
    </div>
  );

  return (
    <div className="energia-page mx-auto max-w-3xl px-4 py-8">
      <ForceStyles />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Energia (Premium)</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/" className="text-sm underline">Home</Link>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border px-3 py-1 text-xs">Preview</span>
          <span className="rounded-full border px-3 py-1 text-xs">Sem cobrança</span>
          <span className="rounded-full border px-3 py-1 text-xs">Mock determinístico</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Calcule uma leitura rápida de energia (R, Q, FP, FPC, φ°). O resultado é estável para os mesmos dados de entrada. Versão preview/premium.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={preventEnter} placeholder="Ex.: Rafael Sanchez Torres" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data de nascimento</Label>
            <Input id="data" value={data} onChange={(e) => onDataChange(e.target.value)} onKeyDown={preventEnter} placeholder="DD/MM/AAAA" inputMode="numeric" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="sent">Sentimentos (opcional)</Label>
            <textarea id="sent" value={sent} onChange={(e) => setSent(e.target.value)} onKeyDown={preventEnter} placeholder="Como você está se sentindo hoje?" className="w-full rounded-xl border p-3 text-sm outline-none focus:ring-2" rows={4} />
          </div>
        </div>

        <div className="energia-actions flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => handleCalcular()} disabled={loading} aria-label="Calcular energia" className="inline-flex"> {loading ? "Calculando..." : "Calcular energia"} </Button>
          <button type="button" onClick={() => handleCalcular()} disabled={loading} aria-label="Calcular energia (fallback)" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"> {loading ? "Calculando..." : "Calcular energia (fallback)"} </button>
          <Button type="button" onClick={() => { const qs = encodeQuery({ nome, data, sent }); navigator.clipboard.writeText(`${window.location.origin}/energia${qs ? "?" + qs : ""}`); }} variant="secondary" className="inline-flex">Copiar link</Button>
          <Button type="button" onClick={handleClear} variant="secondary" className="inline-flex">Limpar</Button>
          <span className="text-xs opacity-70">Dica: Enter não envia; use o botão.</span>
          {status === "error" && <span className="text-sm text-red-600">Verifique nome e data no formato DD/MM/AAAA.</span>}
        </div>
      </Card>

      <Card className="mt-6 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Métricas</h2>
        {loading && <Skeleton />}
        {!loading && result && (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border p-4"><div className="text-xs uppercase opacity-70">R</div><div className="text-2xl font-bold">{result.R}</div></div>
              <div className="rounded-2xl border p-4"><div className="text-xs uppercase opacity-70">Q</div><div className="text-2xl font-bold">{result.Q}</div></div>
              <div className="rounded-2xl border p-4"><div className="text-xs uppercase opacity-70">FP</div><div className="text-2xl font-bold">{result.FP}</div></div>
              <div className="rounded-2xl border p-4"><div className="text-xs uppercase opacity-70">FPC</div><div className="text-2xl font-bold">{result.FPC}</div></div>
              <div className="rounded-2xl border p-4"><div className="text-xs uppercase opacity-70">φ°</div><div className="text-2xl font-bold">{result.phi_deg}°</div></div>
            </div>

            {/* Gráficos existentes */}
            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <div className="rounded-2xl border p-4">
                <div className="text-sm font-medium mb-2">Força e Sensibilidade</div>
                <EnergyBars R={result.R} Q={result.Q} FP={result.FP} />
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-sm font-medium mb-2">Harmonia (FPC) & Ângulo (φ)</div>
                <FpcRadial FPC={result.FPC} phi_deg={result.phi_deg} />
              </div>
            </div>

            {/* NOVO: Radar comparativo */}
            {radarData && (
              <div className="rounded-2xl border p-4 mt-4">
                <div className="text-sm font-medium mb-2">Comparativo — Hoje vs. Semana passada</div>
                <EnergyRadar data={radarData.radar} />
                <div className="grid gap-2 md:grid-cols-5">
                  <Delta label="Δ R" v={radarData.deltas.R} />
                  <Delta label="Δ Q" v={radarData.deltas.Q} />
                  <Delta label="Δ FP" v={radarData.deltas.FP} />
                  <Delta label="Δ FPC%" v={radarData.deltas.FPCpct} />
                  <Delta label="Δ φ°(norm)" v={radarData.deltas.phiPct} />
                </div>
              </div>
            )}

            <div className="rounded-2xl border p-4">
              <div className="text-sm font-medium">Diagnóstico</div>
              <p className="text-sm mt-1">{result.diagnostic.summary}</p>
              <ul className="mt-2 list-disc pl-5 text-sm">{result.diagnostic.actions.map((a, i) => (<li key={i}>{a}</li>))}</ul>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Exportar</div>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" onClick={() => { if (!result) return; const json = JSON.stringify(result, null, 2); navigator.clipboard.writeText(json).then(() => { if (copyRef.current) copyRef.current.value = json; }).catch(() => { if (copyRef.current) copyRef.current.value = json; }); }}>Copiar JSON</Button>
                <Button type="button" onClick={() => { const qs = encodeQuery({ nome, data, sent }); navigator.clipboard.writeText(`${window.location.origin}/energia${qs ? "?" + qs : ""}`); }} variant="secondary">Copiar link</Button>
                <Button type="button" onClick={() => { if (result) exportEnergiaPdf(nome, data, sent, result); }} variant="secondary">Exportar PDF</Button>
                <span className="text-xs opacity-70">Copia/compartilha ou exporta PDF da leitura</span>
              </div>
              <textarea ref={copyRef} readOnly rows={6} className="w-full rounded-xl border p-3 text-xs" placeholder="JSON copiado aparecerá aqui (fallback visual)." />
            </div>
          </>
        )}
        {!loading && !result && <p className="text-sm opacity-70">Preencha os dados e clique em “Calcular energia”.</p>}
      </Card>
    </div>
  );
}
