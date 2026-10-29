export type ElectricityData = {
  id: string;
  name: string;
  description: string;
  averageConsumption: number;
  lasthoursOfConsumption: Record<string, number>;
};