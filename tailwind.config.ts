import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        muted: "rgb(var(--muted))",
        card: "rgb(var(--card))",
        primary: { DEFAULT: "rgb(var(--primary))" },
        accent: { DEFAULT: "rgb(var(--accent))" },
        "muted-foreground": "rgb(var(--muted-foreground))",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
