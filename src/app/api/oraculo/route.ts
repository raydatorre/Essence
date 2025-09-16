import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const nome = body?.nome || "Usuário";
  const FPC = 72/Math.sqrt(72*72+28*28);
  const phi = Math.atan2(28,72)*(180/Math.PI);
  const FP = 1 - Math.min(Math.abs(phi),90)/90;

  const result = {
    block_A_map: `Mapa inicial de ${nome}: síntese Caldéia+Cabalística+Védica (exemplo).`,
    block_B_harmonic: "Harmônico 3.0: seus números indicam expressão e estrutura (exemplo).",
    block_C_energy: "Energia DC/AC: cenário simulado para exibir layout (exemplo).",
    block_D_esoteric: "Correspondências esotéricas (exemplo).",
    block_E_triptych: {
      eli5: "Você tem um ‘tom’ de nascimento e pequenas ações te trazem de volta.",
      scientist: "Modelagem por componentes real/imaginária; φ° mede defasagem; FPC = R/√(R²+Q²).",
      poet: "Entre as notas do que é e do que parece, há um ângulo. Vamos afiná-lo.",
    },
    metrics: {
      R: 72, Q: 28, DC: 72, AC_real: 72, AC_imag: 28,
      FPC, phi_deg: phi, FP,
      Q_factors: [{ name: "Sobrecarga digital", value: 0.6 },{ name: "Sono irregular", value: 0.5 }],
      biggest_leak: "Essência/DC",
      diagnostic: {
        summary: "Defasagem moderada, com vazamento em Essência/DC (rotina).",
        actions: ["Respiração 4-7-8, 2x/dia por 3 dias","Caminhada consciente 12 min, 4 dias","Jejum digital 30 min antes de dormir, 5 dias"]
      }
    }
  };
  return NextResponse.json({ ok: true, result });
}

export async function GET() {
  return NextResponse.json({ hello: "oraculo-api", status: "mock" });
}
