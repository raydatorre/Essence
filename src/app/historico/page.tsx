"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadHistory, deleteFromHistory, clearHistory, toCSV, type HistItem } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HistoricoPage() {
  const [items, setItems] = useState<HistItem[]>([]);
  const [q, setQ] = useState("");

  const refresh = () => setItems(loadHistory());
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(i =>
      i.nome.toLowerCase().includes(term) ||
      i.data.includes(term) ||
      (i.sent || "").toLowerCase().includes(term)
    );
  }, [items, q]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historico-energia.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportCSV = () => {
    const csv = toCSV(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historico-energia.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const openInEnergia = (i: HistItem) => {
    const sp = new URLSearchParams({ nome: i.nome, data: i.data, sent: i.sent || "" });
    window.location.href = `/energia?${sp.toString()}`;
  };

  const removeOne = (id: string) => {
    deleteFromHistory(id);
    refresh();
  };

  const clearAll = () => {
    if (!confirm("Limpar todo o histórico?")) return;
    clearHistory(); refresh();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Histórico de leituras</h1>
        <Link href="/" className="text-sm underline">Home</Link>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome, data ou sentimento..." className="w-72" />
          <Button type="button" onClick={exportCSV} variant="secondary">Exportar CSV</Button>
          <Button type="button" onClick={exportJSON} variant="secondary">Exportar JSON</Button>
          <Button type="button" onClick={clearAll} variant="secondary">Limpar tudo</Button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm opacity-70">Sem leituras ainda. Gere uma em <Link href="/energia" className="underline">/energia</Link>.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(i => (
            <Card key={i.id} className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">{i.nome}</span> — {i.data}
                </div>
                <div className="text-xs opacity-70">
                  {new Date(i.createdAt).toLocaleString()} • R:{i.result.R} Q:{i.result.Q} FP:{i.result.FP} FPC:{i.result.FPC} φ:{i.result.phi_deg}°
                </div>
                {i.sent && <div className="text-xs italic opacity-80">“{i.sent}”</div>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={()=>openInEnergia(i)}>Abrir no Energia</Button>
                <Button type="button" onClick={()=>removeOne(i.id)} variant="secondary">Excluir</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
