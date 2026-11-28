import type {
  DailyProductionRow,
  PopulationRow,
  YearlyDeliveryRow,
} from "@/Services/APIClient";

export const ALL_PLANTS = "Alla verk";

export const PLANT_COLORS: Record<string, string> = {
  Vombverket: "#465fff",
  Ringsjöverket: "#f79009",
  [ALL_PLANTS]: "#667085",
};

// Older years in grey, the latest year in blue.
export const YEAR_COLORS = ["#e4e7ec", "#d0d5dd", "#98a2b3", "#667085", "#465fff"];

export const SEASONS = ["Vinter", "Vår", "Sommar", "Höst"];

export const MONTH_NAMES = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

export function yearColor(index: number, count: number): string {
  const colorIndex = YEAR_COLORS.length - (count - index);
  return YEAR_COLORS[Math.max(colorIndex, 0)];
}

export function formatNumber(value: number | null, decimals = 0): string {
  if (value === null || Number.isNaN(value)) {
    return "–";
  }
  return value.toLocaleString("sv-SE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// "2025-03" -> "mar 2025"
export function formatMonth(month: string): string {
  return `${MONTH_NAMES[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;
}

function daysInMonth(month: string): number {
  return new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
}

function daysInYear(year: number): number {
  return year % 4 === 0 ? 366 : 365;
}

// ---------- Production ----------

export interface MonthlyProduction {
  month: string; // "2025-03"
  m3: number;
}

/**
 * Production per month in m³.
 *
 * The API gives the average flow per day in L/s. 1 L/s during a whole day is
 * 86.4 m³. Months with missing days are left out, so a half month does not
 * look like a drop in production.
 */
export function monthlyProduction(rows: DailyProductionRow[]): MonthlyProduction[] {
  const totals = new Map<string, number>();
  const daysWithData = new Map<string, number>();
  const plantCount = new Set(rows.map((row) => row.plant)).size;

  for (const row of rows) {
    const month = row.date.slice(0, 7);
    totals.set(month, (totals.get(month) ?? 0) + row.water_flow * 86.4);
    daysWithData.set(month, (daysWithData.get(month) ?? 0) + 1);
  }

  return [...totals.keys()]
    .sort()
    .filter((month) => daysWithData.get(month) === daysInMonth(month) * plantCount)
    .map((month) => ({ month, m3: totals.get(month) ?? 0 }));
}

// Years where all 12 months have data. Partial years are not compared.
export function completeYears(monthly: MonthlyProduction[]): number[] {
  const monthsPerYear = new Map<number, number>();
  for (const row of monthly) {
    const year = Number(row.month.slice(0, 4));
    monthsPerYear.set(year, (monthsPerYear.get(year) ?? 0) + 1);
  }
  return [...monthsPerYear.keys()]
    .filter((year) => monthsPerYear.get(year) === 12)
    .sort();
}

// December belongs to the next year's winter: "Vinter 2025" = dec 2024 – feb 2025.
function seasonOf(month: string): { year: number; season: string } {
  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));

  if (monthNumber === 12) return { year: year + 1, season: "Vinter" };
  if (monthNumber <= 2) return { year, season: "Vinter" };
  if (monthNumber <= 5) return { year, season: "Vår" };
  if (monthNumber <= 8) return { year, season: "Sommar" };
  return { year, season: "Höst" };
}

/**
 * Production per season and year, in m³. A season is only shown when all
 * three months have data, otherwise the value is null.
 */
export function seasonProduction(
  monthly: MonthlyProduction[],
): { year: number; values: (number | null)[] }[] {
  const totals = new Map<string, number>(); // "2025-Vår" -> m³
  const months = new Map<string, number>(); // "2025-Vår" -> months with data
  const years = new Set<number>();

  for (const row of monthly) {
    const { year, season } = seasonOf(row.month);
    const key = `${year}-${season}`;
    totals.set(key, (totals.get(key) ?? 0) + row.m3);
    months.set(key, (months.get(key) ?? 0) + 1);
    years.add(year);
  }

  return [...years]
    .sort()
    .map((year) => ({
      year,
      values: SEASONS.map((season) => {
        const key = `${year}-${season}`;
        return months.get(key) === 3 ? (totals.get(key) ?? 0) : null;
      }),
    }))
    .filter((row) => row.values.some((value) => value !== null));
}

// ---------- Population ----------

/**
 * Population for a municipality and year.
 *
 * SCB writes "Malmö" and the flow meters "MALMÖ", so names are compared in
 * upper case. SCB is about a year behind, so for a year without data the
 * latest earlier year is used. The returned year says which year was used.
 */
export function populationFor(
  rows: PopulationRow[],
  municipality: string,
  year: number,
): { population: number; year: number } | null {
  let best: PopulationRow | null = null;

  for (const row of rows) {
    if (row.municipality.toUpperCase() !== municipality.toUpperCase()) continue;
    if (row.year > year) continue;
    if (best === null || row.year > best.year) best = row;
  }

  return best ? { population: best.population, year: best.year } : null;
}

// Total population of the municipalities Sydvatten delivers to.
export function totalPopulationFor(
  rows: PopulationRow[],
  municipalities: string[],
  year: number,
): number {
  return municipalities.reduce(
    (sum, municipality) => sum + (populationFor(rows, municipality, year)?.population ?? 0),
    0,
  );
}

// ---------- Per inhabitant (L per inhabitant and day) ----------

export function productionPerInhabitant(
  m3: number,
  days: number,
  population: number,
): number | null {
  return population > 0 ? (m3 * 1000) / days / population : null;
}

export function monthlyProductionPerInhabitant(
  monthly: MonthlyProduction[],
  population: PopulationRow[],
  municipalities: string[],
): { month: string; value: number | null }[] {
  return monthly.map((row) => ({
    month: row.month,
    value: productionPerInhabitant(
      row.m3,
      daysInMonth(row.month),
      totalPopulationFor(population, municipalities, Number(row.month.slice(0, 4))),
    ),
  }));
}

export function yearlyProductionPerInhabitant(
  monthly: MonthlyProduction[],
  population: PopulationRow[],
  municipalities: string[],
  year: number,
): number | null {
  const m3 = monthly
    .filter((row) => row.month.startsWith(String(year)))
    .reduce((sum, row) => sum + row.m3, 0);
  return productionPerInhabitant(
    m3,
    daysInYear(year),
    totalPopulationFor(population, municipalities, year),
  );
}

// total_sum is in litres (L/s × 3600 s for every hourly value).
export function deliveryPerInhabitant(
  row: YearlyDeliveryRow,
  population: PopulationRow[],
): number | null {
  const found = populationFor(population, row.municipality, row.year);
  return found ? row.total_sum / daysInYear(row.year) / found.population : null;
}

// ---------- Trend and forecast ----------

// Linear trend (least squares) through values[0..n-1]: y = intercept + slope * index.
export function linearTrend(values: number[]): { slope: number; intercept: number } {
  const count = values.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  values.forEach((value, index) => {
    sumX += index;
    sumY += value;
    sumXY += index * value;
    sumXX += index * index;
  });

  const slope = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / count;
  return { slope, intercept };
}

// Forecast (F.BN4.20): the average yearly change in percent is applied to
// the coming years.
export function forecastByAverageChange(
  values: number[],
  yearsAhead: number,
): { averageChangePercent: number; forecast: number[] } {
  const changes: number[] = [];
  for (let index = 1; index < values.length; index++) {
    changes.push(((values[index] - values[index - 1]) / values[index - 1]) * 100);
  }
  const averageChangePercent =
    changes.reduce((sum, change) => sum + change, 0) / changes.length;

  const forecast: number[] = [];
  let previous = values[values.length - 1];
  for (let year = 0; year < yearsAhead; year++) {
    previous = previous * (1 + averageChangePercent / 100);
    forecast.push(previous);
  }

  return { averageChangePercent, forecast };
}
