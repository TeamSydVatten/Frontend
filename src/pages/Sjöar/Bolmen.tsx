import { useEffect, useMemo, useState } from "react";
import fetchAPI from "@/Services/APIClient";
import LakeChart, {
  type ChartPoint,
  type DateRangeValue,
  type HistoryRow,
  type LakeSeries,
} from "@/components/sydvatten/LakeChart";
import CompareBarChart from "@/components/sydvatten/CompareBarChart";

const DAY = 24 * 3600 * 1000;
const YEAR_COLORS = ["#2563EB", "#93C5FD", "#8B5CF6", "#10B981", "#F97316"];

/* ---------- hjälpfunktioner (utanför komponenten) ---------- */

// "2026-09-29" och "2026-09-29T00:00:00+02:00" -> samma x (lokal midnatt)
const dayX = (s: string) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// Slår ihop flera värden samma dag till ett: summa eller medel
function perDay(rows: { t: string; v: number }[], how: "sum" | "avg"): ChartPoint[] {
  const days = new Map<number, { sum: number; n: number }>();
  for (const { t, v } of rows) {
    const x = dayX(t);
    const e = days.get(x) ?? { sum: 0, n: 0 };
    e.sum += v;
    e.n += 1;
    days.set(x, e);
  }
  return [...days.entries()]
    .map(([x, e]) => ({ x, y: how === "sum" ? e.sum : e.sum / e.n }))
    .sort((a, b) => a.x - b.x);
}

// Hela dagar, inklusive slutdagen
const inRange = (pts: ChartPoint[], from: Date, to: Date) =>
  pts.filter((p) => p.x >= startOfDay(from) && p.x <= startOfDay(to));

// Samma datum, n år tillbaka
const shiftYears = (d: Date, n: number) =>
  new Date(d.getFullYear() - n, d.getMonth(), d.getDate());

// Bygger serierna för en period. waterColor = årsfärgen i historiken.
const buildSeries = (
  level: ChartPoint[],
  precip: ChartPoint[],
  from: Date,
  to: Date,
  waterColor = "#2563EB"
): LakeSeries[] => [
  { name: "Vattennivå", type: "area", color: waterColor, data: inRange(level, from, to) },
  { name: "Nederbörd", type: "bar", color: "#93C5FD", axis: "right", data: inRange(precip, from, to) },
];

/* ---------- komponenten ---------- */

const Bolmen = () => {
  const [level, setLevel] = useState<ChartPoint[]>([]);
  const [precip, setPrecip] = useState<ChartPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Standard: idag och sex dagar bakåt (7 dagar)
  const [range, setRange] = useState<DateRangeValue>(() => {
    const to = new Date();
    return { from: new Date(to.getTime() - 6 * DAY), to };
  });

  // Vattennivå: medel per dag
  useEffect(() => {
    fetchAPI
      .getLakeLevel("bolmen")
      .then((res) =>
        setLevel(perDay(res.data.map((r) => ({ t: r.date, v: r.water_level })), "avg"))
      )
      .catch((e) => setError(e.message));
  }, []);

  // Nederbörd: summa per dag
  useEffect(() => {
    fetchAPI
      .getLakePrecipitation("bolmen")
      .then((res: any) =>
        setPrecip(perDay(res.data.map((r: any) => ({ t: r.timestamp, v: r.precipitation })), "sum"))
      )
      .catch((e) => setError(e.message));
  }, []);

  // Huvuddiagrammet
  const series = useMemo(
    () => buildSeries(level, precip, range.from, range.to),
    [level, precip, range]
  );

  // Historiken: samma period, ett år bakåt per rad
  const history: HistoryRow[] = useMemo(
    () =>
      YEAR_COLORS.map((color, n) => {
        const from = shiftYears(range.from, n);
        const to = shiftYears(range.to, n);
        return {
          label: String(from.getFullYear()),
          color,
          series: buildSeries(level, precip, from, to, color),
        };
      }),
    [level, precip, range]
  );

  return (<div>
    <LakeChart
      subtitle="Bolmen"
      range={range}
      onRangeChange={setRange}
      error={error}
      leftLabel="Vattennivå (m ö.h.)"
      rightLabel="Nederbörd (mm)"
      series={series}
      history={history}
    />


    <CompareBarChart></CompareBarChart>
  </div>);
};

export default Bolmen;