import type { Location } from "@/types/location";

export const locationById = {
  vomb: {
    id: "vomb",
    name: "Vombsjön",
    description: "Stor sjö i Lunds kommun.",
    waterflow: 31.8,
    waterlevel: 14,
    series: [],
  },
  ringsjon: {
    id: "ringsjon",
    name: "Ringsjön",
    description: "Ser ut som en ring typ.",
    waterflow: 12.8,
    waterlevel: 33,
    series: [],
  },
  bolmen: {
    id: "bolmen",
    name: "Bolmen",
    description: "Bolmar rök.",
    waterflow: 7.8,
    waterlevel: 130,
    series: [],
  },
} satisfies Record<string, Location>;



export type LocationId = keyof typeof locationById