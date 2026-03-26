"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Measurement } from "@/types";

interface AqiLineChartProps {
  measurements: Measurement[];
  stationName: string;
}

const POLLUTANT_LINES = [
  { key: "aqi", name: "AQI", color: "#0f172a" },
  { key: "pm25", name: "PM2.5", color: "#ef4444" },
  { key: "pm10", name: "PM10", color: "#f97316" },
  { key: "no2", name: "NO₂", color: "#8b5cf6" },
  { key: "so2", name: "SO₂", color: "#eab308" },
  { key: "o3", name: "O₃", color: "#06b6d4" },
] as const;

export default function AqiLineChart({ measurements, stationName }: AqiLineChartProps) {
  const last48 = measurements.slice(-48);

  const data = last48.map((m) => ({
    time: new Date(m.timestamp).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    aqi: m.data.aqi,
    pm25: m.data.pm25,
    pm10: m.data.pm10,
    no2: m.data.no2,
    so2: m.data.so2,
    o3: m.data.o3,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-1">
        Динаміка показників
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        {stationName} — останні 48 годин
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            interval={Math.max(0, Math.floor(data.length / 8) - 1)}
          />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
          {POLLUTANT_LINES.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.key === "aqi" ? 2.5 : 1.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
