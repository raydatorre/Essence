"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "next-themes";
import { getChartColors } from "@/lib/theme";

export default function EnergyBars({ R, Q, FP }: { R: number; Q: number; FP: number }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = !mounted ? "light" : (theme === "system" ? (systemTheme as "light" | "dark" | undefined) : (theme as "light" | "dark" | undefined));
  const c = getChartColors(current);

  const data = [{ k: "R", v: R }, { k: "Q", v: Q }, { k: "FP", v: FP }];

  return (
    <div className="w-full h-64" key={current}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={c.grid} strokeDasharray="3 3" />
          <XAxis dataKey="k" tick={{ fill: c.axis }} axisLine={{ stroke: c.axis }} tickLine={{ stroke: c.axis }} />
          <YAxis tick={{ fill: c.axis }} axisLine={{ stroke: c.axis }} tickLine={{ stroke: c.axis }} />
          <Tooltip contentStyle={{ background: current === "dark" ? "rgba(17,24,39,0.9)" : "#fff", color: current === "dark" ? "#fff" : "#111827", border: "none" }} />
          <Bar dataKey="v" fill={c.bar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
