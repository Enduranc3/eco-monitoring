export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type StationType = "urban" | "suburban" | "rural" | "industrial" | "traffic";

export interface MonitoringStation {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: StationType;
  address: string;
  city: string;
  isActive: boolean;
  installedAt: string;
}

export interface AirQualityData {
  pm25: number;       // мкг/м³
  pm10: number;       // мкг/м³
  no2: number;        // мкг/м³
  so2: number;        // мкг/м³
  co: number;         // мг/м³
  o3: number;         // мкг/м³
  aqi: number;        // індекс якості повітря (0-500)
}

export type AQILevel = "good" | "moderate" | "unhealthy_sensitive" | "unhealthy" | "very_unhealthy" | "hazardous";

export interface Measurement {
  id: string;
  stationId: string;
  timestamp: string;
  data: AirQualityData;
  aqiLevel: AQILevel;
}

export interface TimeSeries {
  stationId: string;
  from: string;
  to: string;
  measurements: Measurement[];
}

export interface PollutantInfo {
  id: string;
  name: string;
  formula: string;
  unit: string;
  description: string;
  sources: string[];
  healthEffects: string;
  maxAllowedConcentration: number;
}

export interface StationStats {
  stationId: string;
  averageAqi: number;
  minAqi: number;
  maxAqi: number;
  aqiLevel: AQILevel;
  measurementCount: number;
  lastUpdated: string;
}
