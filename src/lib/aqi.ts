import type { AQILevel } from "@/types";

export function getAqiLevel(aqi: number): AQILevel {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy_sensitive";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "very_unhealthy";
  return "hazardous";
}

export function getAqiColor(level: AQILevel): string {
  const colors: Record<AQILevel, string> = {
    good: "#22c55e",
    moderate: "#eab308",
    unhealthy_sensitive: "#f97316",
    unhealthy: "#ef4444",
    very_unhealthy: "#7c3aed",
    hazardous: "#991b1b",
  };
  return colors[level];
}

export function getAqiLabel(level: AQILevel): string {
  const labels: Record<AQILevel, string> = {
    good: "Добре",
    moderate: "Помірно",
    unhealthy_sensitive: "Шкідливо для чутливих груп",
    unhealthy: "Шкідливо",
    very_unhealthy: "Дуже шкідливо",
    hazardous: "Небезпечно",
  };
  return labels[level];
}

export function getAqiBgClass(level: AQILevel): string {
  const classes: Record<AQILevel, string> = {
    good: "bg-green-500",
    moderate: "bg-yellow-500",
    unhealthy_sensitive: "bg-orange-500",
    unhealthy: "bg-red-500",
    very_unhealthy: "bg-purple-600",
    hazardous: "bg-red-900",
  };
  return classes[level];
}

export function getAqiTextClass(level: AQILevel): string {
  const classes: Record<AQILevel, string> = {
    good: "text-green-600",
    moderate: "text-yellow-600",
    unhealthy_sensitive: "text-orange-600",
    unhealthy: "text-red-600",
    very_unhealthy: "text-purple-700",
    hazardous: "text-red-900",
  };
  return classes[level];
}
