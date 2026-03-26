"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { MonitoringStation, Measurement } from "@/types";
import { getAqiColor } from "@/lib/aqi";

interface StationBarChartProps {
  stations: MonitoringStation[];
  latestMeasurements: Record<string, Measurement>;
  selectedStationId: string | null;
}

export default function StationBarChart({
  stations,
  latestMeasurements,
  selectedStationId,
}: StationBarChartProps) {
  const data = stations
    .filter((s) => latestMeasurements[s.id])
    .map((s) => {
      const m = latestMeasurements[s.id]!;
      return {
        name: s.name,
        id: s.id,
        aqi: m.data.aqi,
        pm25: m.data.pm25,
        pm10: m.data.pm10,
        aqiLevel: m.aqiLevel,
      };
    })
    .sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-1">
        Порівняння станцій за AQI
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Поточні значення індексу якості повітря
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            angle={-25}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                aqi: "AQI",
                pm25: "PM2.5 (мкг/м³)",
                pm10: "PM10 (мкг/м³)",
              };
              return [value, labels[String(name)] ?? name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Bar dataKey="aqi" name="AQI" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={getAqiColor(entry.aqiLevel)}
                stroke={entry.id === selectedStationId ? "#0f172a" : "none"}
                strokeWidth={entry.id === selectedStationId ? 2 : 0}
              />
            ))}
          </Bar>
          <Bar dataKey="pm25" name="PM2.5" fill="#ef4444" opacity={0.6} radius={[4, 4, 0, 0]} />
          <Bar dataKey="pm10" name="PM10" fill="#f97316" opacity={0.6} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
