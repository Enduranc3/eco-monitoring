"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Measurement } from "@/types";

interface PollutionPieChartProps {
  measurement: Measurement;
  stationName: string;
}

const POLLUTANT_CONFIG = [
  { key: "pm25", label: "PM2.5", color: "#ef4444", unit: "мкг/м³" },
  { key: "pm10", label: "PM10", color: "#f97316", unit: "мкг/м³" },
  { key: "no2", label: "NO₂", color: "#8b5cf6", unit: "мкг/м³" },
  { key: "so2", label: "SO₂", color: "#eab308", unit: "мкг/м³" },
  { key: "co", label: "CO", color: "#10b981", unit: "мг/м³" },
  { key: "o3", label: "O₃", color: "#06b6d4", unit: "мкг/м³" },
] as const;

export default function PollutionPieChart({ measurement, stationName }: PollutionPieChartProps) {
  const data = POLLUTANT_CONFIG.map((p) => ({
    name: p.label,
    value: measurement.data[p.key as keyof typeof measurement.data] as number,
    unit: p.unit,
    color: p.color,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-1">
        Структура забруднення
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        {stationName} — розподіл забруднювачів
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            label={(props: { name?: string; percent?: number }) =>
              `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
            }
            labelLine={{ strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
            formatter={(value, name) => {
              const entry = data.find((d) => d.name === name);
              return [`${value} ${entry?.unit ?? ""}`, name];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
