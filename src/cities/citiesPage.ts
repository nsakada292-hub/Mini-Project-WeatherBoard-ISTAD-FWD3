// Cities page: shows every city and lets you pick or save one.
import { byId, hide, show } from "../shared/dom.js";
import { cityList } from "./cityList.js";
import { getUnit, setSelectedCity, toggleSavedCity, isCitySaved } from "../shared/settings.js";
import { formatTemp, iconUrl, firstCondition } from "../shared/format.js";
import { initThemeToggle } from "../shared/theme.js";
import type { City } from "../types/city.js";
import type { CurrentWeather } from "../types/weather.js";

// One city together with its weather (weather = null when the fetch failed).
type CityWeather = {
  city: City;
  weather: CurrentWeather | null;
};

// Draws one city card.
function cityCard(entry: CityWeather): string {
  const city = entry.city;
  const saved = isCitySaved(city.id);

  let temperature = "—";
  let description = "Not available";
  let iconHtml = `<div class="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-700"></div>`;

  if (entry.weather !== null) {
    const condition = firstCondition(entry.weather);
    temperature = formatTemp(entry.weather.main.temp, getUnit());
    description = condition.description;
    iconHtml = `<img src="${iconUrl(condition.icon)}" alt="${description}" class="w-14 h-14 mx-auto">`;
  }

  const saveClasses = saved
    ? "text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary"
    : "text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500";

  return `
    <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card text-center">
      <div class="flex items-center justify-between mb-4">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">${city.country}</p>
        <button data-action="save" data-city-id="${city.id}" class="${saveClasses}">${saved ? "Saved ✓" : "Save"}</button>
      </div>
      <h3 class="text-lg font-bold text-slate-800 dark:text-white">${city.name}</h3>
      ${iconHtml}
      <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1">${temperature}</p>
      <p class="text-xs text-slate-500 capitalize">${description}</p>
      <button data-action="view" data-city-id="${city.id}" class="w-full mt-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors">View Detail</button>
    </div>
  `;
}

// Fetches every city (one fetch file per city) and draws the cards.
async function showCities(): Promise<void> {
  const status = byId("cities-status");
  const entries: CityWeather[] = [];

  for (const city of cityList) {
    try {
      const weather = await city.loadWeather(getUnit());
      entries.push({ city, weather });
    } catch {
      entries.push({ city, weather: null }); // still show the card when the fetch fails
    }
  }

  byId("cities-list").innerHTML = entries.map(cityCard).join("");
  hide(status);
  show(byId("cities-list-wrap"));
}

// One click handler for the whole list (the cards are plain HTML strings).
function attachClickHandler(): void {
  byId("cities-list").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[data-city-id]");
    if (!(button instanceof HTMLButtonElement)) return;

    const cityId = button.dataset.cityId;
    const action = button.dataset.action;
    if (cityId === undefined || action === undefined) return;

    // "View Detail" remembers the choice, then opens the detail page.
    if (action === "view") {
      setSelectedCity(cityId);
      window.location.href = "weatherDetail.html";
      return;
    }

    // "Save" adds or removes the city from the saved list.
    if (action === "save") {
      toggleSavedCity(cityId);
      const saved = isCitySaved(cityId);
      button.textContent = saved ? "Saved ✓" : "Save";
      button.className = saved
        ? "text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary"
        : "text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500";
    }
  });
}

// The dark / light switch lives in the header of every page.
initThemeToggle();

async function startCitiesPage(): Promise<void> {
  await showCities();
  attachClickHandler();
}

startCitiesPage().catch((error) => {
  console.error(error);
});
