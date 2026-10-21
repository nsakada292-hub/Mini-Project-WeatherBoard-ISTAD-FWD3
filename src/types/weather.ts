// Shapes of the two API responses this app uses.
// Every field below really exists in the OpenWeatherMap JSON.

// One condition line, e.g. { "main": "Clouds", "description": "few clouds", "icon": "02d" }
export type WeatherCondition = {
  id: number;          // weather code (800 = clear sky)
  main: string;        // short group, e.g. "Clouds"
  description: string; // long text, e.g. "few clouds"
  icon: string;        // icon code, e.g. "02d" (used to build the image URL)
};

// The "main" block: temperatures and air numbers.
export type MainReading = {
  temp: number;        // current temperature
  feels_like: number;  // what the temperature feels like outside
  temp_min: number;    // lowest temperature right now
  temp_max: number;    // highest temperature right now
  pressure: number;    // air pressure in hPa
  humidity: number;    // humidity in %
};

// The "wind" block.
export type WindReading = {
  speed: number; // wind speed (m/s in metric, mph in imperial)
  deg: number;   // wind direction in degrees
};

// The "clouds" block.
export type CloudsReading = {
  all: number; // cloud cover in %
};

// The "coord" block: where the city is.
export type Coordinates = {
  lat: number; // latitude
  lon: number; // longitude
};

// The "sys" block: country and sun times.
export type SysReading = {
  country: string; // 2-letter country code, e.g. "KH"
  sunrise: number; // sunrise time as unix seconds
  sunset: number;  // sunset time as unix seconds
};

// The full response of /data/2.5/weather (current weather of one city).
export type CurrentWeather = {
  coord: Coordinates;            // where the city is
  weather: WeatherCondition[];   // conditions (the app uses the first one)
  main: MainReading;             // temperatures + humidity + pressure
  visibility: number;            // visibility in metres
  wind: WindReading;             // wind
  clouds: CloudsReading;         // cloud cover
  dt: number;                    // time of this data as unix seconds
  sys: SysReading;               // country + sunrise/sunset
  timezone: number;              // city time offset from UTC, in seconds
  id: number;                    // city id from the API
  name: string;                  // city name from the API
  cod: number;                   // 200 = OK
};

// One 3-hour step of the forecast.
export type ForecastItem = {
  dt: number;                  // time of this step as unix seconds
  main: MainReading;           // temperatures for this step
  weather: WeatherCondition[]; // condition for this step
  visibility: number;          // visibility in metres
  clouds: CloudsReading;       // cloud cover
  wind: WindReading;           // wind
  dt_txt: string;              // time as text, e.g. "2026-10-21 09:00:00" (UTC)
};

// City info that comes with every forecast response.
export type ForecastCity = {
  id: number;      // city id from the API
  name: string;    // city name, e.g. "Phnom Penh"
  coord: Coordinates; // where the city is
  country: string; // 2-letter country code
  timezone: number;// city time offset from UTC, in seconds
  sunrise: number; // sunrise time as unix seconds
  sunset: number;  // sunset time as unix seconds
};

// The full response of /data/2.5/forecast (5 days in 3-hour steps).
export type ForecastResponse = {
  cod: string;          // "200" = OK (a string in this endpoint!)
  message: number;      // extra info from the API
  cnt: number;          // how many items are in the list
  list: ForecastItem[]; // the forecast steps
  city: ForecastCity;   // which city this forecast is for
};
