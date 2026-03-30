"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface StationDetailTrackerProps {
  stationId: string;
  stationName: string;
  city: string;
  measurementCount: number;
}

export default function StationDetailTracker({
  stationId,
  stationName,
  city,
  measurementCount,
}: StationDetailTrackerProps) {
  useEffect(() => {
    trackEvent("station_detail_view", {
      station_id: stationId,
      station_name: stationName,
      city,
      measurement_count: measurementCount,
    });
  }, [city, measurementCount, stationId, stationName]);

  return null;
}
