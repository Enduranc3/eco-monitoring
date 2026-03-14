import type { Measurement, MonitoringStation, StationStats } from "./environment";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiErrorCode =
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StationsListRequest {
  city?: string;
  type?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface MeasurementsRequest {
  stationId: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: "timestamp" | "aqi";
  sortOrder?: "asc" | "desc";
}

export interface CurrentReadingsRequest {
  stationId?: string;
}

export type StationsListResponse = ApiResponse<MonitoringStation[]>;
export type StationDetailResponse = ApiResponse<MonitoringStation & { stats: StationStats }>;
export type MeasurementsResponse = ApiResponse<Measurement[]>;
export type CurrentReadingsResponse = ApiResponse<(Measurement & { station: MonitoringStation })[]>;
