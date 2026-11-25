import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { PopulationRow, YearlyDeliveryRow } from "@/api/sydvatten";
import { BASE_OPTIONS, SELECT_CLASS } from "@/utils/chart";
import { deliveryPerInhabitant, formatNumber, populationFor } from "@/utils/production";

interface MunicipalityComparisonChartProps {
  delivery: YearlyDeliveryRow[];
  population: PopulationRow[];
  years: number[];
  selected: string;
  onSelect: (municipality: string) => void;
}

// 3.5 Delivery per inhabitant for every municipality, for one year.
export default function MunicipalityComparisonChart({
  delivery,
  population,
  years,
  selected,
  onSelect,
}: MunicipalityComparisonChartProps) {
  const [year, setYear] = useState(years[years.length - 1]);

  const rows = delivery
    .filter((row) => row.year === year)
    .map((row) => ({
      municipality: row.municipality,
      value: deliveryPerInhabitant(row, population),
      population: populationFor(population, row.municipality, row.year),
    }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const series = [
    {
      name: "Leverans per invånare",
      data: rows.map((row) => (row.value === null ? null : Math.round(row.value))),
    },
  ];

  const options: ApexOptions = {
    ...BASE_OPTIONS,
    chart: {
      ...BASE_OPTIONS.chart,
      events: {
        // Clicking a bar selects that municipality in the trend chart.
        dataPointSelection: (_event, _chart, config) => {
          const row = rows[config?.dataPointIndex ?? -1];
          if (row) onSelect(row.municipality);
        },
      },
    },
    colors: rows.map((row) => (row.municipality === selected ? "#465fff" : "#9cb9ff")),
    plotOptions: { bar: { horizontal: true, distributed: true, barHeight: "70%" } },
    legend: { show: false },
    xaxis: {
      categories: rows.map((row) => row.municipality),
      title: { text: "L per invånare och dygn" },
    },
    tooltip: {
      y: {
        formatter: (value, opts) => {
          const found = rows[opts?.dataPointIndex ?? -1]?.population;
          const inhabitants = found
            ? ` (${formatNumber(found.population)} invånare, ${found.year})`
            : "";
          return `${formatNumber(value)} L/inv/dygn${inhabitants}`;
        },
      },
    },
  };

  return (
    <div>
      <select
        className={SELECT_CLASS}
        value={year}
        onChange={(event) => setYear(Number(event.target.value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <Chart options={options} series={series} type="bar" height={420} />
    </div>
  );
}
