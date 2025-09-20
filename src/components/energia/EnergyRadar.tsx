"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { getChartColors } from "@/lib/theme";
import type { RadarData } from "@/lib/trend";

export default function EnergyRadar({ data }: { data: RadarData }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = !mounted ? "light" : (theme === "system" ? (systemTheme as "light" | "dark" | undefined) : (theme as "light" | "dark" | undefined));
  const c = getChartColors(current);

  return (
    <div className="w-full h-80" key={current}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke={c.grid} />
          <PolarAngleAxis dataKey="k" tick={{ fill: c.axis }} />
          <PolarRadiusAxis tick={{ fill: c.axis }} axisLine={{ stroke: c.axis }} />
          <Tooltip contentStyle={{ background: current === "dark" ? "rgba(17,24,39,0.9)" : "#fff", color: current === "dark" ? "#fff" : "#111827", border: "none" }} />
          <Radar name="Hoje" dataKey="atual" fill={c.bar} fillOpacity={0.45} />
          <Radar name="Semana passada" dataKey="passada" fill={c.radial} fillOpacity={0.35} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
