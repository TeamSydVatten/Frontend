import type { ReactNode } from "react";
import { IoFlash, IoPeople, IoRainy, IoWater } from "react-icons/io5";
import { MdOutlineWater } from "@/icons";

export type KpiId =
  | "electricity"
  | "waterProduction"
  | "precipitation"
  | "waterLevel"
  | "population";

export interface KpiOption {
  id: KpiId;
  /** Nyckel i common.json under analysis.kpiSelector.sources */
  labelKey: string;
  unit: string;
  icon: ReactNode;
}

export const kpiOptions: KpiOption[] = [
  {
    id: "electricity",
    labelKey: "analysis.kpiSelector.sources.electricity",
    unit: "kWh",
    icon: <IoFlash />,
  },
  {
    id: "waterProduction",
    labelKey: "analysis.kpiSelector.sources.waterProduction",
    unit: "m³",
    icon: <IoWater />,
  },
  {
    id: "precipitation",
    labelKey: "analysis.kpiSelector.sources.precipitation",
    unit: "mm",
    icon: <IoRainy />,
  },
  {
    id: "waterLevel",
    labelKey: "analysis.kpiSelector.sources.waterLevel",
    unit: "m",
    icon: <MdOutlineWater />,
  },
  {
    id: "population",
    labelKey: "analysis.kpiSelector.sources.population",
    unit: "invånare",
    icon: <IoPeople />,
  },
];

export const kpiOptionById = Object.fromEntries(
  kpiOptions.map((option) => [option.id, option]),
) as Record<KpiId, KpiOption>;

export const MAX_SOURCES = 5;

export const historyYearOptions = [1, 2, 3, 4, 5];

/** Allt som KPI-väljaren håller koll på. Diagrammet (issue #11) läser samma objekt. */
export interface AnalysisSelection {
  sources: (KpiId | null)[];
  period: { from: string; to: string };
  historical: { enabled: boolean; years: number };
}

export const defaultAnalysisSelection: AnalysisSelection = {
  sources: ["electricity", "waterProduction", "precipitation", "waterLevel", null],
  period: { from: "2025-01-01", to: "2025-12-31" },
  historical: { enabled: true, years: 5 },
};
