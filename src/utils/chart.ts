import type { ApexOptions } from "apexcharts";

// Settings shared by all charts on the production page.
export const BASE_OPTIONS: ApexOptions = {
  chart: {
    fontFamily: "Outfit, sans-serif",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  legend: { position: "top", horizontalAlign: "left" },
  grid: { borderColor: "#e4e7ec" },
};

// Same look for every dropdown on the production page.
export const SELECT_CLASS =
  "rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

// One fixed color per plant and per lake, the same on every page.
// Hex values from the @theme palette in index.css.
export const PLANT_COLORS: Record<string, string> = {
  Vombverket: "#465fff", // brand-500
  Ringsjöverket: "#f79009", // warning-500
  "Alla verk": "#667085", // gray-500
};

// Each lake gets the color of the plant it supplies. Bolmen has no plant
// of its own in the dashboard, so it gets purple.
export const LAKE_COLORS = {
  vomb: PLANT_COLORS.Vombverket,
  ringsjon: PLANT_COLORS["Ringsjöverket"],
  bolmen: "#7a5af8", // theme-purple-500
};

// Precipitation bars next to the lake level
export const PRECIPITATION_COLOR = "#93C5FD";
