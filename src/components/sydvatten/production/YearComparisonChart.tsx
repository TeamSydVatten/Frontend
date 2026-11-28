import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import PlantSelect from "@/components/sydvatten/production/PlantSelect";
import { BASE_OPTIONS } from "@/utils/chart";
import {
  ALL_PLANTS,
  MONTH_NAMES,
  formatNumber,
  yearColor,
  type MonthlyProduction,
} from "@/utils/production";

interface YearComparisonChartProps {
  monthly: Record<string, MonthlyProduction[]>;
}

// 3.2 Production per month, one line per year.
export default function YearComparisonChart({ monthly }: YearComparisonChartProps) {
  const [plant, setPlant] = useState(ALL_PLANTS);

  const rows = monthly[plant];
  const years = [...new Set(rows.map((row) => row.month.slice(0, 4)))].sort();

  const series = years.map((year) => ({
    name: year,
    data: MONTH_NAMES.map((_, index) => {
      const month = `${year}-${String(index + 1).padStart(2, "0")}`;
      const row = rows.find((r) => r.month === month);
      return row ? Math.round(row.m3) : null;
    }),
  }));

  const options: ApexOptions = {
    ...BASE_OPTIONS,
    colors: years.map((_, index) => yearColor(index, years.length)),
    stroke: { width: 2, curve: "smooth" },
    xaxis: { categories: MONTH_NAMES },
    yaxis: { labels: { formatter: (value) => formatNumber(value) } },
    tooltip: { y: { formatter: (value) => `${formatNumber(value)} m³` } },
  };

  return (
    <div>
      <PlantSelect value={plant} onChange={setPlant} />
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
