import type { CurrentWeather } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildWeatherUrl } from "../shared/apiConfig.js";

// Fetches the CURRENT weather for London only.
export async function getMalaysiaWeather(unit: Unit): Promise<CurrentWeather> {
  const url = buildWeatherUrl("London,GB", unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Malaysia weather request failed");
  }
  // The JSON body has the shape of CurrentWeather.
  const data: CurrentWeather = await response.json();
  return data;
}
