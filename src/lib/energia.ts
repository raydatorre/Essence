export type EnergiaInput = {
  nome: string;
  data: string;       // DD/MM/AAAA
  sentimentos: string;
};

export type EnergiaOutput = {
  R: number;
  Q: number;
  FP: number;
  FPC: number;    // R / FP
  phi_deg: number; // em graus
  diagnostic: {
    summary: string;
    actions: string[];
  };
};

// Hash simples determinístico
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function parseData(d: string): { dia: number; mes: number; ano: number } {
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return { dia: 1, mes: 1, ano: 2000 };
  return { dia: parseInt(m[1], 10), mes: parseInt(m[2], 10), ano: parseInt(m[3], 10) };
}

export function computeEnergiaMock(input: EnergiaInput): EnergiaOutput {
  const { nome, data, sentimentos } = input;
  const { dia, mes, ano } = parseData(data);

  // Base determinística
  const seed = hashStr(`${nome}|${data}|${sentimentos}`);
  // Componentes pseudo-aleatórios, mas estáveis
  const a = (seed % 97) / 97;             // 0..~1
  const b = ((seed >>> 7) % 89) / 89;     // 0..~1
  const c = ((seed >>> 13) % 83) / 83;    // 0..~1

  // R e Q com faixas razoáveis
  let R = Math.round(50 + 35 * a + (dia % 7)); // 50–92 aprox.
  let Q = Math.round(20 + 55 * b + (mes % 9)); // 20–84 aprox.

  // Ajustes leves por ano e tamanho de sentimentos
  const lenFeel = Math.min(sentimentos.trim().length, 500);
  R = Math.max(35, Math.min(95, R + ((ano % 10) - 5) + Math.floor(lenFeel / 120)));
  Q = Math.max(10, Math.min(90, Q + ((ano % 7) - 3) + Math.floor(lenFeel / 80)));

  const FP = Math.sqrt(R * R + Q * Q);
  const FPC = +(R / FP).toFixed(3);
  const phi_rad = Math.atan2(Q, R);
  const phi_deg = +((phi_rad * 180) / Math.PI).toFixed(1);

  // Diagnóstico simples conforme quadrante
  const summary =
    phi_deg < 25
      ? "Energia focada (DC dominante): boa direção, risco de rigidez."
      : phi_deg < 45
      ? "Energia balanceada: boa tração com sensibilidade adequada."
      : "Energia difusa (AC dominante): alta sensibilidade, risco de dispersão.";

  const actions =
    phi_deg < 25
      ? [
          "Adicionar pausas de respiração 4-7-8 entre blocos de trabalho.",
          "Delegar 1 tarefa operacional hoje.",
          "Reservar 25 min de revisão criativa (sem meta de entrega).",
        ]
      : phi_deg < 45
      ? [
          "Proteger 2 blocos de foco profundo (50min) no dia.",
          "Fazer check-in emocional de 5 min antes de reuniões-chave.",
          "Registrar 3 aprendizados ao final do dia.",
        ]
      : [
          "Definir 3 critérios de aceite objetivos para a principal tarefa.",
          "Limitar fontes de distração por 90 min.",
          "Fechar o dia com um 'próximo passo único' escrito.",
        ];

  return {
    R,
    Q,
    FP: +FP.toFixed(1),
    FPC,
    phi_deg,
    diagnostic: { summary, actions },
  };
}
