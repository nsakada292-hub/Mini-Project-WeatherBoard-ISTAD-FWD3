import type { Unit } from "../types/unit.js";
import type { WeatherCondition } from "../types/weather.js";

// Short unit word for temperatures: "°C" or "°F".
export function unitLabel(unit: Unit): string {
  return unit === "metric" ? "°C" : "°F";
}

// Wind unit that matches the API units: "m/s" or "mph".
export function speedLabel(unit: Unit): string {
  return unit === "metric" ? "m/s" : "mph";
}

// Rounds a temperature and adds the unit, e.g. 28.4 -> "28°C".
export function formatTemp(value: number, unit: Unit): string {
  return `${Math.round(value)}${unitLabel(unit)}`;
}

// Builds the small weather picture URL from an icon code, e.g. "02d".
export function iconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// The API sends an array of conditions; the app only uses the first one.
// (The fallback keeps TypeScript happy if the array is ever empty.)
export function firstCondition(source: { weather: WeatherCondition[] }): WeatherCondition {
  const first = source.weather[0];
  if (first === undefined) {
    return { id: 0, main: "Unknown", description: "No data", icon: "01d" };
  }
  return first;
}

// The API sends visibility in METRES for both units, so we convert it.
export function formatVisibility(metres: number, unit: Unit): string {
  if (unit === "imperial") {
    return `${Math.round(metres / 1609.34)} mi`;
  }
  return `${(metres / 1000).toFixed(1)} km`;
}

// Turns a unix timestamp into "14:30" in the CITY's local time.
// We add the timezone offset first, then read the clock as UTC.
export function formatCityTime(unixSeconds: number, timezoneOffsetSeconds: number): string {
  const cityTime = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  const hours = String(cityTime.getUTCHours()).padStart(2, "0");
  const minutes = String(cityTime.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Turns a Date into "21 Oct" using the browser language.
export function formatDayMonth(date: Date): string {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// Turns a Date into "Tue" using the browser language.
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: "short" });
}
