import type { HistItem } from "./history";

export type DayAgg = {
  day: string;              // YYYY-MM-DD
  count: number;
  R_avg: number;
  Q_avg: number;
  FP_avg: number;
  FPC_pct_avg: number;      // 0..100
  PHI_pct_avg: number;      // 0..100
};

export function dayKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function aggregateByDay(items: HistItem[]): DayAgg[] {
  const map = new Map<string, { c: number; R: number; Q: number; FP: number; FPC: number; PHI: number }>();
  for (const it of items) {
    const k = dayKey(it.createdAt);
    const cur = map.get(k) ?? { c: 0, R: 0, Q: 0, FP: 0, FPC: 0, PHI: 0 };
    cur.c += 1;
    cur.R += it.result.R;
    cur.Q += it.result.Q;
    cur.FP += it.result.FP;
    cur.FPC += it.result.FPC * 100;                    // % para radar/graf.
    cur.PHI += (it.result.phi_deg / 180) * 100;        // normalizado 0..100
    map.set(k, cur);
  }
  const out: DayAgg[] = [];
  for (const [k, v] of map.entries()) {
    out.push({
      day: k,
      count: v.c,
      R_avg: +(v.R / v.c).toFixed(2),
      Q_avg: +(v.Q / v.c).toFixed(2),
      FP_avg: +(v.FP / v.c).toFixed(2),
      FPC_pct_avg: +(v.FPC / v.c).toFixed(2),
      PHI_pct_avg: +(v.PHI / v.c).toFixed(2),
    });
  }
  // ordena por data
  out.sort((a, b) => a.day.localeCompare(b.day));
  return out;
}

export function averageOverall(items: HistItem[]) {
  if (!items.length) return { R: 0, Q: 0, FP: 0, FPCpct: 0, PHIpct: 0 };
  const acc = items.reduce(
    (s, it) => {
      s.R += it.result.R;
      s.Q += it.result.Q;
      s.FP += it.result.FP;
      s.FPCpct += it.result.FPC * 100;
      s.PHIpct += (it.result.phi_deg / 180) * 100;
      return s;
    },
    { R: 0, Q: 0, FP: 0, FPCpct: 0, PHIpct: 0 },
  );
  const n = items.length;
  return {
    R: +(acc.R / n).toFixed(2),
    Q: +(acc.Q / n).toFixed(2),
    FP: +(acc.FP / n).toFixed(2),
    FPCpct: +(acc.FPCpct / n).toFixed(2),
    PHIpct: +(acc.PHIpct / n).toFixed(2),
  };
}
