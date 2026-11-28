import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { PopulationRow } from "@/api/sydvatten";
import { BASE_OPTIONS, PLANT_COLORS } from "@/utils/chart";
import {
  ALL_PLANTS,
  formatMonth,
  formatNumber,
  monthlyProductionPerInhabitant,
  type MonthlyProduction,
} from "@/utils/production";

interface PerInhabitantChartProps {
  monthlyTotal: MonthlyProduction[];
  population: PopulationRow[];
  municipalities: string[];
}

// 3.4 Production for all plants divided by the population of the municipalities.
export default function PerInhabitantChart({
  monthlyTotal,
  population,
  municipalities,
}: PerInhabitantChartProps) {
  const rows = monthlyProductionPerInhabitant(monthlyTotal, population, municipalities);

  const series = [
    {
      name: "Produktion per invånare",
      data: rows.map((row) => (row.value === null ? null : Math.round(row.value))),
    },
  ];

  const options: ApexOptions = {
    ...BASE_OPTIONS,
    colors: [PLANT_COLORS[ALL_PLANTS]],
    stroke: { width: 2, curve: "smooth" },
    xaxis: {
      categories: rows.map((row) => formatMonth(row.month)),
      tickAmount: 12,
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: "L/inv/dygn" },
      labels: { formatter: (value) => formatNumber(value) },
    },
    tooltip: { y: { formatter: (value) => `${formatNumber(value)} L/inv/dygn` } },
  };

  return <Chart options={options} series={series} type="line" height={260} />;
}
