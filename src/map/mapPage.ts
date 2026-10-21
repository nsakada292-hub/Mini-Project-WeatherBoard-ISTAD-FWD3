// Map page: an interactive Leaflet map with OpenWeatherMap weather layers.
import { initThemeToggle } from "../shared/theme.js";
import { buildTileUrl } from "../shared/apiConfig.js";

// Leaflet is loaded from a CDN, so it is a global. We only use a small part
// of it here, so we describe just that part instead of adding @types/leaflet.
interface TileLayer {
  addTo(map: unknown): TileLayer;
}

interface LeafletMap {
  setView(center: [number, number], zoom: number): LeafletMap;
}

interface LeafletControl {
  layers(
    baseLayers: unknown,
    overlays: Record<string, TileLayer>,
    options?: { collapsed?: boolean },
  ): { addTo(map: unknown): void };
}

interface Leaflet {
  map(id: string): LeafletMap;
  tileLayer(url: string, options?: { opacity?: number; attribution?: string }): TileLayer;
  control: LeafletControl;
}

declare const L: Leaflet;

// The weather layers the user can switch on and off.
const OVERLAY_LAYERS = [
  "Temperature",
  "Clouds",
  "Precipitation",
  "Wind",
  "Pressure",
] as const;

function startMapPage(): void {
  // Cambodia, so the map opens on the region the app covers.
  const map = L.map("map").setView([11.5564, 104.9282], 5);

  // The plain map tiles that sit under the weather layers.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const layers: Record<string, TileLayer> = {};
  for (const name of OVERLAY_LAYERS) {
    layers[name] = L.tileLayer(buildTileUrl(name.toLowerCase() + "_new"), { opacity: 1 });
  }

  // Show clouds by default, and let the user pick another layer.
  layers["Clouds"]?.addTo(map);
  L.control.layers(null, layers, { collapsed: false }).addTo(map);
}

// The dark / light switch lives in the header of every page.
initThemeToggle();

startMapPage();
