import type { Unit } from "../types/unit.js";
import type { City } from "../types/city.js";
import { cityList, findCityById } from "../cities/cityList.js";

// Every setting is stored in localStorage so it survives a page refresh.
const UNIT_KEY = "weatherboard.unit";
const SELECTED_CITY_KEY = "weatherboard.selectedCity";
const SAVED_CITIES_KEY = "weatherboard.savedCities";

// --- temperature unit -------------------------------------

// Reads the saved unit. Defaults to °C when nothing is saved yet.
export function getUnit(): Unit {
  const saved = localStorage.getItem(UNIT_KEY);
  return saved === "imperial" ? "imperial" : "metric";
}

// Saves the chosen unit.
export function setUnit(unit: Unit): void {
  localStorage.setItem(UNIT_KEY, unit);
}

// --- selected city (Detail + Forecast pages) ---------------

// Reads the city the user picked on the Cities page.
export function getSelectedCity(): City {
  const savedId = localStorage.getItem(SELECTED_CITY_KEY) ?? "";
  return findCityById(savedId);
}

// Saves the city the user picked.
export function setSelectedCity(cityId: string): void {
  localStorage.setItem(SELECTED_CITY_KEY, cityId);
}

// --- saved cities (Dashboard) ------------------------------

// Reads the saved cities. First visit = every city is saved.
export function getSavedCities(): City[] {
  const raw = localStorage.getItem(SAVED_CITIES_KEY);
  if (raw === null) {
    return [...cityList];
  }

  let ids: unknown;
  try {
    ids = JSON.parse(raw);
  } catch {
    return [...cityList]; // stored data was broken, start fresh
  }

  if (!Array.isArray(ids)) {
    return [...cityList];
  }

  const cities: City[] = [];
  for (const id of ids) {
    if (typeof id !== "string") continue;
    const city = cityList.find((item) => item.id === id);
    if (city !== undefined && !cities.includes(city)) {
      cities.push(city);
    }
  }
  return cities;
}

// Adds a city that is not saved yet, or removes it when it already is.
export function toggleSavedCity(cityId: string): void {
  const saved = getSavedCities();
  const alreadySaved = saved.some((city) => city.id === cityId);
  const next = alreadySaved
    ? saved.filter((city) => city.id !== cityId)
    : [...saved, findCityById(cityId)];
  localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(next.map((city) => city.id)));
}

// True when this city is on the saved list.
export function isCitySaved(cityId: string): boolean {
  return getSavedCities().some((city) => city.id === cityId);
}
