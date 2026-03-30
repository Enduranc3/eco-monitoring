"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { MonitoringStation, Measurement } from "@/types";
import { getAqiColor, getAqiLabel } from "@/lib/aqi";
import { trackEvent } from "@/lib/analytics";
import AqiLineChart from "./AqiLineChart";
import StationBarChart from "./StationBarChart";
import PollutionPieChart from "./PollutionPieChart";

const MonitoringMap = dynamic(() => import("./MonitoringMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
      <p className="text-slate-400">Завантаження карти...</p>
    </div>
  ),
});

interface DashboardClientProps {
  stations: MonitoringStation[];
  latestMeasurements: Record<string, Measurement>;
  allMeasurements: Record<string, Measurement[]>;
}

type ChartTab = "line" | "bar" | "pie";

export default function DashboardClient({
  stations,
  latestMeasurements,
  allMeasurements,
}: DashboardClientProps) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ChartTab>("bar");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [simulateWidgetError, setSimulateWidgetError] = useState(false);

  const cityOptions = useMemo(
    () => ["all", ...new Set(stations.map((station) => station.city))],
    [stations]
  );

  const filteredStations = useMemo(() => {
    if (cityFilter === "all") {
      return stations;
    }

    return stations.filter((station) => station.city === cityFilter);
  }, [cityFilter, stations]);

  const selectedStation = useMemo(
    () => filteredStations.find((s) => s.id === selectedStationId),
    [filteredStations, selectedStationId]
  );

  const selectedMeasurement = selectedStationId
    ? latestMeasurements[selectedStationId]
    : undefined;

  const selectedTimeSeries = selectedStationId
    ? allMeasurements[selectedStationId] ?? []
    : [];

  function handleStationSelect(stationId: string | null, source: string = "list") {
    if (stationId === selectedStationId) {
      setSelectedStationId(null);
      setActiveTab("bar");
      trackEvent("map_interaction", {
        action: "station_deselected",
        interaction_source: source,
      });
    } else {
      const station = filteredStations.find((item) => item.id === stationId);
      setSelectedStationId(stationId);
      setActiveTab("line");

      if (station) {
        trackEvent("map_interaction", {
          action: "station_selected",
          interaction_source: source,
          station_id: station.id,
          station_name: station.name,
          city: station.city,
        });
      }
    }
  }

  function handleReset() {
    setSelectedStationId(null);
    setActiveTab("bar");
    trackEvent("map_interaction", {
      action: "selection_reset",
      interaction_source: "dashboard_panel",
    });
  }

  function handleCityFilterChange(nextCity: string) {
    const nextStations =
      nextCity === "all"
        ? stations
        : stations.filter((station) => station.city === nextCity);

    if (
      selectedStationId &&
      !nextStations.some((station) => station.id === selectedStationId)
    ) {
      setSelectedStationId(null);
      setActiveTab("bar");
    }

    setCityFilter(nextCity);
    trackEvent("filter_applied", {
      filter_name: "city",
      filter_value: nextCity,
      station_count: nextStations.length,
    });
  }

  function handleTabChange(tab: ChartTab) {
    setActiveTab(tab);
    trackEvent("chart_view", {
      chart_type: tab,
      station_id: selectedStation?.id,
      station_name: selectedStation?.name,
      city_filter: cityFilter,
    });
  }

  function handleExport() {
    const exportData = selectedStation
      ? {
          exportedAt: new Date().toISOString(),
          scope: "station",
          station: selectedStation,
          measurements: selectedTimeSeries,
        }
      : {
          exportedAt: new Date().toISOString(),
          scope: "dashboard",
          cityFilter,
          stations: filteredStations.map((station) => ({
            ...station,
            latestMeasurement: latestMeasurements[station.id] ?? null,
          })),
        };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileScope = selectedStation ? selectedStation.id : cityFilter;
    link.href = url;
    link.download = `eco-monitoring-${fileScope}.json`;
    link.click();
    URL.revokeObjectURL(url);

    trackEvent("data_export", {
      export_format: "json",
      export_scope: exportData.scope,
      city_filter: cityFilter,
      item_count: selectedStation ? selectedTimeSeries.length : filteredStations.length,
    });
  }

  const tabs: { id: ChartTab; label: string; requiresStation: boolean }[] = [
    { id: "bar", label: "Порівняння станцій", requiresStation: false },
    { id: "line", label: "Динаміка", requiresStation: true },
    { id: "pie", label: "Структура", requiresStation: true },
  ];

  if (simulateWidgetError) {
    throw new Error("Тестова помилка віджета моніторингу");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span className="font-medium text-slate-900">Фільтр за містом</span>
              <select
                value={cityFilter}
                onChange={(event) => handleCityFilterChange(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city === "all" ? "Усі міста" : city}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-xs text-slate-500">
              Показано станцій: <span className="font-semibold text-slate-700">{filteredStations.length}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Експортувати дані
            </button>
            <button
              type="button"
              onClick={() => setSimulateWidgetError(true)}
              className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
            >
              Тест Error Boundary
            </button>
          </div>
        </div>
      </div>

      {/* Map + station info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[450px] relative">
          <MonitoringMap
            stations={filteredStations}
            latestMeasurements={latestMeasurements}
            selectedStationId={selectedStationId}
            onStationSelect={handleStationSelect}
          />
        </div>

        {/* Station list / selected info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-y-auto max-h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              {selectedStation ? "Обрана станція" : "Станції"}
            </h3>
            {selectedStation && (
              <button
                onClick={handleReset}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
              >
                Скинути вибір
              </button>
            )}
          </div>

          {selectedStation && selectedMeasurement ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {selectedStation.name}
                </h4>
                <p className="text-sm text-slate-500">
                  {selectedStation.city} &middot; {selectedStation.address}
                </p>
                <Link
                  href={`/stations/${selectedStation.id}`}
                  className="inline-flex mt-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900"
                >
                  Переглянути деталі станції
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    backgroundColor: getAqiColor(selectedMeasurement.aqiLevel),
                  }}
                >
                  {selectedMeasurement.data.aqi}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {getAqiLabel(selectedMeasurement.aqiLevel)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Індекс якості повітря
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "PM2.5", value: selectedMeasurement.data.pm25, unit: "мкг/м³" },
                  { label: "PM10", value: selectedMeasurement.data.pm10, unit: "мкг/м³" },
                  { label: "NO₂", value: selectedMeasurement.data.no2, unit: "мкг/м³" },
                  { label: "SO₂", value: selectedMeasurement.data.so2, unit: "мкг/м³" },
                  { label: "CO", value: selectedMeasurement.data.co, unit: "мг/м³" },
                  { label: "O₃", value: selectedMeasurement.data.o3, unit: "мкг/м³" },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="bg-slate-50 rounded-lg p-2"
                  >
                    <p className="text-xs text-slate-500">{p.label}</p>
                    <p className="font-semibold text-slate-900">{p.value}</p>
                    <p className="text-[10px] text-slate-400">{p.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStations.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  Для обраного фільтра активні станції не знайдені.
                </div>
              )}
              {filteredStations.map((station) => {
                const m = latestMeasurements[station.id];
                const color = m ? getAqiColor(m.aqiLevel) : "#94a3b8";

                return (
                  <button
                    key={station.id}
                    onClick={() => handleStationSelect(station.id, "station_list")}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {station.name}
                      </p>
                      <p className="text-xs text-slate-500">{station.city}</p>
                    </div>
                    {m && (
                      <span className="text-sm font-bold text-slate-700">
                        {m.data.aqi}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chart tabs */}
      <div>
        <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
          {tabs.map((tab) => {
            const isDisabled = tab.requiresStation && !selectedStationId;
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                disabled={isDisabled}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-700"
                    : isDisabled
                      ? "border-transparent text-slate-300 cursor-not-allowed"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.label}
                {isDisabled && (
                  <span className="ml-1 text-[10px]">(оберіть станцію)</span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "bar" && (
          <StationBarChart
            stations={filteredStations}
            latestMeasurements={latestMeasurements}
            selectedStationId={selectedStationId}
          />
        )}

        {activeTab === "line" && selectedStation && (
          <AqiLineChart
            measurements={selectedTimeSeries}
            stationName={selectedStation.name}
          />
        )}

        {activeTab === "pie" && selectedStation && selectedMeasurement && (
          <PollutionPieChart
            measurement={selectedMeasurement}
            stationName={selectedStation.name}
          />
        )}

        {(activeTab === "line" || activeTab === "pie") && !selectedStation && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-400">
              Оберіть станцію на карті або зі списку для перегляду графіків
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
