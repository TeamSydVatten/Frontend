import type { LakeLevelResponse } from "@/types/APItypes";
import type { NetFlowResponse } from "@/types/APItypes";
import type { PopulationResponse } from "@/types/APItypes";
import type { YearlyFlowResponse } from "@/types/APItypes";
import type { DailyFlowResponse } from "@/types/APItypes";

const BASE_URL = "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Status ${res.status} för ${path}`);

  const body = await res.json();
  if (body?.status && body.status !== "200") {
    throw new Error(body.error ?? `API-fel ${body.status} för ${path}`);
  }
  return body as T;
}


// Backendens /flow/sum/... returnerar liter (L/s × 3600 per timme, summerat).
// Frontend räknar i m³, så vi delar med 1000 här.
const LITERS_PER_M3 = 1000;

type FlowTotals = { total_pos: number; total_neg: number; total_sum: number };

function litersToM3<T extends FlowTotals>(row: T): T {
  return {
    ...row,
    total_pos: Number(row.total_pos) / LITERS_PER_M3,
    total_neg: Number(row.total_neg) / LITERS_PER_M3,
    total_sum: Number(row.total_sum) / LITERS_PER_M3,
  };
}

const fetchAPI = {
  // OBS: backend returnerar max 1000 rader (LIMIT 1000)
  getData() {
    return get("/flow/data");
  },

  // Alla timvärden för kommunens mätare (kan bli mycket data)
  getMunicipality(name: string) {
    return get(`/flow/municipality/${encodeURIComponent(name)}/hourly`);
  },

  /**
   * Dagligt medelflöde (L/s) för en kommun: avg_pos, avg_neg och
   * avg_sum (netto = PLUS − MINUS). from/to = "YYYY-MM-DD".
   */
  getMunicipalityDailyFlow(municipality: string, fromDate: string, toDate: string) {
    const qs = new URLSearchParams({ from_date: fromDate, to_date: toDate });
    return get<DailyFlowResponse>(
      `/flow/period/municipality/${encodeURIComponent(municipality)}/daily?${qs}`,
    );
  },

  getAllMeters() {
    return get(`/flow/meters`);
  },

  /** Nettoflöde per kommun och år, i m³ */
  async getNetFlowYearly(fromYear: number, toYear: number) {
    const qs = new URLSearchParams({
      from_year: String(fromYear),
      to_year: String(toYear),
    });
    const res = await get<YearlyFlowResponse>(`/flow/sum/yearly?${qs}`);
    return { ...res, data: res.data.map(litersToM3) };
  },

  /** Nettoflöde för en kommun under en period, i m³ */
  async getNetFlow(municipality: string, fromDate: string, toDate: string) {
    const qs = new URLSearchParams({ from_date: fromDate, to_date: toDate });
    const res = await get<NetFlowResponse>(
      `/flow/sum/period/municipality/${encodeURIComponent(municipality)}?${qs}`,
    );
    return { ...res, data: res.data.map(litersToM3) };
  },

  getAllPopulations() {
    return get(`/population/data/`)
  },
  
  getMeterByID(meter_id : string) {
    return get(`/flow/meter/${encodeURIComponent(meter_id)}`)
  },

  getLakeLevel(name: string) {
  return get<LakeLevelResponse>(`/level/lake/${encodeURIComponent(name)}`);
},

  getLakePrecipitation(name : string){
    return get(`/precipitation/lake/${encodeURIComponent(name)}`)
  },

  // OBS: skickar ALL eldata (~350 000 rader med 5-årsdatan). Använd hellre getPowerPeriod.
  getPowerData(){
    return get(`/power/data`)
  },

  /** Elförbrukning per timme och plats för en period. from/to = "YYYY-MM-DD" */
  getPowerPeriod(fromDate: string, toDate: string) {
    const qs = new URLSearchParams({ from_date: fromDate, to_date: toDate });
    return get<{ status: string; count: number; data: { location: string; timestamp: string; usage: number }[] }>(
      `/power/period?${qs}`,
    );
  },

   getPopulationLatest() {
    return get<PopulationResponse>("/population/data/latest");
  },

  /** Befolkning per år (från SCB) för en kommun, t.ex. "Malmö" */
  getPopulationByMunicipality(municipality: string) {
    return get<PopulationResponse>(`/population/municipality/${encodeURIComponent(municipality)}`);
  },

  getFlowByMunicipality(municipality: string) {
    return get(`/flow/municipality/${encodeURIComponent(municipality)}/hourly`);
  },
  getTemperaturByStaion(station: string) {
    return get(`/temperature/station/${encodeURIComponent(station)}`);
  },

  // Fler endpoints lägger du bara till här:
  // getData(name: string) { return get(`/flow/data/${encodeURIComponent(name)}`); },
};

export default fetchAPI;