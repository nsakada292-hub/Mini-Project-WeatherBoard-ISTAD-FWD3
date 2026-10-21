import type { ForecastResponse } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildForecastUrl } from "../shared/apiConfig.js";

// Bangkok coordinates. The forecast API asks for lat + lon instead of a name.
const LAT = 13.7563;
const LON = 100.5018;

// Fetches the 5-day forecast for Bangkok only.
export async function getBangkokForecast(unit: Unit): Promise<ForecastResponse> {
  const url = buildForecastUrl(LAT, LON, unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Bangkok forecast request failed");
  }
  // The JSON body has the shape of ForecastResponse.
  const data: ForecastResponse = await response.json();
  return data;
}
