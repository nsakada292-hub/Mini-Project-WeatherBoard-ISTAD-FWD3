import type { ForecastResponse } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildForecastUrl } from "../shared/apiConfig.js";

// London coordinates. The forecast API asks for lat + lon instead of a name.
const LAT = 1.2897;
const LON = 103.8501;

// Fetches the 5-day forecast for London only.
export async function getSingaporeForecast(unit: Unit): Promise<ForecastResponse> {
  const url = buildForecastUrl(LAT, LON, unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Singapore forecast request failed");
  }
  // The JSON body has the shape of ForecastResponse.
  const data: ForecastResponse = await response.json();
  return data;
}
