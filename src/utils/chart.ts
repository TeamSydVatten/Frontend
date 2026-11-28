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
