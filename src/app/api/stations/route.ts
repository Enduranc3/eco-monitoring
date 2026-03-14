import { NextRequest, NextResponse } from "next/server";
import { stations } from "@/data/stations";
import type { ApiResponse, PaginationMeta, MonitoringStation } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const isActive = searchParams.get("isActive");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));

  let filtered = [...stations];

  if (city) {
    filtered = filtered.filter(
      (s) => s.city.toLowerCase() === city.toLowerCase()
    );
  }
  if (type) {
    filtered = filtered.filter((s) => s.type === type);
  }
  if (isActive !== null && isActive !== undefined && isActive !== "") {
    filtered = filtered.filter((s) => s.isActive === (isActive === "true"));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  const meta: PaginationMeta = { page, limit, total, totalPages };
  const response: ApiResponse<MonitoringStation[]> = {
    success: true,
    data: paged,
    meta,
  };

  return NextResponse.json(response);
}
