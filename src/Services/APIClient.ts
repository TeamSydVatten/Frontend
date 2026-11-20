import type { LakeLevelResponse } from "@/types/APItypes";
import type { NetFlowResponse } from "@/types/APItypes";
import type { PopulationResponse } from "@/types/APItypes";
import type { YearlyFlowResponse } from "@/types/APItypes";

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


const fetchAPI = {
  getData() {
    return get("/flow/data");
  },

  getMunicipality(name : string) {
    return get(`/flow/municipality/${encodeURIComponent(name)}`);
  },

  getAllMeters() {
    return get(`/flow/meters/`)
  },

  getNetFlowYearly(fromYear: number, toYear: number) {
  const qs = new URLSearchParams({
    from_year: String(fromYear),
    to_year: String(toYear),
  });
  return get<YearlyFlowResponse>(`/flow/net/municipalities/yearly?${qs}`);
  },

  getNetFlow(municipality: string, fromDate: string, toDate: string) {
    const qs = new URLSearchParams({ from_date: fromDate, to_date: toDate });
    return get<NetFlowResponse>(
      `/flow/net/municipality/${encodeURIComponent(municipality)}?${qs}`,
    );
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

  getPowerData(){
    return get(`/power/data`)
  },

   getPopulationLatest() {
    return get<PopulationResponse>("/population/data/latest");
  },

  /** Befolkning per år (från SCB) för en kommun, t.ex. "Malmö" */
  getPopulationByMunicipality(municipality: string) {
    return get<PopulationResponse>(`/population/municipality/${encodeURIComponent(municipality)}`);
  },

  getFlowByMunicipality(municipality: string){
    return get(`/flow/municipality/${encodeURIComponent(municipality)}`)}
  ,
  
  // Fler endpoints lägger du bara till här:
  // getData(name: string) { return get(`/flow/data/${encodeURIComponent(name)}`); },
};

export default fetchAPI;