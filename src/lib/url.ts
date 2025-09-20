export function encodeQuery(obj: Record<string, string>) {
  const sp = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v && v.trim().length) sp.set(k, v.trim());
  });
  return sp.toString();
}

export function parseQuery(search: string) {
  const sp = new URLSearchParams(search || "");
  const nome = sp.get("nome") || "";
  const data = sp.get("data") || "";
  const sent = sp.get("sent") || "";
  return { nome, data, sent };
}

export function isValidDateBR(d: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) return false;
  const [dia, mes, ano] = d.split("/").map((x) => parseInt(x, 10));
  const dt = new Date(ano, mes - 1, dia);
  return dt.getFullYear() === ano && dt.getMonth() === mes - 1 && dt.getDate() === dia;
}
