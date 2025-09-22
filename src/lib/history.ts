import type { EnergiaOutput } from "./energia";

const KEY = "energia:historico:v1";

export type HistItem = {
  id: string;
  nome: string;
  data: string;
  sent: string;
  createdAt: string;
  result: EnergiaOutput;
};

export function loadHistory(): HistItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as HistItem[];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export function saveHistory(items: HistItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
}

export function addToHistory(entry: Omit<HistItem, "id" | "createdAt">) {
  const items = loadHistory();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const createdAt = new Date().toISOString();
  const full = { id, createdAt, ...entry };
  items.unshift(full);
  saveHistory(items);

  // sincroniza com backend (agora DB real)
  try {
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(full), // envia createdAt/id para preservar no import também
    }).catch(() => {});
  } catch {}

  return id;
}

export function deleteFromHistory(id: string) {
  const items = loadHistory().filter(i => i.id !== id);
  saveHistory(items);
}

export function clearHistory() {
  saveHistory([]);
}

export function toCSV(items: HistItem[]) {
  const header = ["id","createdAt","nome","data","sent","R","Q","FP","FPC","phi_deg","summary","actions"].join(",");
  const rows = items.map(i => {
    const a = (i.result.diagnostic.actions || []).join(" | ");
    const s = (i.result.diagnostic.summary || "").replace(/\n/g," ").replace(/"/g,'""');
    const sent = (i.sent || "").replace(/\n/g," ").replace(/"/g,'""');
    return [
      i.id, i.createdAt, `"${i.nome}"`, i.data, `"${sent}"`,
      i.result.R, i.result.Q, i.result.FP, i.result.FPC, i.result.phi_deg,
      `"${s}"`, `"${a}"`
    ].join(",");
  });
  return [header, ...rows].join("\n");
}
