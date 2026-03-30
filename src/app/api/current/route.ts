import { NextRequest, NextResponse } from "next/server";
import { stations } from "@/data/stations";
import { getLatestMeasurement } from "@/data/measurements";
import type { ApiResponse, Measurement, MonitoringStation } from "@/types";
import { withApiLogging } from "@/lib/api-handler";

type CurrentReading = Measurement & { station: MonitoringStation };

export const GET = withApiLogging("/api/current", async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const stationId = searchParams.get("stationId");

  const targetStations = stationId
    ? stations.filter((s) => s.id === stationId)
    : stations.filter((s) => s.isActive);

  if (stationId && targetStations.length === 0) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Станцію з id "${stationId}" не знайдено`,
      },
    };
    return NextResponse.json(response, { status: 404 });
  }

  const readings: CurrentReading[] = [];
  for (const station of targetStations) {
    const measurement = getLatestMeasurement(station.id);
    if (measurement) {
      readings.push({ ...measurement, station });
    }
  }

  const response: ApiResponse<CurrentReading[]> = {
    success: true,
    data: readings,
  };

  return NextResponse.json(response);
});
