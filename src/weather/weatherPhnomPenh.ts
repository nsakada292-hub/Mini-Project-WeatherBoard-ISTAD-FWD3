import type { CurrentWeather } from "../types/weather.js";
import type { Unit } from "../types/unit.js";
import { buildWeatherUrl } from "../shared/apiConfig.js";

// Fetches the CURRENT weather for Phnom Penh only.
export async function getPhnomPenhWeather(unit: Unit): Promise<CurrentWeather> {
  const url = buildWeatherUrl("Phnom Penh,KH", unit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Phnom Penh weather request failed");
  }
  // The JSON body has the shape of CurrentWeather.
  const data: CurrentWeather = await response.json();
  return data;
}
