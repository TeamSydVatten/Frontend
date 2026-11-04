interface BaseLocation {
  id: string;
  name: string;
  description: string;
  series: { date: string; value: number }[];
  lossSeries: { date: string; value: number }[];
  meterId: string;
}

export type Point = { date: string; value: number };

export interface Location extends BaseLocation {
  waterflow: number;
  waterlevel: number;
  kpis: {
    electric: Point[];
    precipitation: Point[];
    water: Point[];
  };
}

export interface Municipality extends BaseLocation {
  regionCode: string;
  population: number;
  totalConsumption: number;
  waterLoss: number;
}