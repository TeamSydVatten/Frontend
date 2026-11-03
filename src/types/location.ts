interface BaseLocation {
  id: string;
  name: string;
  description: string;
  series: { date: string; value: number }[];
  lossSeries: { date: string; value: number }[];
}

export interface Location extends BaseLocation {
  waterflow: number;
  waterlevel: number;
}

export interface Municipality extends BaseLocation {
  regionCode: string;
  population: number;
  totalConsumption: number;
  waterLoss: number;
}