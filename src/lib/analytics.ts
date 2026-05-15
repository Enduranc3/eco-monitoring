"use client";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export type AnalyticsEventName =
  | "station_detail_view"
  | "map_interaction"
  | "chart_view"
  | "filter_applied"
  | "data_export"
  | "page_load_time"
  | "session_duration"
  | "client_error";

type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsEventParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      target: string | Date,
      params?: Record<string, AnalyticsValue>
    ) => void;
  }
}

function isAnalyticsAvailable() {
  return typeof window !== "undefined" && Boolean(window.gtag) && Boolean(GA_MEASUREMENT_ID);
}

export function pageView(path: string, title?: string) {
  if (!isAnalyticsAvailable()) {
    return;
  }

  window.gtag?.("event", "page_view", {
    page_title: title ?? document.title,
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  });
}

export function trackEvent(
  name: AnalyticsEventName,
  params: AnalyticsEventParams = {}
) {
  if (!isAnalyticsAvailable()) {
    return;
  }

  window.gtag?.("event", name, params);
}
