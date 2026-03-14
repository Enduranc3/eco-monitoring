import { NextRequest, NextResponse } from "next/server";
import {
  getMeasurementsByStation,
  getMeasurementsInRange,
} from "@/data/measurements";
import { stations } from "@/data/stations";
import type { ApiResponse, PaginationMeta, Measurement } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const stationId = searchParams.get("stationId");
  if (!stationId) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Параметр stationId є обов'язковим",
      },
    };
    return NextResponse.json(response, { status: 400 });
  }

  const station = stations.find((s) => s.id === stationId);
  if (!station) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Станцію з id "${stationId}" не знайдено`,
      },
    };
    return NextResponse.json(response, { status: 404 });
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10)));
  const sortBy = searchParams.get("sortBy") === "aqi" ? "aqi" : "timestamp";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  let measurements: Measurement[];
  if (from && to) {
    measurements = getMeasurementsInRange(stationId, from, to);
  } else {
    measurements = getMeasurementsByStation(stationId);
  }

  measurements.sort((a, b) => {
    if (sortBy === "aqi") {
      return sortOrder === "asc"
        ? a.data.aqi - b.data.aqi
        : b.data.aqi - a.data.aqi;
    }
    return sortOrder === "asc"
      ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const total = measurements.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = measurements.slice(start, start + limit);

  const meta: PaginationMeta = { page, limit, total, totalPages };
  const response: ApiResponse<Measurement[]> = {
    success: true,
    data: paged,
    meta,
  };

  return NextResponse.json(response);
}
