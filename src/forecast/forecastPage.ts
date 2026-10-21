// Forecast page: the next days for the selected city.
import { byId, hide, show } from "../shared/dom.js";
import { getUnit, getSelectedCity } from "../shared/settings.js";
import { iconUrl, formatDayMonth, formatWeekday, formatTemp, firstCondition } from "../shared/format.js";
import { initThemeToggle } from "../shared/theme.js";
import type { ForecastItem, ForecastResponse } from "../types/weather.js";

// One day of the forecast: a local date + every 3-hour step that day.
type DayGroup = {
  key: string;      // simple "year-month-day" key used for grouping
  date: Date;       // local date, used for the day name
  items: ForecastItem[];
};

// Splits the 3-hour steps into one group per city-local day.
function groupByDay(forecast: ForecastResponse): DayGroup[] {
  const groups: DayGroup[] = [];

  for (const item of forecast.list) {
    // Adding the timezone first makes the UTC fields show the CITY's local time.
    const cityLocal = new Date((item.dt + forecast.city.timezone) * 1000);
    const key = `${cityLocal.getUTCFullYear()}-${cityLocal.getUTCMonth()}-${cityLocal.getUTCDate()}`;

    const existing = groups.find((group) => group.key === key);
    if (existing !== undefined) {
      existing.items.push(item);
      continue;
    }

    groups.push({
      key,
      date: new Date(cityLocal.getUTCFullYear(), cityLocal.getUTCMonth(), cityLocal.getUTCDate()),
      items: [item],
    });
  }

  return groups;
}

// Draws the card for one day.
function dayCard(group: DayGroup): string {
  // The step closest to midday stands for the whole day.
  const middleIndex = Math.floor(group.items.length / 2);
  const representative = group.items[middleIndex];
  if (representative === undefined) {
    return "";
  }

  const condition = firstCondition(representative);
  const unit = getUnit();

  // Lowest and highest temperature of that day.
  let low = Number.POSITIVE_INFINITY;
  let high = Number.NEGATIVE_INFINITY;
  for (const item of group.items) {
    low = Math.min(low, item.main.temp_min);
    high = Math.max(high, item.main.temp_max);
  }

  return `
    <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card text-center">
      <p class="text-sm font-semibold text-slate-800 dark:text-white">${formatWeekday(group.date)}</p>
      <p class="text-xs text-slate-400">${formatDayMonth(group.date)}</p>
      <img src="${iconUrl(condition.icon)}" alt="${condition.description}" class="w-14 h-14 mx-auto">
      <p class="text-2xl font-bold text-slate-800 dark:text-white mt-1">${formatTemp(representative.main.temp, unit)}</p>
      <p class="text-xs text-slate-500 capitalize">${condition.description}</p>
      <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-400">
        <span>H ${Math.round(high)}°</span>
        <span>L ${Math.round(low)}°</span>
      </div>
    </div>
  `;
}

async function showForecast(): Promise<void> {
  const status = byId("forecast-status");
  const city = getSelectedCity();

  byId("forecast-city-name").textContent = `${city.name}, ${city.country}`;

  try {
    const forecast = await city.loadForecast(getUnit());
    const days = groupByDay(forecast);

    byId("forecast-list").innerHTML = days.map(dayCard).join("");
    hide(status);
    show(byId("forecast-list-wrap"));
  } catch (error) {
    console.error(error);
    status.textContent = "Could not load the forecast. Please try again later.";
  }
}

// The dark / light switch lives in the header of every page.
initThemeToggle();

showForecast().catch((error) => {
  console.error(error);
});
