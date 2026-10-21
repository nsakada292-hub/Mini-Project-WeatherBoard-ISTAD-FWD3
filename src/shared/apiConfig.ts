import type { Unit } from "../types/unit.js";

// The API address and key live HERE only.
// Every city file asks this file to build its URL.
const API_BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = "3b39ed04bd29dcd5b79d473e5b56642b";

// URL for the current weather of one city (queried by city name).
export function buildWeatherUrl(cityQuery: string, unit: Unit): string {
  return `${API_BASE}/weather?q=${encodeURIComponent(cityQuery)}&units=${unit}&appid=${API_KEY}`;
}

// URL for the 5-day forecast (this endpoint wants latitude + longitude).
export function buildForecastUrl(lat: number, lon: number, unit: Unit): string {
  return `${API_BASE}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
}

// URL for an OpenWeatherMap weather tile layer (used by the Map page).
export function buildTileUrl(layer: string): string {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`;
}
