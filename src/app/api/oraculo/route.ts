export async function POST(req: Request) {
  try {
    const { nome, nascimento, sentimentos } = await req.json();

    // mock determinístico simples
    const seed = (String(nome || "").length + String(nascimento || "").length) || 7;
    const rng = (n: number) => Math.abs(Math.sin(seed * n)) % 1;

    const R = parseFloat((0.55 + rng(3) * 0.4).toFixed(2));
    const Q = parseFloat((0.15 + rng(5) * 0.5).toFixed(2));
    const FP = parseFloat((1 - Math.min(1, Math.abs(R - Q))).toFixed(2));
    const FPC = parseFloat(((R * (1 - Q))).toFixed(2));
    const phi = parseFloat((Math.acos(Math.min(1, Math.max(0, FP))) * (180 / Math.PI)).toFixed(0));

    return Response.json({
      pessoa: { nome, nascimento, sentimentos },
      dc: {
        triptico: {
          A: "Talento em síntese e comunicação",
          B: "Força de execução com atenção ao detalhe",
          C: "Propósito ligado a ensinar/organizar saberes",
        },
        destinos: ["Expressão", "Serviço", "Estrutura"],
        notas: "Caldéia + Cabalística + Védica (resumo).",
      },
      ac: { R, Q, FPC, FP, phi },
      recomendacoes: [
        "Respiração 4–7–8 (5 min).",
        "Bloquear 25 min foco hoje.",
        "Evitar telas 60 min antes de dormir.",
      ],
      ts: new Date().toISOString(),
    });
  } catch {
    return new Response(JSON.stringify({ error: "payload inválido" }), { status: 400 });
  }
}
