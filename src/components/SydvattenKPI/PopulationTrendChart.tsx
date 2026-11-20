import { useEffect, useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import fetchAPI from "@/Services/APIClient";
import type { PopulationRow } from "@/types/APItypes";
import { cn } from "@/utils";

interface PopulationTrendChartProps {
  /** Kommunens namn som i databasen, t.ex. "Malmö" */
  municipality: string;
}

const numberFormat = new Intl.NumberFormat("sv-SE");
const percentFormat = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

/** Befolkningsmängd per år för en kommun, med trend (issue #19). */
export default function PopulationTrendChart({ municipality }: PopulationTrendChartProps) {
  const { t } = useTranslation();
  // Svaret sparas tillsammans med kommunen det gäller. Byts kommun räknas det som "laddar"
  // tills nya svaret kommit, utan att state behöver nollställas i effekten.
  const [result, setResult] = useState<{
    municipality: string;
    rows: PopulationRow[];
    failed: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAPI
      .getPopulationByMunicipality(municipality)
      .then((response) => {
        if (!cancelled) setResult({ municipality, rows: response.data ?? [], failed: false });
      })
      .catch((err) => {
        console.error("Population API error:", err);
        if (!cancelled) setResult({ municipality, rows: [], failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [municipality]);

  const current = result?.municipality === municipality ? result : null;
  const status: "loading" | "done" | "error" = !current
    ? "loading"
    : current.failed
      ? "error"
      : "done";

  const sorted = useMemo(
    () => [...(current?.rows ?? [])].sort((a, b) => a.year - b.year),
    [current],
  );

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];
  const years = latest && first ? latest.year - first.year : 0;
  const totalChange = latest && first ? (latest.population - first.population) / first.population : 0;
  // Genomsnittlig årlig förändring (CAGR)
  const yearlyChange =
    latest && first && years > 0 ? (latest.population / first.population) ** (1 / years) - 1 : 0;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "straight", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.45, opacityTo: 0 } },
    markers: { size: 4, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#E4E7EC",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: sorted.map((row) => String(row.year)),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "12px", colors: "#6B7280" } },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (value: number) => numberFormat.format(Math.round(value)),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) =>
          `${numberFormat.format(value)} ${t("municipality.population.inhabitants")}`,
      },
    },
    legend: { show: false },
    noData: {
      text:
        status === "loading"
          ? t("municipality.population.loading")
          : t("municipality.population.noData"),
    },
  };

  const series = [
    {
      name: t("municipality.population.seriesName"),
      data: sorted.map((row) => row.population),
    },
  ];

  const changeColor = (value: number) =>
    value > 0
      ? "text-success-600 dark:text-success-500"
      : value < 0
        ? "text-error-600 dark:text-error-500"
        : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("municipality.population.title")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {first && latest
            ? t("municipality.population.subtitle", {
                municipality,
                from: first.year,
                to: latest.year,
              })
            : municipality}
        </p>
      </div>

      {latest && first && (
        <dl className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">
              {t("municipality.population.latest", { year: latest.year })}
            </dt>
            <dd className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {numberFormat.format(latest.population)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">
              {t("municipality.population.changeSince", { year: first.year })}
            </dt>
            <dd className={cn("text-2xl font-semibold", changeColor(totalChange))}>
              {percentFormat.format(totalChange * 100)} %
            </dd>
            <dd className="text-theme-xs text-gray-500 dark:text-gray-400">
              {latest.population - first.population > 0 ? "+" : ""}
              {numberFormat.format(latest.population - first.population)}{" "}
              {t("municipality.population.inhabitants")}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">
              {t("municipality.population.yearlyChange")}
            </dt>
            <dd className={cn("text-2xl font-semibold", changeColor(yearlyChange))}>
              {percentFormat.format(yearlyChange * 100)} %
            </dd>
            <dd className="text-theme-xs text-gray-500 dark:text-gray-400">
              {t("municipality.population.perYear")}
            </dd>
          </div>
        </dl>
      )}

      {status === "error" ? (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("municipality.population.error")}
        </p>
      ) : (
        <Chart options={options} series={series} type="area" height={280} />
      )}

      <p className="mt-3 text-theme-xs text-gray-500 dark:text-gray-400">
        {t("municipality.population.source")}
      </p>
    </div>
  );
}
