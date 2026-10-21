import type { ForecastResponse } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildForecastUrl } from "../shared/apiConfig.js";

// Phnom Penh coordinates. The forecast API asks for lat + lon instead of a name.
const LAT = 11.5625;
const LON = 104.916;

// Fetches the 5-day forecast for Phnom Penh only.
export async function getPhnomPenhForecast(unit: Unit): Promise<ForecastResponse> {
  const url = buildForecastUrl(LAT, LON, unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Phnom Penh forecast request failed");
  }
  // The JSON body has the shape of ForecastResponse.
  const data: ForecastResponse = await response.json();
  return data;
}
