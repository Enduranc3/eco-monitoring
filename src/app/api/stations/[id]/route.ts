import { NextRequest, NextResponse } from "next/server";
import { stations } from "@/data/stations";
import { getMeasurementsByStation } from "@/data/measurements";
import type { ApiResponse, StationStats } from "@/types";
import type { MonitoringStation } from "@/types";
import { getAqiLevel } from "@/lib/aqi";
import { withApiLogging } from "@/lib/api-handler";

type StationWithStats = MonitoringStation & { stats: StationStats };

export const GET = withApiLogging(
  "/api/stations/[id]",
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const station = stations.find((s) => s.id === id);

    if (!station) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Станцію з id "${id}" не знайдено`,
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const measurements = getMeasurementsByStation(id);
    const aqiValues = measurements.map((m) => m.data.aqi);

    const averageAqi =
      aqiValues.length > 0
        ? Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length)
        : 0;
    const minAqi = aqiValues.length > 0 ? Math.min(...aqiValues) : 0;
    const maxAqi = aqiValues.length > 0 ? Math.max(...aqiValues) : 0;
    const lastMeasurement = measurements[measurements.length - 1];

    const stats: StationStats = {
      stationId: id,
      averageAqi,
      minAqi,
      maxAqi,
      aqiLevel: getAqiLevel(averageAqi),
      measurementCount: measurements.length,
      lastUpdated: lastMeasurement?.timestamp ?? "",
    };

    const response: ApiResponse<StationWithStats> = {
      success: true,
      data: { ...station, stats },
    };

    return NextResponse.json(response);
  }
);
