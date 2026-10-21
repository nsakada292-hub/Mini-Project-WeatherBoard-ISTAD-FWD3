// Dashboard page: today's weather + one card per saved city.
import { byId, hide, show } from "../shared/dom.js";
import { getUnit, getSelectedCity, getSavedCities, setSelectedCity } from "../shared/settings.js";
import { formatTemp, speedLabel, iconUrl, formatCityTime, firstCondition } from "../shared/format.js";
import { initThemeToggle } from "../shared/theme.js";
import type { City } from "../types/city.js";
import type { CurrentWeather } from "../types/weather.js";

// Fills the big "today" card for the selected city.
async function showTodayWeather(): Promise<void> {
  const status = byId("dashboard-status");
  const city = getSelectedCity();
  const unit = getUnit();

  try {
    const weather = await city.loadWeather(unit);
    const condition = firstCondition(weather);

    byId("dashboard-city").textContent = `${city.name}, ${city.country}`;
    byId("dashboard-temp").textContent = formatTemp(weather.main.temp, unit);
    byId("dashboard-desc").textContent = condition.description;
    byId("dashboard-feels").textContent = `Feels like ${formatTemp(weather.main.feels_like, unit)}`;
    byId("dashboard-updated").textContent = `Updated ${formatCityTime(weather.dt, weather.timezone)} (city time)`;

    const icon = byId<HTMLImageElement>("dashboard-icon");
    icon.src = iconUrl(condition.icon);
    icon.alt = condition.description;

    // The four metric cards below the hero card.
    byId("metric-temp").textContent = formatTemp(weather.main.temp, unit);
    byId("metric-humidity").textContent = `${weather.main.humidity}%`;
    byId("metric-wind").textContent = `${Math.round(weather.wind.speed)} ${speedLabel(unit)}`;
    byId("metric-clouds").textContent = `${weather.clouds.all}%`;

    hide(status);
    show(byId("dashboard-hero"));
  } catch (error) {
    console.error(error);
    status.textContent = "Could not load the weather. Please try again later.";
  }
}

// One saved-city card with a "View" button.
function savedCityCard(city: City, weather: CurrentWeather): string {
  const condition = firstCondition(weather);
  return `
    <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F9FF] dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${iconUrl(condition.icon)}" alt="${condition.description}" class="w-10 h-10">
        <div class="min-w-0">
          <p class="font-semibold text-slate-800 dark:text-white truncate">${city.name}, ${city.country}</p>
          <p class="text-xs text-slate-400 capitalize truncate">${condition.description}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span class="text-xl font-bold text-slate-800 dark:text-white">${formatTemp(weather.main.temp, getUnit())}</span>
        <button data-city-id="${city.id}" class="px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">View</button>
      </div>
    </div>
  `;
}

// Same card, shown when this city could not be fetched.
function savedCityErrorCard(city: City): string {
  return `
    <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F9FF] dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
      <div class="min-w-0">
        <p class="font-semibold text-slate-800 dark:text-white truncate">${city.name}, ${city.country}</p>
        <p class="text-xs text-rose-500">Weather not available</p>
      </div>
      <button data-city-id="${city.id}" class="px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">View</button>
    </div>
  `;
}

// Loads every saved city and draws its card.
async function showSavedCities(): Promise<void> {
  const container = byId("saved-cities-list");
  const savedCities = getSavedCities();

  if (savedCities.length === 0) {
    container.innerHTML = `<p class="text-sm text-slate-500">No saved cities yet. Open the Cities page to add one.</p>`;
    return;
  }

  const cards: string[] = [];
  for (const city of savedCities) {
    try {
      const weather = await city.loadWeather(getUnit());
      cards.push(savedCityCard(city, weather));
    } catch {
      cards.push(savedCityErrorCard(city)); // one broken city must not break the page
    }
  }
  container.innerHTML = cards.join("");

  // The cards were built as plain HTML, so the clicks are handled here.
  container.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[data-city-id]");
    if (!(button instanceof HTMLButtonElement)) return;
    const cityId = button.dataset.cityId;
    if (cityId === undefined) return;
    setSelectedCity(cityId);
    window.location.href = "weatherDetail.html";
  });
}

// The dark / light switch lives in the header of every page.
initThemeToggle();

// Start the page.
async function startDashboard(): Promise<void> {
  await showTodayWeather();
  await showSavedCities();
}

startDashboard().catch((error) => {
  console.error(error);
});
