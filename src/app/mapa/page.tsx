"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Resp = {
  pessoa:{nome:string;nascimento:string;sentimentos?:string};
  dc:{triptico:{A:string;B:string;C:string};destinos:string[];notas?:string};
  ac:{R:number;Q:number;FPC:number;FP:number;phi:number};
  recomendacoes:string[];
  ts:string;
};

export default function MapaFree() {
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<Resp|null>(null);
  const [err,setErr]=useState<string|null>(null);
  const [status,setStatus]=useState<string>("");

  const nomeRef = useRef<HTMLInputElement>(null);
  const nascRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef<HTMLInputElement>(null);

  function onDateInput(e: React.FormEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const v = el.value.replace(/[^0-9]/g, "");
    let out = v.slice(0,2);
    if (v.length > 2) out += "/" + v.slice(2,4);
    if (v.length > 4) out += "/" + v.slice(4,8);
    el.value = out;
  }

  async function handleClick() {
    setLoading(true); setData(null); setErr(null); setStatus("enviando...");
    const nome = (nomeRef.current?.value || "").trim();
    const nascimento = (nascRef.current?.value || "").trim();
    const sentimentos = (sentRef.current?.value || "").trim();

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) {
      setErr("Use o formato DD/MM/AAAA."); setLoading(false); return;
    }

    try {
      const res = await fetch("/api/oraculo", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ nome, nascimento, sentimentos })
      });
      setStatus(`POST /api/oraculo -> ${res.status}`);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as Resp;
      setData(json);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg || "Falha ao gerar o mapa (usando fallback).");
      const mock: Resp = {
        pessoa: { nome, nascimento, sentimentos },
        dc: { triptico: { A:"Clareza e síntese", B:"Execução com foco", C:"Propósito em orientar" },
          destinos: ["Expressão","Serviço","Estrutura"], notas:"(fallback)" },
        ac: { R:0.72, Q:0.33, FPC:0.48, FP:0.61, phi:52 },
        recomendacoes: ["Respiração 4–7–8", "1 pomodoro (25 min)", "Desligar telas 60 min antes de dormir"],
        ts: new Date().toISOString(),
      };
      setData(mock);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ if(status) console.info(status); },[status]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Gerar Mapa (Grátis)</h1>
        <p className="text-muted-foreground">Preencha e clique no botão. Se a API falhar, mostramos um resultado de fallback.</p>
      </header>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        {/* Formulário sem submit automático */}
        <form className="space-y-4" noValidate autoComplete="off" onKeyDown={(e)=>{ if(e.key==='Enter') e.preventDefault(); }}>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome completo</label>
            <input ref={nomeRef} id="nome" name="nome" required placeholder="Ex.: Ana Silva"
              className="flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="nascimento" className="block text-sm font-medium mb-1">Data (DD/MM/AAAA)</label>
            <input ref={nascRef} id="nascimento" name="nascimento" required placeholder="10/05/1983"
              inputMode="numeric" pattern="^\\d{2}/\\d{2}/\\d{4}$" onInput={onDateInput}
              className="flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
            <p className="text-xs text-muted-foreground mt-1">Formato: 2 dígitos / 2 dígitos / 4 dígitos.</p>
          </div>

          <div>
            <label htmlFor="sentimentos" className="block text-sm font-medium mb-1">Sentimentos (opcional)</label>
            <input ref={sentRef} id="sentimentos" name="sentimentos" placeholder="ansioso, animado, focado..."
              className="flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {/* Botão explícito, cor forçada p/ não “sumir” */}
          <div className="pt-1">
            <Button
              id="btn-enviar"
              type="button"
              onClick={handleClick}
              size="lg"
              disabled={loading}
              aria-busy={loading}
              className="relative w-full md:w-auto !bg-black !text-white"
            >
              {loading && (
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              <span className={loading ? "opacity-70" : ""}>{loading ? "Gerando..." : "Gerar mapa"}</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">status: {status}</p>
          {err && <p className="text-sm text-red-600" role="alert">erro: {err}</p>}
        </form>
      </div>

      {data && (
        <div className="space-y-6">
          <section className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="text-lg font-semibold mb-2">Resumo</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="text-foreground font-medium">Nome:</span> {data.pessoa.nome}</p>
                <p><span className="text-foreground font-medium">Nascimento:</span> {data.pessoa.nascimento}</p>
                {data.pessoa.sentimentos && <p><span className="text-foreground font-medium">Sentimentos:</span> {data.pessoa.sentimentos}</p>}
                <p className="text-[11px] mt-2">Gerado: {new Date(data.ts).toLocaleString()}</p>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="text-lg font-semibold mb-2">Tríptico (DC)</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="text-foreground font-medium">A:</span> {data.dc.triptico.A}</p>
                <p><span className="text-foreground font-medium">B:</span> {data.dc.triptico.B}</p>
                <p><span className="text-foreground font-medium">C:</span> {data.dc.triptico.C}</p>
                <p className="mt-2"><span className="text-foreground font-medium">Destinos:</span> {data.dc.destinos.join(", ")}</p>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="text-lg font-semibold mb-2">Métricas (AC)</h2>
              <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                <div><span className="text-foreground font-medium">R:</span> {data.ac.R}</div>
                <div><span className="text-foreground font-medium">Q:</span> {data.ac.Q}</div>
                <div><span className="text-foreground font-medium">FPC:</span> {data.ac.FPC}</div>
                <div><span className="text-foreground font-medium">FP:</span> {data.ac.FP}</div>
                <div className="col-span-2"><span className="text-foreground font-medium">φ°:</span> {data.ac.phi}°</div>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2 className="text-lg font-semibold">Resultado (JSON)</h2>
              <Button type="button" variant="outline" size="sm" onClick={async()=>{
                if(!data) return; await navigator.clipboard.writeText(JSON.stringify(data,null,2));
              }}>
                Copiar JSON
              </Button>
            </div>
            <pre className="overflow-x-auto text-xs md:text-sm rounded-xl p-4 bg-muted">
{data ? JSON.stringify(data,null,2) : ""}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}

