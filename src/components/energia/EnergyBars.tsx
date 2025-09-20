"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function EnergyBars({ R, Q, FP }: { R: number; Q: number; FP: number }) {
  const data = [
    { k: "R", v: R },
    { k: "Q", v: Q },
    { k: "FP", v: FP },
  ];
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="k" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="v" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
