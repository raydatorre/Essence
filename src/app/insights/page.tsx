"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadHistory, type HistItem } from "@/lib/history";
import { aggregateByDay, averageOverall } from "@/lib/agg";
import { useTheme } from "next-themes";
import { getChartColors } from "@/lib/theme";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from "recharts";

export default function InsightsPage() {
  const [items, setItems] = useState<HistItem[]>([]);
  const { theme, systemTheme } = useTheme();
  const current = theme === "system" ? (systemTheme as "light" | "dark" | undefined) : (theme as "light" | "dark" | undefined);
  const c = getChartColors(current);

  useEffect(() => setItems(loadHistory()), []);

  const byDay = useMemo(() => aggregateByDay(items), [items]);
  const overall = useMemo(() => averageOverall(items), [items]);

  const radarData = useMemo(
    () => ([
      { k: "R", v: overall.R },
      { k: "Q", v: overall.Q },
      { k: "FP", v: overall.FP },
      { k: "FPC%", v: overall.FPCpct },
      { k: "φ°(norm)", v: overall.PHIpct },
    ]),
    [overall]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Insights do histórico</h1>
        <div className="flex items-center gap-3">
          <Link href="/historico" className="text-sm underline">Histórico</Link>
          <Link href="/" className="text-sm underline">Home</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm opacity-70">
            Ainda não há dados suficientes. Gere leituras em <Link href="/energia" className="underline">/energia</Link>.
          </p>
        </Card>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-3 md:grid-cols-4">
            <Card className="p-4">
              <div className="text-xs opacity-70">Leituras</div>
              <div className="text-2xl font-bold">{items.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs opacity-70">Dias com leituras</div>
              <div className="text-2xl font-bold">{byDay.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs opacity-70">Média FP</div>
              <div className="text-2xl font-bold">{overall.FP}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs opacity-70">FPC médio</div>
              <div className="text-2xl font-bold">{overall.FPCpct}%</div>
            </Card>
          </div>

          {/* Evolução temporal */}
          <Card className="mt-6 p-4">
            <div className="text-sm font-medium mb-2">Evolução (médias por dia)</div>
            <div className="w-full h-72" key={current}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byDay} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke={c.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: c.axis }} />
                  <YAxis tick={{ fill: c.axis }} />
                  <Tooltip contentStyle={{ background: current === "dark" ? "rgba(17,24,39,0.9)" : "#fff", color: current === "dark" ? "#fff" : "#111827", border: "none" }} />
                  <Legend />
                  <Line type="monotone" dataKey="R_avg" name="R" stroke={c.bar} dot={false} />
                  <Line type="monotone" dataKey="Q_avg" name="Q" stroke="#22c55e" dot={false} />
                  <Line type="monotone" dataKey="FP_avg" name="FP" stroke="#f59e0b" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Volume por dia */}
          <Card className="mt-6 p-4">
            <div className="text-sm font-medium mb-2">Leituras por dia</div>
            <div className="w-full h-64" key={`${current}-bar`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke={c.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: c.axis }} />
                  <YAxis tick={{ fill: c.axis }} />
                  <Tooltip contentStyle={{ background: current === "dark" ? "rgba(17,24,39,0.9)" : "#fff", color: current === "dark" ? "#fff" : "#111827", border: "none" }} />
                  <Bar dataKey="count" fill={c.bar} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Radar de médias gerais */}
          <Card className="mt-6 p-4">
            <div className="text-sm font-medium mb-2">Médias gerais</div>
            <div className="w-full h-80" key={`${current}-radar`}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke={c.grid} />
                  <PolarAngleAxis dataKey="k" tick={{ fill: c.axis }} />
                  <PolarRadiusAxis tick={{ fill: c.axis }} />
                  <Tooltip contentStyle={{ background: current === "dark" ? "rgba(17,24,39,0.9)" : "#fff", color: current === "dark" ? "#fff" : "#111827", border: "none" }} />
                  <Radar name="Média" dataKey="v" fill={c.radial} fillOpacity={0.4} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* CTA voltar para calcular mais */}
          <div className="mt-6">
            <Button asChild><Link href="/energia">Nova leitura</Link></Button>
          </div>
        </>
      )}
    </div>
  );
}
