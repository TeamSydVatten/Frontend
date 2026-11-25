import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import PlantSelect from "@/components/sydvatten/production/PlantSelect";
import { BASE_OPTIONS } from "@/utils/chart";
import {
  ALL_PLANTS,
  SEASONS,
  formatNumber,
  seasonProduction,
  yearColor,
  type MonthlyProduction,
} from "@/utils/production";

interface SeasonChartProps {
  monthly: Record<string, MonthlyProduction[]>;
}

// 3.3 Production per season, one bar per year.
export default function SeasonChart({ monthly }: SeasonChartProps) {
  const [plant, setPlant] = useState(ALL_PLANTS);

  const seasons = seasonProduction(monthly[plant]);

  const series = seasons.map((row) => ({
    name: String(row.year),
    data: row.values.map((value) => (value === null ? null : Math.round(value))),
  }));

  const options: ApexOptions = {
    ...BASE_OPTIONS,
    colors: seasons.map((_, index) => yearColor(index, seasons.length)),
    plotOptions: { bar: { columnWidth: "70%" } },
    xaxis: { categories: SEASONS },
    yaxis: { labels: { formatter: (value) => formatNumber(value) } },
    tooltip: { y: { formatter: (value) => `${formatNumber(value)} m³` } },
  };

  return (
    <div>
      <PlantSelect value={plant} onChange={setPlant} />
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
