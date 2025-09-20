export function getChartColors(theme: "light" | "dark" | undefined) {
  const isDark = theme === "dark";
  return {
    grid: isDark ? "#374151" : "#e5e7eb",     // gray-700 / gray-200
    axis: isDark ? "#d1d5db" : "#374151",     // gray-300 / gray-700
    bar:  isDark ? "#93c5fd" : "#60a5fa",     // blue-300 / blue-400
    radial: isDark ? "#c4b5fd" : "#a78bfa",   // violet-300 / violet-400
  };
}
