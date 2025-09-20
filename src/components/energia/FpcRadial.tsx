"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useTheme } from "next-themes";
import { getChartColors } from "@/lib/theme";

export default function FpcRadial({ FPC, phi_deg }: { FPC: number; phi_deg: number }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = !mounted ? "light" : (theme === "system" ? (systemTheme as "light" | "dark" | undefined) : (theme as "light" | "dark" | undefined));
  const c = getChartColors(current);

  const pct = Math.round(FPC * 100);
  const data = [{ name: "FPC", value: pct, fill: c.radial }];

  return (
    <div className="w-full h-64 relative" key={current}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="60%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "transparent" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{pct}%</div>
        <div className="text-xs opacity-70">FPC</div>
        <div className="mt-1 text-sm">φ = {phi_deg}°</div>
      </div>
    </div>
  );
}
