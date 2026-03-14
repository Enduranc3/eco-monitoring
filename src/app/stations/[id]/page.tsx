import { notFound } from "next/navigation";
import Link from "next/link";
import { stations } from "@/data/stations";
import { getMeasurementsByStation } from "@/data/measurements";
import { getAqiLevel, getAqiLabel, getAqiBgClass } from "@/lib/aqi";
import type { StationStats } from "@/types";
import AqiGauge from "@/components/AqiGauge";
import PollutantBar from "@/components/PollutantBar";


export const dynamic = "force-dynamic";

const stationTypeLabels: Record<string, string> = {
  urban: "Міська",
  suburban: "Приміська",
  rural: "Сільська",
  industrial: "Промислова",
  traffic: "Транспортна",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const station = stations.find((s) => s.id === id);
  if (!station) return { title: "Станцію не знайдено" };
  return {
    title: `${station.name} — EcoMonitor`,
    description: `Детальна інформація про моніторингову станцію ${station.name}`,
  };
}

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = stations.find((s) => s.id === id);
  if (!station) notFound();

  const measurements = getMeasurementsByStation(id);
  const latestMeasurement = measurements[measurements.length - 1];
  const aqiValues = measurements.map((m) => m.data.aqi);

  const stats: StationStats = {
    stationId: id,
    averageAqi: Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length),
    minAqi: Math.min(...aqiValues),
    maxAqi: Math.max(...aqiValues),
    aqiLevel: getAqiLevel(
      Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length)
    ),
    measurementCount: measurements.length,
    lastUpdated: latestMeasurement?.timestamp ?? "",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          Головна
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{station.name}</span>
      </nav>

      {/* Station Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {station.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  station.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {station.isActive ? "Активна" : "Неактивна"}
              </span>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                <strong>Адреса:</strong> {station.address}, {station.city}
              </p>
              <p>
                <strong>Тип:</strong>{" "}
                {stationTypeLabels[station.type] ?? station.type}
              </p>
              <p>
                <strong>Координати:</strong> {station.coordinates.latitude},{" "}
                {station.coordinates.longitude}
              </p>
              <p>
                <strong>Встановлена:</strong>{" "}
                {new Date(station.installedAt).toLocaleDateString("uk-UA")}
              </p>
            </div>
          </div>

          {latestMeasurement && (
            <AqiGauge value={latestMeasurement.data.aqi} size="lg" />
          )}
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-sm text-slate-500">Середній AQI</p>
          <p className="text-2xl font-bold text-slate-900">{stats.averageAqi}</p>
          <p className="text-xs mt-1">
            <span className={`inline-block w-2 h-2 rounded-full ${getAqiBgClass(stats.aqiLevel)} mr-1`} />
            {getAqiLabel(stats.aqiLevel)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-sm text-slate-500">Мін. AQI</p>
          <p className="text-2xl font-bold text-green-600">{stats.minAqi}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-sm text-slate-500">Макс. AQI</p>
          <p className="text-2xl font-bold text-red-600">{stats.maxAqi}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-sm text-slate-500">Вимірювань</p>
          <p className="text-2xl font-bold text-slate-900">{stats.measurementCount}</p>
        </div>
      </div>

      {/* Current Pollutant Levels */}
      {latestMeasurement && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Поточні показники забруднювачів
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Останнє оновлення:{" "}
            {new Date(latestMeasurement.timestamp).toLocaleString("uk-UA")}
          </p>
          <div className="space-y-4">
            <PollutantBar
              pollutantId="pm25"
              value={latestMeasurement.data.pm25}
            />
            <PollutantBar
              pollutantId="pm10"
              value={latestMeasurement.data.pm10}
            />
            <PollutantBar
              pollutantId="no2"
              value={latestMeasurement.data.no2}
            />
            <PollutantBar
              pollutantId="so2"
              value={latestMeasurement.data.so2}
            />
            <PollutantBar
              pollutantId="co"
              value={latestMeasurement.data.co}
            />
            <PollutantBar
              pollutantId="o3"
              value={latestMeasurement.data.o3}
            />
          </div>
        </div>
      )}

      {/* Measurement History Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Останні вимірювання
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-500">Час</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">AQI</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">PM2.5</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">PM10</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">NO₂</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">SO₂</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">CO</th>
                <th className="text-right py-3 px-2 font-medium text-slate-500">O₃</th>
              </tr>
            </thead>
            <tbody>
              {measurements
                .slice(-24)
                .reverse()
                .map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 px-2">
                      {new Date(m.timestamp).toLocaleString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-2 text-right font-medium">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs text-white ${getAqiBgClass(
                          m.aqiLevel
                        )}`}
                      >
                        {m.data.aqi}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">{m.data.pm25}</td>
                    <td className="py-2 px-2 text-right">{m.data.pm10}</td>
                    <td className="py-2 px-2 text-right">{m.data.no2}</td>
                    <td className="py-2 px-2 text-right">{m.data.so2}</td>
                    <td className="py-2 px-2 text-right">{m.data.co}</td>
                    <td className="py-2 px-2 text-right">{m.data.o3}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
