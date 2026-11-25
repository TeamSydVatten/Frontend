import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { BASE_OPTIONS } from "@/utils/chart";
import {
  PLANT_COLORS,
  formatMonth,
  formatNumber,
  type MonthlyProduction,
} from "@/utils/production";

interface ProductionOverTimeChartProps {
  // Key = plant name or "Alla verk", value = production per month.
  monthly: Record<string, MonthlyProduction[]>;
}

// 3.1 Production over time, one line per plant plus the total.
export default function ProductionOverTimeChart({ monthly }: ProductionOverTimeChartProps) {
  const names = Object.keys(monthly);
  const months = [...new Set(names.flatMap((name) => monthly[name].map((row) => row.month)))].sort();

  const series = names.map((name) => ({
    name,
    data: months.map((month) => {
      const row = monthly[name].find((r) => r.month === month);
      return row ? Math.round(row.m3) : null;
    }),
  }));

  const options: ApexOptions = {
    ...BASE_OPTIONS,
    colors: names.map((name) => PLANT_COLORS[name]),
    stroke: { width: 2, curve: "smooth" },
    xaxis: {
      categories: months.map(formatMonth),
      tickAmount: 12,
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: "m³ per månad" },
      labels: { formatter: (value) => formatNumber(value) },
    },
    tooltip: { y: { formatter: (value) => `${formatNumber(value)} m³` } },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
}
