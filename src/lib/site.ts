export const site = {
  name: "Essence",
  description:
    "Seu código de essência. Sua melhor frequência. Do harmônico de nascimento à defasagem do mundo moderno: entenda, meça e ajuste com rituais simples.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  ogImage: "/og-v2.png", // troque p/ /og.png se preferir
};
