import type { Location } from "@/types/location";

export const locationById = {
  vomb: {
    id: "vomb",
    name: "Vombsjön",
    description: "Stor sjö i Lunds kommun.",
    waterflow: 31.8,
    waterlevel: 14,
    series: [],
    lossSeries: [],
  },
  helgean: {
    id: "helgean",
    name: "Helgeån",
    description: "asd",
    waterflow: 31.8,
    waterlevel: 14,
    series: [],
    lossSeries: [],
  },
  vomb: {
    id: "vomb",
    name: "Vombsjön",
    description: "Stor sjö i Lunds kommun.",
    waterflow: 31.8,
    waterlevel: 14,
    series: [
      { date: "2026-10-01", value: 12.1 },
      { date: "2026-10-02", value: 12.4 },
    ],
    lossSeries: [
      { date: "2026-10-01", value: 1.2 },
      { date: "2026-10-02", value: 1.1 },
    ],
  },
  ringsjon: {
    id: "ringsjon",
    name: "Ringsjön",
    description: "Ser ut som en ring typ.",
    waterflow: 12.8,
    waterlevel: 33,
    series: [
      { date: "2026-10-01", value: 11.8 },
      { date: "2026-10-02", value: 12.0 },
    ],
    lossSeries: [
      { date: "2026-10-01", value: 0.9 },
      { date: "2026-10-02", value: 1.0 },
    ],
  },
  bolmen: {
    id: "bolmen",
    name: "Bolmen",
    description: "Bolmar rök.",
    waterflow: 7.8,
    waterlevel: 130,
    series: [
      { date: "2026-10-01", value: 7.5 },
      { date: "2026-10-02", value: 7.9 },
    ],
    lossSeries: [
      { date: "2026-10-01", value: 0.5 },
      { date: "2026-10-02", value: 0.6 },
    ],
  },
} satisfies Record<string, Location>;

export type LocationId = keyof typeof locationById;