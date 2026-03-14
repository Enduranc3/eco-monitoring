import Link from "next/link";
import type { MonitoringStation, Measurement } from "@/types";
import { getAqiLabel, getAqiBgClass } from "@/lib/aqi";

interface StationCardProps {
  station: MonitoringStation;
  latestMeasurement?: Measurement;
}

const stationTypeLabels: Record<string, string> = {
  urban: "Міська",
  suburban: "Приміська",
  rural: "Сільська",
  industrial: "Промислова",
  traffic: "Транспортна",
};

export default function StationCard({ station, latestMeasurement }: StationCardProps) {
  const aqiLevel = latestMeasurement?.aqiLevel ?? "good";

  return (
    <Link href={`/stations/${station.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all duration-200 overflow-hidden">
        <div className={`h-2 ${getAqiBgClass(aqiLevel)}`} />
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                {station.name}
              </h3>
              <p className="text-sm text-slate-500">{station.city}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                station.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {station.isActive ? "Активна" : "Неактивна"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{station.address}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {stationTypeLabels[station.type] ?? station.type}
            </span>
            {latestMeasurement && (
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {latestMeasurement.data.aqi}
                </p>
                <p className="text-xs text-slate-500">
                  AQI — {getAqiLabel(aqiLevel)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
