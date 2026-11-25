import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import DateRangePicker, { type DateRangeValue } from "@/components/sydvatten/DateRangePicker"; // justera sökvägen

/* ---------- typer ---------- */

export interface ChartPoint {
  x: number; // tid i millisekunder
  y: number;
}

export interface LakeSeries {
  name: string;
  type: "line" | "area" | "bar";
  data: ChartPoint[];
  color?: string;
  axis?: "left" | "right"; // standard: left
}

export interface HistoryRow {
  label: string;        // t.ex. "2025"
  color: string;        // årets färg
  series: LakeSeries[]; // samma serier som huvuddiagrammet, för det året
}

// Perioden är Date-objekt
export type { DateRangeValue };

interface LakeChartProps {
  title?: string;                       // standard "Vattennivåer"
  subtitle?: string;                    // t.ex. "Bolmen"
  series: LakeSeries[];                 // huvuddiagrammet
  history?: HistoryRow[];               // historikraderna (tom/utelämnad = ingen historik)
  range: DateRangeValue;                // vald period (Date-objekt)
  onRangeChange: (r: DateRangeValue) => void;
  minDate?: Date;                       // första dagen som har data
  maxDate?: Date;                       // sista dagen som har data
  leftLabel?: string;
  rightLabel?: string;
  leftMin?: number;
  rightMin?: number;
  loading?: boolean;
  error?: string | null;
}

/* ---------- ikoner ---------- */

const WavesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
);
const HistoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);

/* ---------- reglage ---------- */

function Switch({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
      <span className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </span>
      {label}
    </button>
  );
}

/* ---------- själva diagrammet (internt) ---------- */

type YAxis = Extract<NonNullable<ApexOptions["yaxis"]>, unknown[]>[number];
const DEFAULT_COLORS = ["#2563EB", "#93C5FD", "#F97316", "#10B981", "#8B5CF6"];

function ChartCore({
  series, compact = false, leftLabel, rightLabel, leftMin, rightMin,
}: {
  series: LakeSeries[]; compact?: boolean;
  leftLabel?: string; rightLabel?: string; leftMin?: number; rightMin?: number;
}) {
  const apexSeries = useMemo(
    () => series.map((s) => ({
      name: s.name,
      type: s.type === "bar" ? "column" : s.type, // Apex kallar staplar "column"
      data: s.data,
    })),
    [series]
  );

  const options: ApexOptions = useMemo(() => {
    const axisOf = (s: LakeSeries) => s.axis ?? "left";
    const firstLeft = series.find((s) => axisOf(s) === "left")?.name;
    const firstRight = series.find((s) => axisOf(s) === "right")?.name;

    // Första serien på varje axel äger axeln, övriga delar den
    const yaxis: YAxis[] = series.map((s) => {
      const isRight = axisOf(s) === "right";
      const owner = isRight ? firstRight : firstLeft;
      const isOwner = owner === s.name;
      const min = isRight ? rightMin : leftMin;
      const titleText = isRight ? rightLabel : leftLabel;

      // Lägg bara med nycklar som har ett värde: Apex kan krascha på `undefined`
      const axis: YAxis = {
        opposite: isRight,
        show: isOwner,
        labels: {
          // Apex kan anropa formatteraren med något som inte är ett tal
          formatter: (v: number) =>
            typeof v === "number" && Number.isFinite(v) ? v.toFixed(isRight ? 0 : 1) : "",
          style: { colors: ["#6B7280"] },
        },
      };
      if (owner) axis.seriesName = owner;
      if (min !== undefined) axis.min = min;
      if (!compact && isOwner && titleText) axis.title = { text: titleText };
      return axis;
    });

    return {
      colors: series.map((s, i) => s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]),
      chart: {
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: !compact },
      },
      legend: { show: !compact, position: "top", horizontalAlign: "left" },
      stroke: { curve: "smooth", width: series.map((s) => (s.type === "bar" ? 0 : 2)) },
      fill: {
        type: series.map((s) => (s.type === "area" ? "gradient" : "solid")),
        opacity: series.map((s) => (s.type === "bar" ? 0.45 : 1)),
        gradient: { opacityFrom: 0.18, opacityTo: 0 },
      },
      plotOptions: { bar: { columnWidth: "55%", borderRadius: 2 } },
      markers: { size: 0, hover: { size: compact ? 0 : 5 } },
      dataLabels: { enabled: false },
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        ...(compact ? { padding: { top: 0, bottom: 0 } } : {}),
      },
      xaxis: {
        type: "datetime",
        labels: { format: "d MMM", datetimeUTC: false, style: { colors: "#6B7280" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis,
      tooltip: { shared: true, x: { format: "d MMM yyyy" } },
      noData: { text: "Ingen data för perioden" },
    };
  }, [series, compact, leftLabel, rightLabel, leftMin, rightMin]);

  return <Chart options={options} series={apexSeries} type="line" height={compact ? 130 : 320} />;
}

/* ---------- huvudkomponenten ---------- */

export default function LakeChart({
  title = "Översikt", subtitle, series, history = [],
  range, onRangeChange, minDate, maxDate, leftLabel, rightLabel, leftMin, rightMin, loading, error,
}: LakeChartProps) {
  const [showHistory, setShowHistory] = useState(true);

  const card = "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]";

  return (
    <div className="space-y-5">
      {/* ===== Huvudkort ===== */}
      <section className={`${card} p-5 sm:p-6`}>
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/15">
              <WavesIcon />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white/90">{title}</h3>
              {subtitle && <p className="text-base text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <DateRangePicker value={range} onChange={onRangeChange}
                             minDate={minDate} maxDate={maxDate} />
            {history.length > 0 && (
              <Switch checked={showHistory} onChange={setShowHistory} label="Visa historik" />
            )}
          </div>
        </header>

        {error && <p className="mb-3 text-sm text-red-600">Kunde inte hämta data: {error}</p>}

        <div className={`rounded-xl border border-gray-200 p-3 transition-opacity dark:border-gray-800 ${loading ? "opacity-60" : ""}`}>
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-160 2xl:min-w-full">
              <ChartCore series={series} leftLabel={leftLabel} rightLabel={rightLabel}
                         leftMin={leftMin} rightMin={rightMin} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Historik ===== */}
      {showHistory && history.length > 0 && (
        <section className={`${card} p-5 sm:p-6`}>
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white/90">
              <HistoryIcon /> Historik - vald period – Senaste {history.length} åren
            </h3>
            <ul className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
              {history.map((h) => (
                <li key={h.label} className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: h.color }} />
                  {h.label}
                </li>
              ))}
            </ul>
          </header>

          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.label} className="rounded-xl border border-gray-200 px-3 pb-1 pt-2 dark:border-gray-800">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white/90">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: h.color }} />
                  {h.label}
                </div>
                <ChartCore series={h.series} compact leftMin={leftMin} rightMin={rightMin} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}