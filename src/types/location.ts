interface Named {
  id: string;
  name: string;
  description: string;
}

interface BaseLocation extends Named {
  series: Point[];
  lossSeries: Point[];
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

export interface Municipality extends Named {
  regionCode: string;
  population: number;
  totalConsumption: number;
  waterLoss: number;
  lastfiveyears: Record<number, number>;
}