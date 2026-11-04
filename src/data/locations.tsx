import type { Location } from "@/types/location";

export const locationById = {
  vomb: {
  id: "vomb",
  name: "Vombsjön",
  description: "Stor sjö i Lunds kommun.",
  waterflow: 1151.3,
  waterlevel: 18.65,
  meterId: "lund",
  series: [
    { date: "2026-10-01", value: 12.1 },
    { date: "2026-10-02", value: 12.4 },
  ],
  lossSeries: [
    { date: "2026-10-01", value: 1.2 },
    { date: "2026-10-02", value: 1.1 },
  ],
  kpis: {
    electric: [
      { date: "2026-10-01", value: 420 },
      { date: "2026-10-02", value: 435 },
      { date: "2026-10-03", value: 370.5 },
      { date: "2026-10-04", value: 270.9 },
      { date: "2026-10-05", value: 435 },
      { date: "2026-10-06", value: 435 },
      { date: "2026-10-07", value: 435 },
      { date: "2026-10-08", value: 535 },
      { date: "2026-10-09", value: 502 },
      { date: "2026-10-10", value: 203 },
    ],
    precipitation: [
      { date: "2026-10-01", value: 3.2 },
      { date: "2026-10-02", value: 0.0 },
      { date: "2026-10-03", value: 0.2 },
      { date: "2026-10-04", value: 0.0 },
      { date: "2026-10-05", value: 0.2 },
      { date: "2026-10-06", value: 0.5 },
      { date: "2026-10-07", value: 0.2 },
      { date: "2026-10-08", value: 0.0 },
      { date: "2026-10-09", value: 0.2 },
      { date: "2026-10-01", value: 0.9 },
    ],
    water: [
      { date: "2026-10-01", value: 531.8 },
      { date: "2026-10-02", value: 630.9 },
      { date: "2026-10-03", value: 531.8 },
      { date: "2026-10-04", value: 480.9 },
      { date: "2026-10-05", value: 443.8 },
      { date: "2026-10-06", value: 545.9 },
      { date: "2026-10-07", value: 521.8 },
      { date: "2026-10-08", value: 520.9 },
      { date: "2026-10-09", value: 521.8 },
      { date: "2026-10-10", value: 430.9 },
    ],
  },
  
  },
  ringsjon: {
    id: "ringsjon",
    name: "Ringsjön",
    description: "Ser ut som en ring typ.",
    waterflow: 12.8,
    waterlevel: 54.3,
    meterId: "eslov",
    series: [
      { date: "2026-10-01", value: 11.8 },
      { date: "2026-10-02", value: 12.0 },
    ],
    lossSeries: [
      { date: "2026-10-01", value: 0.9 },
      { date: "2026-10-02", value: 1.0 },
    ],
    kpis: {
    electric: [
      { date: "2026-10-01", value: 120 },
      { date: "2026-10-02", value: 135 },
    ],
    precipitation: [
      { date: "2026-10-01", value: 1.2 },
      { date: "2026-10-02", value: 2.0 },
    ],
    water: [
      { date: "2026-10-01", value: 41.8 },
      { date: "2026-10-02", value: 60.9 },
    ],
  },
  },
  bolmen: {
    id: "bolmen",
    name: "Bolmen",
    description: "Bolmar rök.",
    waterflow: 7.8,
    waterlevel: 142,
    meterId: "bolmen",
    series: [
      { date: "2026-10-01", value: 7.5 },
      { date: "2026-10-02", value: 7.9 },
    ],
    lossSeries: [
      { date: "2026-10-01", value: 0.5 },
      { date: "2026-10-02", value: 0.6 },
    ],
    kpis: {
    electric: [
      { date: "2026-10-01", value: 120 },
      { date: "2026-10-02", value: 435 },
    ],
    precipitation: [
      { date: "2026-10-01", value: 3.2 },
      { date: "2026-10-02", value: 2.0 },
    ],
    water: [
      { date: "2026-10-01", value: 51.8 },
      { date: "2026-10-02", value: 31.9 },
    ],
  },
  },
} satisfies Record<string, Location>;

export type LocationId = keyof typeof locationById;