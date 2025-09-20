import type { EnergiaOutput } from "./energia";

// hash simples e determinístico
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}
// clamp util
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export type RadarData = Array<{ k: string; atual: number; passada: number }>;

export function makeComparison(base: EnergiaOutput, seedKey: string) {
  // normalizações para o radar (0–100)
  const FPCpct = Math.round(base.FPC * 100);
  const phiPct = Math.round((base.phi_deg / 180) * 100);

  // gera offsets determinísticos levinhos (±3–12%)
  const h = hashStr(seedKey || JSON.stringify(base));
  const n01 = (i: number) => ((h >> (i * 5)) & 1023) / 1023; // [0..1] estável
  const mkDelta = (i: number) => (0.03 + n01(i) * 0.09) * (n01(i + 1) > 0.5 ? 1 : -1); // ±(3..12%)

  const offR = mkDelta(0);
  const offQ = mkDelta(1);
  const offFP = mkDelta(2);
  const offFPC = mkDelta(3);
  const offPhi = mkDelta(4);

  const atual = {
    R: clamp(Math.round(base.R), 0, 100),
    Q: clamp(Math.round(base.Q), 0, 100),
    FP: clamp(Math.round(base.FP), 0, 100),
    FPCpct,
    phiPct,
  };

  const passada = {
    R: clamp(Math.round(atual.R * (1 + offR)), 0, 100),
    Q: clamp(Math.round(atual.Q * (1 + offQ)), 0, 100),
    FP: clamp(Math.round(atual.FP * (1 + offFP)), 0, 100),
    FPCpct: clamp(Math.round(FPCpct * (1 + offFPC)), 0, 100),
    phiPct: clamp(Math.round(phiPct * (1 + offPhi)), 0, 100),
  };

  const radar: RadarData = [
    { k: "R", atual: atual.R, passada: passada.R },
    { k: "Q", atual: atual.Q, passada: passada.Q },
    { k: "FP", atual: atual.FP, passada: passada.FP },
    { k: "FPC%", atual: atual.FPCpct, passada: passada.FPCpct },
    { k: "φ°(norm)", atual: atual.phiPct, passada: passada.phiPct },
  ];

  const deltas = {
    R: atual.R - passada.R,
    Q: atual.Q - passada.Q,
    FP: atual.FP - passada.FP,
    FPCpct: atual.FPCpct - passada.FPCpct,
    phiPct: atual.phiPct - passada.phiPct,
  };

  return { radar, deltas };
}
