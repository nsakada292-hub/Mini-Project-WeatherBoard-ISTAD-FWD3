import type { CurrentWeather } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildWeatherUrl } from "../shared/apiConfig.js";

// Fetches the CURRENT weather for Tokyo only.
export async function getVietnamWeather(unit: Unit): Promise<CurrentWeather> {
  const url = buildWeatherUrl("Tokyo,JP", unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Vietnam weather request failed");
  }
  // The JSON body has the shape of CurrentWeather.
  const data: CurrentWeather = await response.json();
  return data;
}
