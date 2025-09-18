export type OraculoResponse = {
  pessoa: { nome: string; nascimento: string; sentimentos?: string };
  dc: {
    triptico: { A: string; B: string; C: string };
    destinos: string[];
    notas?: string;
  };
  ac: {
    R: number;   // força real (0..1)
    Q: number;   // carga externa (0..1)
    FPC: number; // coeficiente (0..1)
    FP: number;  // fator de potência (0..1)
    phi: number; // defasagem em graus (0..90)
  };
  recomendacoes: string[];
  ts: string; // ISO
};
