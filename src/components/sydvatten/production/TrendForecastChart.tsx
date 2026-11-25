import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { PopulationRow, YearlyDeliveryRow } from "@/api/sydvatten";
import { BASE_OPTIONS, SELECT_CLASS } from "@/utils/chart";
import {
  ALL_PLANTS,
  deliveryPerInhabitant,
  forecastByAverageChange,
  formatNumber,
  linearTrend,
  populationFor,
  totalPopulationFor,
  yearlyProductionPerInhabitant,
  type MonthlyProduction,
} from "@/utils/production";

const FORECAST_YEARS = 3;

interface TrendForecastChartProps {
  delivery: YearlyDeliveryRow[];
  population: PopulationRow[];
  monthlyTotal: MonthlyProduction[];
  municipalities: string[];
  years: number[];
  // ALL_PLANTS = production for all plants, otherwise a municipality.
  selected: string;
  onSelect: (selected: string) => void;
}

// 3.6 Yearly value per inhabitant with trend line and forecast.
export default function TrendForecastChart({
  delivery,
  population,
  monthlyTotal,
  municipalities,
  years,
  selected,
  onSelect,
}: TrendForecastChartProps) {
  const isProduction = selected === ALL_PLANTS;

  // One row per complete year: value per inhabitant and the population used.
  const actual = years
    .map((year) => {
      if (isProduction) {
        return {
          year,
          value: yearlyProductionPerInhabitant(monthlyTotal, population, municipalities, year),
          population: totalPopulationFor(population, municipalities, year),
          populationYear: populationFor(population, municipalities[0], year)?.year ?? null,
        };
      }
      const row = delivery.find((r) => r.municipality === selected && r.year === year);
      const found = populationFor(population, selected, year);
      return {
        year,
        value: row ? deliveryPerInhabitant(row, population) : null,
        population: found?.population ?? null,
        populationYear: found?.year ?? null,
      };
    })
    .filter((row) => row.value !== null);

  const values = actual.map((row) => row.value as number);
  const lastYear = actual.length > 0 ? actual[actual.length - 1].year : 0;
  const forecastYears = Array.from({ length: FORECAST_YEARS }, (_, i) => lastYear + 1 + i);

  let averageChangePercent: number | null = null;
  const series: { name: string; data: (number | null)[] }[] = [];

  if (values.length > 1) {
    const trend = linearTrend(values);
    const forecast = forecastByAverageChange(values, FORECAST_YEARS);
    averageChangePercent = forecast.averageChangePercent;
    const empty = forecastYears.map(() => null);

    series.push(
      { name: "Faktisk", data: [...values, ...empty] },
      {
        name: "Trendlinje",
        data: [...values.map((_, index) => trend.intercept + trend.slope * index), ...empty],
      },
      {
        // Starts at the last actual year so the lines connect.
        name: "Prognos",
        data: [
          ...values.map((value, index) => (index === values.length - 1 ? value : null)),
          ...forecast.forecast,
        ],
      },
    );
  }

  const options: ApexOptions = {
    ...BASE_OPTIONS,
    colors: ["#465fff", "#344054", "#98a2b3"],
    stroke: { width: [3, 2, 2], dashArray: [0, 3, 6] },
    markers: { size: [4, 0, 4] },
    xaxis: { categories: [...actual.map((row) => String(row.year)), ...forecastYears.map(String)] },
    yaxis: {
      title: { text: "L/inv/dygn" },
      labels: { formatter: (value) => formatNumber(value) },
    },
    tooltip: { y: { formatter: (value) => `${formatNumber(value, 1)} L/inv/dygn` } },
  };

  const cellClass = "px-3 py-2 text-start text-theme-sm text-gray-800 dark:text-white/90";
  const headerClass =
    "px-3 py-2 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400";

  return (
    <div>
      <select
        className={SELECT_CLASS}
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value={ALL_PLANTS}>Produktion, alla verk</option>
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            Leverans, {municipality}
          </option>
        ))}
      </select>

      {series.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">Minst två hela år behövs för en trend.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Prognosen bygger på snittet av tidigare års förändring (
            {formatNumber(averageChangePercent, 1)} % per år).
          </p>
          <Chart options={options} series={series} type="line" height={300} />
        </>
      )}

      {/* Population used as denominator, per year */}
      <table className="min-w-full">
        <thead className="border-b border-gray-100 dark:border-white/[0.05]">
          <tr>
            <th className={headerClass}>År</th>
            <th className={headerClass}>Invånare</th>
            <th className={headerClass}>L/inv/dygn</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {actual.map((row) => (
            <tr key={row.year}>
              <td className={cellClass}>{row.year}</td>
              <td className={cellClass}>
                {formatNumber(row.population)}
                {row.populationYear !== null && row.populationYear !== row.year && (
                  <span className="text-gray-500"> (SCB {row.populationYear})</span>
                )}
              </td>
              <td className={cellClass}>{formatNumber(row.value, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
