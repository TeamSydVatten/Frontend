export const API_URL = "http://localhost:8000";

// The API always answers HTTP 200 and puts the real status in the body,
// so we check body.status instead of response.ok.
interface ApiResponse<T> {
  status: string;
  data?: T[];
  error?: string;
}

async function getData<T>(path: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${path}`);
  const body: ApiResponse<T> = await response.json();

  if (body.status !== "200" || !body.data) {
    throw new Error(body.error ?? `API answered ${body.status}`);
  }

  return body.data;
}

export const PLANTS = ["Vombverket", "Ringsjöverket"];

// Average flow per plant and day, in L/s.
export interface DailyProductionRow {
  plant: string;
  date: string;
  water_flow: number;
}

// Delivered water per municipality and year, in litres.
export interface YearlyDeliveryRow {
  municipality: string;
  year: number;
  total_pos: number;
  total_neg: number;
  total_sum: number;
}

export interface PopulationRow {
  municipality: string;
  year: number;
  population: number;
}

export function getDailyProduction(
  plant: string,
  fromDate: string,
  toDate: string,
): Promise<DailyProductionRow[]> {
  return getData(
    `/production/avg/period/plant/${encodeURIComponent(plant)}/daily` +
      `?from_date=${fromDate}&to_date=${toDate}`,
  );
}

export function getYearlyDelivery(
  fromYear: number,
  toYear: number,
): Promise<YearlyDeliveryRow[]> {
  return getData(`/flow/sum/yearly?from_year=${fromYear}&to_year=${toYear}`);
}

export function getPopulation(): Promise<PopulationRow[]> {
  return getData("/population/data");
}
 