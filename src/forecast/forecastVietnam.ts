import type { ForecastResponse } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildForecastUrl } from "../shared/apiConfig.js";

// Tokyo coordinates. The forecast API asks for lat + lon instead of a name.
const LAT = 21.0245;
const LON = 105.8412;

// Fetches the 5-day forecast for Tokyo only.
export async function getVietnamForecast(unit: Unit): Promise<ForecastResponse> {
  const url = buildForecastUrl(LAT, LON, unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Vietnam forecast request failed");
  }
  // The JSON body has the shape of ForecastResponse.
  const data: ForecastResponse = await response.json();
  return data;
}
