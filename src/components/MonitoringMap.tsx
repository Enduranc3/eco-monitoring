"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { MonitoringStation, Measurement } from "@/types";
import { getAqiColor, getAqiLabel } from "@/lib/aqi";
import "leaflet/dist/leaflet.css";

interface MonitoringMapProps {
  stations: MonitoringStation[];
  latestMeasurements: Record<string, Measurement>;
  selectedStationId: string | null;
  onStationSelect: (stationId: string | null) => void;
}

const UKRAINE_CENTER: [number, number] = [49.5, 30.5];
const DEFAULT_ZOOM = 6;

function FlyToStation({
  station,
}: {
  station: MonitoringStation | undefined;
}) {
  const map = useMap();

  useEffect(() => {
    if (station) {
      map.flyTo(
        [station.coordinates.latitude, station.coordinates.longitude],
        10,
        { duration: 0.8 }
      );
    } else {
      map.flyTo(UKRAINE_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  }, [station, map]);

  return null;
}

export default function MonitoringMap({
  stations,
  latestMeasurements,
  selectedStationId,
  onStationSelect,
}: MonitoringMapProps) {
  const selectedStation = selectedStationId
    ? stations.find((s) => s.id === selectedStationId)
    : undefined;

  const stationTypeLabels: Record<string, string> = {
    urban: "Міська",
    suburban: "Приміська",
    rural: "Сільська",
    industrial: "Промислова",
    traffic: "Транспортна",
  };

  return (
    <MapContainer
      center={UKRAINE_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full rounded-xl z-0"
      scrollWheelZoom={true}
      minZoom={5}
      maxZoom={18}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToStation station={selectedStation} />

      {stations.map((station) => {
        const measurement = latestMeasurements[station.id];
        const aqiLevel = measurement?.aqiLevel ?? "good";
        const aqiValue = measurement?.data.aqi ?? 0;
        const color = getAqiColor(aqiLevel);
        const isSelected = station.id === selectedStationId;

        return (
          <CircleMarker
            key={station.id}
            center={[station.coordinates.latitude, station.coordinates.longitude]}
            radius={isSelected ? 14 : 10}
            pathOptions={{
              color: isSelected ? "#0f172a" : color,
              fillColor: color,
              fillOpacity: isSelected ? 1 : 0.75,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onStationSelect(station.id),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  {station.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2">
                  {station.city} &middot; {stationTypeLabels[station.type]}
                </p>
                {measurement ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">AQI</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: color }}
                      >
                        {aqiValue} — {getAqiLabel(aqiLevel)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600">
                      <span>PM2.5: {measurement.data.pm25}</span>
                      <span>PM10: {measurement.data.pm10}</span>
                      <span>NO₂: {measurement.data.no2}</span>
                      <span>SO₂: {measurement.data.so2}</span>
                      <span>CO: {measurement.data.co}</span>
                      <span>O₃: {measurement.data.o3}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Немає даних</p>
                )}
                <button
                  className="mt-2 w-full text-xs bg-emerald-600 text-white rounded py-1 hover:bg-emerald-700 transition-colors"
                  onClick={() => onStationSelect(station.id)}
                >
                  Показати графіки
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
