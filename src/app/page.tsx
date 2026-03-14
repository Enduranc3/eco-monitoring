import { stations } from "@/data/stations";
import { getLatestMeasurement, getAllMeasurements } from "@/data/measurements";
import { getAqiLevel } from "@/lib/aqi";
import { getAqiLabel, getAqiBgClass } from "@/lib/aqi";
import StationCard from "@/components/StationCard";

export const dynamic = "force-dynamic";

interface OverallStats {
  totalStations: number;
  activeStations: number;
  averageAqi: number;
  goodCount: number;
  moderateCount: number;
  unhealthyCount: number;
}

function computeOverallStats(): OverallStats {
  const activeStations = stations.filter((s) => s.isActive);
  const latestReadings = activeStations
    .map((s) => getLatestMeasurement(s.id))
    .filter((m) => m !== undefined);

  const aqiValues = latestReadings.map((m) => m.data.aqi);
  const avgAqi =
    aqiValues.length > 0
      ? Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length)
      : 0;

  return {
    totalStations: stations.length,
    activeStations: activeStations.length,
    averageAqi: avgAqi,
    goodCount: latestReadings.filter((m) => m.data.aqi <= 50).length,
    moderateCount: latestReadings.filter(
      (m) => m.data.aqi > 50 && m.data.aqi <= 100
    ).length,
    unhealthyCount: latestReadings.filter((m) => m.data.aqi > 100).length,
  };
}

export default function HomePage() {
  // SSR: all data is fetched on the server
  getAllMeasurements();
  const stats = computeOverallStats();
  const avgLevel = getAqiLevel(stats.averageAqi);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Моніторинг якості повітря
        </h1>
        <p className="text-slate-600 text-lg">
          Актуальні дані з моніторингових станцій у реальному часі
        </p>
      </section>

      {/* Overall Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Всього станцій</p>
          <p className="text-3xl font-bold text-slate-900">{stats.totalStations}</p>
          <p className="text-sm text-emerald-600 mt-1">
            {stats.activeStations} активних
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Середній AQI</p>
          <p className="text-3xl font-bold text-slate-900">{stats.averageAqi}</p>
          <p className="text-sm mt-1">
            <span className={`inline-block w-2 h-2 rounded-full ${getAqiBgClass(avgLevel)} mr-1`} />
            {getAqiLabel(avgLevel)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Стан &quot;Добре&quot;</p>
          <p className="text-3xl font-bold text-green-600">{stats.goodCount}</p>
          <p className="text-sm text-slate-500 mt-1">станцій</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Потребує уваги</p>
          <p className="text-3xl font-bold text-orange-600">
            {stats.moderateCount + stats.unhealthyCount}
          </p>
          <p className="text-sm text-slate-500 mt-1">станцій</p>
        </div>
      </section>

      {/* Stations Grid */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Моніторингові станції
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              latestMeasurement={getLatestMeasurement(station.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
