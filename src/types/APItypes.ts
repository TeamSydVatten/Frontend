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

export type NetFlowResponse = {
  status: string;
  municipality: string;
  data: { total_pos: number; total_neg: number; total_sum: number }[];
  error?: string;
}

export type PopulationRow = {
  municipality: string;
  population: number;
  year: number;
}

export type PopulationResponse = {
  status: string;
  count: number;
  data: PopulationRow[];
}

export type YearlyFlowResponse = {
  status: string;
  data: {
    municipality: string;
    year: number;
    total_pos: number;
    total_neg: number;
    total_sum: number;
  }[];
};

;

