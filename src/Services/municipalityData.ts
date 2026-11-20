import fetchAPI from "@/Services/APIClient";
import { municipalities } from "@/data/municipalities";

export const CURRENT_YEAR = new Date().getFullYear();
// De fem senaste åren, senaste först
export const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export type MunicipalityStats = {
  id: string;
  name: string;
  population: number | null;
  flowByYear: Record<number, number>; // netto, m³/år
  lossByYear: Record<number, number>; // total_neg, m³/år
};

async function loadAll(): Promise<Record<string, MunicipalityStats>> {
  const [populationRes, flowRes] = await Promise.all([
    fetchAPI.getPopulationLatest(),
    fetchAPI.getNetFlowYearly(YEARS[YEARS.length - 1], YEARS[0]),
  ]);

  const popByName = new Map<string, number>(
    populationRes.data.map(
      (r) => [r.municipality.trim().toUpperCase(), r.population] as [string, number],
    ),
  );

  const result: Record<string, MunicipalityStats> = {};
  for (const m of municipalities) {
    const key = m.name.toUpperCase(); // backend lagrar versaler
    const flowByYear: Record<number, number> = {};
const lossByYear: Record<number, number> = {};
for (const r of flowRes.data) {
  if (r.municipality.toUpperCase() !== key) continue;
  if (r.total_sum > 0) flowByYear[r.year] = r.total_sum;
  if (r.total_neg > 0) lossByYear[r.year] = r.total_neg;
}
result[m.id] = {
  id: m.id,
  name: m.name,
  population: popByName.get(key) ?? null,
  flowByYear: flowByYear ?? {},
  lossByYear: lossByYear ?? {},
};
  }
  return result;
}

// Ett anrop delas av alla komponenter (och av StrictModes dubbla effekt)
let promise: Promise<Record<string, MunicipalityStats>> | null = null;
export function getMunicipalityStats() {
  if (!promise) {
    promise = loadAll().catch((err) => {
      promise = null; // tillåt nytt försök efter fel
      throw err;
    });
  }
  return promise;
}