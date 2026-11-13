import type { LakeLevelResponse } from "@/types/APItypes";

const BASE_URL = "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Status ${res.status} för ${path}`);
  return res.json();
}

// Databasen har fem års timdata, så vi hämtar bara den senaste perioden.
// days räknas bakåt från senaste mätningen i databasen.
const FLOW_DAYS = 1;
const POWER_DAYS = 60; // Energiöversikten jämför 30 dagar mot föregående 30

const fetchAPI = {
  getData(days: number = FLOW_DAYS) {
    return get(`/flow/data?days=${days}`);
  },

  // latest = bara senaste mättillfället för kommunens mätare
  getMunicipality(name: string, latest: boolean = true) {
    return get(
      `/flow/municipality/${encodeURIComponent(name)}?latest=${latest}`,
    );
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

  getPowerData(days: number = POWER_DAYS) {
    return get(`/power/data?days=${days}`);
  },

  getFlowByMunicipality(municipality: string, latest: boolean = true) {
    return get(
      `/flow/municipality/${encodeURIComponent(municipality)}?latest=${latest}`,
    );
  },

  // Fler endpoints lägger du bara till här:
  // getData(name: string) { return get(`/flow/data/${encodeURIComponent(name)}`); },
};

export default fetchAPI;