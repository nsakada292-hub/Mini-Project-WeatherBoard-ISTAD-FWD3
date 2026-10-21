// Weather Detail page: full weather for the selected city.
import { byId, hide, show } from "../shared/dom.js";
import { getUnit, getSelectedCity } from "../shared/settings.js";
import { formatTemp, speedLabel, iconUrl, formatCityTime, formatVisibility, firstCondition } from "../shared/format.js";
import { initThemeToggle } from "../shared/theme.js";

async function showWeatherDetail(): Promise<void> {
  const status = byId("detail-status");
  const city = getSelectedCity();
  const unit = getUnit();

  // The city name is known before the fetch, so show it right away.
  byId("detail-city").textContent = `${city.name}, ${city.country}`;

  try {
    const weather = await city.loadWeather(unit);
    const condition = firstCondition(weather);

    // Big condition card.
    byId("detail-temp").textContent = formatTemp(weather.main.temp, unit);
    byId("detail-desc").textContent = condition.description;
    byId("detail-feels").textContent = `Feels like ${formatTemp(weather.main.feels_like, unit)}`;
    byId("detail-min").textContent = `Min ${formatTemp(weather.main.temp_min, unit)}`;
    byId("detail-max").textContent = `Max ${formatTemp(weather.main.temp_max, unit)}`;

    const icon = byId<HTMLImageElement>("detail-icon");
    icon.src = iconUrl(condition.icon);
    icon.alt = condition.description;

    // The six small detail cards.
    byId("detail-humidity").textContent = `${weather.main.humidity}%`;
    byId("detail-pressure").textContent = `${weather.main.pressure} hPa`;
    byId("detail-wind").textContent = `${Math.round(weather.wind.speed)} ${speedLabel(unit)}`;
    byId("detail-wind-direction").textContent = `Direction ${weather.wind.deg}°`;
    byId("detail-clouds").textContent = `${weather.clouds.all}%`;
    byId("detail-visibility").textContent = formatVisibility(weather.visibility, unit);
    byId("detail-sunrise").textContent = formatCityTime(weather.sys.sunrise, weather.timezone);
    byId("detail-sunset").textContent = formatCityTime(weather.sys.sunset, weather.timezone);

    hide(status);
    show(byId("detail-hero"));
  } catch (error) {
    console.error(error);
    status.textContent = `Could not load the weather for ${city.name}. Please try again later.`;
  }
}

// The dark / light switch lives in the header of every page.
initThemeToggle();

showWeatherDetail().catch((error) => {
  console.error(error);
});
