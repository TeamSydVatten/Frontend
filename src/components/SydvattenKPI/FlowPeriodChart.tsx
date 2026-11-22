import { useEffect, useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import fetchAPI from "@/Services/APIClient";
import type { DailyFlowRow } from "@/types/APItypes";
import { isoDate } from "@/hooks/useLatestPowerDate";
import DateRangePicker, { type DateRangeValue } from "./DateRangePicker";

interface FlowPeriodChartProps {
  /** Kommunens namn som i databasen, t.ex. "Malmö" */
  municipality: string;
}

const DAY_MS = 86_400_000;
// Lite mer än 5 år, eftersom datan inte alltid slutar idag
const HISTORY_YEARS = 6;
const DEFAULT_DAYS = 30;

const numberFormat = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 });
const volumeFormat = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });

/** Lokal dag (00:00) för backendens "date" */
function toDay(value: string) {
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Dagligt nettoflöde (PLUS − MINUS) för en kommun, med datumväljare.
 * Hämtar dygnsmedel för fem år i ett anrop och filtrerar sedan lokalt.
 */
export default function FlowPeriodChart({ municipality }: FlowPeriodChartProps) {
  const { t } = useTranslation();
  const [result, setResult] = useState<{
    municipality: string;
    rows: DailyFlowRow[];
    failed: boolean;
  } | null>(null);
  const [pickedRange, setPickedRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const from = new Date(today.getFullYear() - HISTORY_YEARS, today.getMonth(), today.getDate());

    fetchAPI
      .getMunicipalityDailyFlow(municipality, isoDate(from), isoDate(today))
      .then((res) => {
        if (!cancelled) setResult({ municipality, rows: res.data ?? [], failed: false });
      })
      .catch((err) => {
        console.error("Flow API error:", err);
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

  const days = useMemo(
    () =>
      (current?.rows ?? [])
        .filter((row) => Number.isFinite(Number(row.avg_sum)))
        .map((row) => ({ day: toDay(row.date), value: Number(row.avg_sum) }))
        .sort((a, b) => a.day.getTime() - b.day.getTime()),
    [current],
  );

  const minDate = days[0]?.day;
  const maxDate = days[days.length - 1]?.day;

  // Standard: senaste 30 dagarna med data
  const range: DateRangeValue | null =
    pickedRange ??
    (maxDate
      ? {
          from: new Date(maxDate.getTime() - (DEFAULT_DAYS - 1) * DAY_MS),
          to: maxDate,
        }
      : null);

  const visible = range
    ? days.filter((d) => d.day >= range.from && d.day <= range.to)
    : [];

  const average = visible.length
    ? visible.reduce((sum, d) => sum + d.value, 0) / visible.length
    : null;
  // L/s i dygnsmedel → m³ per dygn: × 86 400 s / 1 000
  const totalVolume = visible.reduce((sum, d) => sum + (d.value * 86_400) / 1_000, 0);

  const isLong = visible.length > 60;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: !isLong },
    },
    stroke: { curve: "smooth", width: isLong ? 1.5 : 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.45, opacityTo: 0 } },
    markers: { size: 0, hover: { size: 5 } },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#E4E7EC",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        datetimeUTC: false,
        format: visible.length > 120 ? "MMM yyyy" : "dd MMM",
        style: { fontSize: "12px", colors: "#6B7280" },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (value: number) => numberFormat.format(value),
      },
    },
    tooltip: {
      x: { format: "d MMM yyyy" },
      y: { formatter: (value: number) => `${numberFormat.format(value)} L/s` },
    },
    legend: { show: false },
    noData: {
      text: status === "loading" ? t("municipality.flow.loading") : t("municipality.flow.noData"),
    },
  };

  const series = [
    {
      name: t("municipality.flow.seriesName"),
      data: visible.map((d) => ({ x: d.day.getTime(), y: Number(d.value.toFixed(2)) })),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("municipality.flow.title")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("municipality.flow.subtitle", { municipality })}
          </p>
        </div>

        {range && (
          <DateRangePicker
            value={range}
            onChange={setPickedRange}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>

      {average !== null && (
        <dl className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">
              {t("municipality.flow.average")}
            </dt>
            <dd className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {numberFormat.format(average)} L/s
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">
              {t("municipality.flow.volume")}
            </dt>
            <dd className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {volumeFormat.format(totalVolume)} m³
            </dd>
          </div>
        </dl>
      )}

      {status === "error" ? (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("municipality.flow.error")}
        </p>
      ) : (
        <Chart options={options} series={series} type="area" height={300} />
      )}

      <p className="mt-3 text-theme-xs text-gray-500 dark:text-gray-400">
        {t("municipality.flow.source")}
      </p>
    </div>
  );
}
