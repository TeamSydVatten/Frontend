export interface FlowReading {
  meter_id: string; //Date
  timestamp: string;         
  water_flow: number;
  is_normal: boolean | null;
}

export interface FlowResponse {
  status: string;            
  count: number;
  data: FlowReading[];
}

export interface LakeLevelRow {
  meter_id: string;
  date: string; // "2026-09-29"
  water_level: number;
  is_normal: boolean | null;
}

export interface LakeLevelResponse {
  status: string;
  count: number;
  data: LakeLevelRow[];
}

