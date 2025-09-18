"use client";
import { useState } from "react";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setData(null); setErr(null); setStatus("enviando...");
    const fd = new FormData(e.currentTarget);
    const nome = String(fd.get("nome")||"");
    const nascimento = String(fd.get("nascimento")||"");
    const sentimentos = String(fd.get("sentimentos")||"");

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
    } catch (e:any) {
      setErr(e?.message || "Falha ao gerar o mapa (usando fallback).");
      // Fallback local sempre mostra algo
      const mock: Resp = {
        pessoa: { nome, nascimento, sentimentos },
        dc: {
          triptico: { A:"Clareza e síntese", B:"Execução com foco", C:"Propósito em orientar" },
          destinos: ["Expressão","Serviço","Estrutura"], notas:"(fallback)"
        },
        ac: { R:0.72, Q:0.33, FPC:0.48, FP:0.61, phi:52 },
        recomendacoes: ["Respiração 4–7–8", "1 pomodoro (25 min)", "Desligar telas 60 min antes de dormir"],
        ts: new Date().toISOString(),
      };
      setData(mock);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Gerar Mapa (Grátis)</h1>
        <p className="text-muted-foreground">Preencha e clique no botão. Se a API falhar, mostramos um resultado de fallback.</p>
      </header>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome completo</label>
            <input id="nome" name="nome" required placeholder="Ex.: Ana Silva"
              className="flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="nascimento" className="block text-sm font-medium mb-1">Data (DD/MM/AAAA)</label>
            <input id="nascimento" name="nascimento" required placeholder="10/05/1983" inputMode="numeric"
              onChange={(e)=>{
                const v=e.currentTarget.value.replace(/[^0-9]/g,"");
                let out=v.slice(0,2); if(v.length>2) out+="/"+v.slice(2,4); if(v.length>4) out+="/"+v.slice(4,8);
                e.currentTarget.value=out;
              }}
              className="flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="sentimentos" className="block text-sm font-medium mb-1">Sentimentos (opcional)</label>
            <input id="sentimentos" name="sentimentos" placeholder="ansioso, animado, focado..."
              className="flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {/* BOTÃO NATIVO GARANTIDO */}
          <div className="pt-1">
            <button
              type="submit"
              data-testid="submit-mapa"
              style={{display:"block"}}
              className="w-full md:w-auto h-12 rounded-2xl border bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Gerando..." : "Gerar mapa"}
            </button>
          </div>
        </form>

        {/* debug leve */}
        <p className="text-xs text-muted-foreground">status: {status}</p>
        {err && <p className="text-sm text-red-600">erro: {err}</p>}
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
            <h2 className="text-lg font-semibold mb-2">Recomendações</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {data.recomendacoes.map((r,i)=><li key={i}>{r}</li>)}
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="text-lg font-semibold mb-2">Resultado (JSON)</h2>
            <pre className="overflow-x-auto text-xs md:text-sm rounded-xl p-4 bg-muted">{JSON.stringify(data,null,2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
