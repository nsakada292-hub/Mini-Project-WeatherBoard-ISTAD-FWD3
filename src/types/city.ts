import type { Unit } from "./unit.js";
import type { CurrentWeather, ForecastResponse } from "./weather.js";

// One city that this app knows about.
export type City = {
  id: string;   // short id stored in localStorage, e.g. "phnomPenh"
  name: string; // name shown on the page, e.g. "Phnom Penh"
  country: string; // 2-letter country code shown on cards, e.g. "KH"

  // Each city points to its OWN fetch file (one city = one file).
  loadWeather: (unit: Unit) => Promise<CurrentWeather>;
  loadForecast: (unit: Unit) => Promise<ForecastResponse>;
};
