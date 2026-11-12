import type { LakeLevelResponse } from "@/types/APItypes";

const BASE_URL = "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Status ${res.status} för ${path}`);
  return res.json();
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
  }
  ,
  getFlowByMunicipality(municipality: string){
    return get(`/flow/municipality/${encodeURIComponent(municipality)}`)}
  ,

  // Fler endpoints lägger du bara till här:
  // getData(name: string) { return get(`/flow/data/${encodeURIComponent(name)}`); },
};

export default fetchAPI;