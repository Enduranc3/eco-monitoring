import type { Metadata } from "next";
import { stations } from "@/data/stations";
import { getMeasurementsByStation, getLatestMeasurement } from "@/data/measurements";
import type { Measurement } from "@/types";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Моніторинг — EcoMonitor",
  description: "Інтерактивна карта та графіки екологічного моніторингу",
};

export default function DashboardPage() {
  const activeStations = stations.filter((s) => s.isActive);

  const latestMeasurements: Record<string, Measurement> = {};
  const allMeasurements: Record<string, Measurement[]> = {};

  for (const station of activeStations) {
    const latest = getLatestMeasurement(station.id);
    if (latest) {
      latestMeasurements[station.id] = latest;
    }
    allMeasurements[station.id] = getMeasurementsByStation(station.id);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Моніторинг
        </h1>
        <p className="text-slate-600">
          Інтерактивна карта станцій та візуалізація екологічних даних
        </p>
      </div>

      <DashboardClient
        stations={activeStations}
        latestMeasurements={latestMeasurements}
        allMeasurements={allMeasurements}
      />
    </div>
  );
}
