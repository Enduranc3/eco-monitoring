import type { AirQualityData, Measurement, StationType } from "@/types";
import { getAqiLevel } from "@/lib/aqi";
import { stations } from "./stations";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const baselinesByType: Record<StationType, AirQualityData> = {
  urban: { pm25: 18, pm10: 35, no2: 30, so2: 8, co: 1.2, o3: 45, aqi: 65 },
  traffic: { pm25: 25, pm10: 45, no2: 45, so2: 10, co: 2.5, o3: 35, aqi: 85 },
  industrial: { pm25: 30, pm10: 55, no2: 35, so2: 20, co: 1.8, o3: 40, aqi: 95 },
  suburban: { pm25: 10, pm10: 20, no2: 15, so2: 5, co: 0.6, o3: 55, aqi: 40 },
  rural: { pm25: 6, pm10: 12, no2: 8, so2: 3, co: 0.3, o3: 60, aqi: 28 },
};

function generateAirQualityData(
  stationType: StationType,
  hourOfDay: number,
  random: () => number
): AirQualityData {
  const baseline = baselinesByType[stationType];

  const rushHourFactor =
    (hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 17 && hourOfDay <= 19)
      ? 1.4
      : hourOfDay >= 0 && hourOfDay <= 5
        ? 0.6
        : 1.0;

  const vary = (base: number, spread: number) =>
    Math.max(0, +(base * rushHourFactor * (1 + (random() - 0.5) * spread)).toFixed(1));

  const pm25 = vary(baseline.pm25, 0.5);
  const pm10 = vary(baseline.pm10, 0.4);
  const no2 = vary(baseline.no2, 0.6);
  const so2 = vary(baseline.so2, 0.5);
  const co = vary(baseline.co, 0.4);
  const o3 = vary(baseline.o3, 0.3);

  const aqi = Math.round(
    Math.max(pm25 * 2, pm10 * 1, no2 * 1.5, so2 * 2, co * 10, o3 * 0.8)
  );

  return { pm25, pm10, no2, so2, co, o3, aqi };
}

function generateMeasurementsForStation(
  stationId: string,
  stationType: StationType,
  days: number
): Measurement[] {
  const random = seededRandom(stationId.charCodeAt(stationId.length - 1) * 1000);
  const results: Measurement[] = [];
  const now = new Date("2026-03-14T12:00:00Z");

  for (let d = days - 1; d >= 0; d--) {
    for (let h = 0; h < 24; h++) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - d);
      timestamp.setHours(h, 0, 0, 0);

      const data = generateAirQualityData(stationType, h, random);

      results.push({
        id: `${stationId}-${timestamp.toISOString()}`,
        stationId,
        timestamp: timestamp.toISOString(),
        data,
        aqiLevel: getAqiLevel(data.aqi),
      });
    }
  }

  return results;
}

const DAYS_OF_DATA = 7;

let cachedMeasurements: Measurement[] | null = null;

export function getAllMeasurements(): Measurement[] {
  if (cachedMeasurements) return cachedMeasurements;

  cachedMeasurements = stations.flatMap((s) =>
    generateMeasurementsForStation(s.id, s.type, DAYS_OF_DATA)
  );
  return cachedMeasurements;
}

export function getMeasurementsByStation(stationId: string): Measurement[] {
  return getAllMeasurements().filter((m) => m.stationId === stationId);
}

export function getLatestMeasurement(stationId: string): Measurement | undefined {
  const stationMeasurements = getMeasurementsByStation(stationId);
  return stationMeasurements[stationMeasurements.length - 1];
}

export function getMeasurementsInRange(
  stationId: string,
  from: string,
  to: string
): Measurement[] {
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to).getTime();
  return getMeasurementsByStation(stationId).filter((m) => {
    const t = new Date(m.timestamp).getTime();
    return t >= fromDate && t <= toDate;
  });
}
