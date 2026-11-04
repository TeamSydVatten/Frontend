export interface FlowReading {
  meter_id: string;
  timestamp: string;         
  water_flow: number;
  is_normal: boolean | null;
}

export interface FlowResponse {
  status: string;            
  count: number;
  data: FlowReading[];
}