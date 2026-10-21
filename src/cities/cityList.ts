import type { City } from "../types/city.js";
import { getPhnomPenhWeather } from "../weather/weatherPhnomPenh.js";
import { getPhnomPenhForecast } from "../forecast/forecastPhnomPenh.js";

import { getBangkokWeather } from "../weather/weatherBangkok.js";
import { getBangkokForecast } from "../forecast/forecastBangkok.js";

import { getTokyoWeather } from "../weather/weatherTokyo.js";
import { getTokyoForecast } from "../forecast/forecastTokyo.js";

import { getLondonWeather } from "../weather/weatherLondon.js";
import { getLondonForecast } from "../forecast/forecastLondon.js";
// Add new
import { getBeijingWeather } from "../weather/weatherBeijing.js";
import { getChinaForecast } from "../forecast/forecastChina.js";

import { getIndonesiaWeather } from "../weather/weatherIndonesia.js";
import { getIndonesiaForecast } from "../forecast/forecastIndonesia.js";

import { getKoreaWeather } from "../weather/weatherKorea.js";
import { getKoreaForecast } from "../forecast/forecastKorea.js";

import { getLaosForecast } from "../forecast/forecastLaos.js";
import { getLaosWeather } from "../weather/weatherLaos.js";

import { getMalaysiaForecast } from "../forecast/forecastMalaysia.js";
import { getMalaysiaWeather } from "../weather/weatherMalaysia.js";

import { getMyanmarForecast } from "../forecast/forecastMyanmar.js";
import { getMyanmarWeather } from "../weather/weatherMyanmar.js";

import { getPhillipineForecast } from "../forecast/forecastPhillipine.js";
import { getPhillipineWeather } from "../weather/weatherPhillipine.js";

import { getSingaporeForecast } from "../forecast/forecastSingapore.js";
import { getSingaporeWeather } from "../weather/weatherSingapore.js";

import { getVietnamForecast } from "../forecast/forecastVietnam.js";
import { getVietnamWeather } from "../weather/weatherVietnam.js";

// The default city, also used when an unknown id is requested.
const phnomPenh: City = {
  id: "phnomPenh",
  name: "Phnom Penh",
  country: "KH",
  loadWeather: getPhnomPenhWeather,
  loadForecast: getPhnomPenhForecast,
};

// The full city list. Like a phone book: every entry points to that
// city's OWN fetch file, so no fetch file ever mixes two cities.
export const cityList: City[] = [
  phnomPenh,
  { id: "bangkok", name: "Bangkok", country: "TH", loadWeather: getBangkokWeather, loadForecast: getBangkokForecast },
  { id: "tokyo", name: "Tokyo", country: "JP", loadWeather: getTokyoWeather, loadForecast: getTokyoForecast },
  { id: "london", name: "London", country: "GB", loadWeather: getLondonWeather, loadForecast: getLondonForecast },

  { id: "beijing", name: "Beijing", country: "CH", loadWeather: getBeijingWeather, loadForecast: getChinaForecast },
  { id: "indonesia", name: "Indonesia", country: "IN", loadWeather: getIndonesiaWeather, loadForecast: getIndonesiaForecast },
  { id: "korea", name: "Korea", country: "KO", loadWeather: getKoreaWeather, loadForecast: getKoreaForecast },
  { id: "laos", name: "Laos", country: "LA", loadWeather: getLaosWeather, loadForecast: getLaosForecast },
  { id: "malaysia", name: "Malaysia", country: "MA", loadWeather: getMalaysiaWeather, loadForecast: getMalaysiaForecast },
  { id: "myanmar", name: "Myanmar", country: "MY", loadWeather: getMyanmarWeather, loadForecast: getMyanmarForecast },
  { id: "phillipine", name: "Phillipine", country: "PH", loadWeather: getPhillipineWeather, loadForecast: getPhillipineForecast },
  { id: "singapore", name: "Singapore", country: "SG", loadWeather: getSingaporeWeather, loadForecast: getSingaporeForecast },
  { id: "vietnam", name: "Vietnam", country: "VN", loadWeather: getVietnamWeather, loadForecast: getVietnamForecast },
];

// Looks up a city by its id. Unknown id = the default city.
export function findCityById(cityId: string): City {
  const match = cityList.find((city) => city.id === cityId);
  return match ?? phnomPenh;
}
