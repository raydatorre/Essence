import jsPDF from "jspdf";
import { EnergiaOutput } from "./energia";

export function exportEnergiaPdf(nome: string, data: string, sent: string, result: EnergiaOutput) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");

  doc.setFontSize(18);
  doc.text("Relatório de Energia", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Nome: ${nome}`, 20, 40);
  doc.text(`Data de Nascimento: ${data}`, 20, 50);
  if (sent) doc.text(`Sentimentos: ${sent}`, 20, 60);

  doc.setFontSize(14);
  doc.text("Métricas", 20, 80);
  doc.setFontSize(12);
  doc.text(`R: ${result.R}`, 20, 90);
  doc.text(`Q: ${result.Q}`, 20, 100);
  doc.text(`FP: ${result.FP}`, 20, 110);
  doc.text(`FPC: ${result.FPC}`, 20, 120);
  doc.text(`φ°: ${result.phi_deg}`, 20, 130);

  doc.setFontSize(14);
  doc.text("Diagnóstico", 20, 150);
  doc.setFontSize(12);
  doc.text(result.diagnostic.summary, 20, 160, { maxWidth: 170 });

  let y = 180;
  result.diagnostic.actions.forEach((a) => {
    doc.text(`- ${a}`, 25, y, { maxWidth: 170 });
    y += 10;
  });

  const filename = `energia-${nome.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
