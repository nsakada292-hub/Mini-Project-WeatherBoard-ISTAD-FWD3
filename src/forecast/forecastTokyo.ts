import type { ForecastResponse } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildForecastUrl } from "../shared/apiConfig.js";

// Tokyo coordinates. The forecast API asks for lat + lon instead of a name.
const LAT = 35.6895;
const LON = 139.6917;

// Fetches the 5-day forecast for Tokyo only.
export async function getTokyoForecast(unit: Unit): Promise<ForecastResponse> {
  const url = buildForecastUrl(LAT, LON, unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Tokyo forecast request failed");
  }
  // The JSON body has the shape of ForecastResponse.
  const data: ForecastResponse = await response.json();
  return data;
}
