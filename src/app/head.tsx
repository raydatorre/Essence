function abs(path: string) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const fromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const base = fromEnv || fromVercel || "";
  try { return new URL(path, base || "http://localhost:3000").toString(); } catch { return path; }
}

export default function Head() {
  const title = "Essence — Oráculo 3.1";
  const desc =
    "Do harmônico de nascimento à defasagem do mundo moderno: entenda, meça e ajuste.";
  const img = abs("/og-v2.png");

  return (
    <>
      {/* Twitter cards explícitos */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {/* opcional: @username do site/autor, se tiver */}
      {/* <meta name="twitter:site" content="@seuUser" /> */}
      {/* <meta name="twitter:creator" content="@seuUser" /> */}
    </>
  );
}
