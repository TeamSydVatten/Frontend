import { useEffect, useMemo, useState } from "react";
import fetchAPI from "@/Services/APIClient";
import LakeChart, {
  type ChartPoint,
  type DateRangeValue,
  type HistoryRow,
  type LakeSeries,
} from "@/components/sydvatten/LakeChart";
import CompareBarChart from "@/components/sydvatten/CompareBarChart";
import { LAKE_COLORS, PRECIPITATION_COLOR } from "@/utils/chart";

const DAY = 24 * 3600 * 1000;
const LAKE_COLOR = LAKE_COLORS.vomb;
// Valt år i sjöns färg, tidigare år i grått (gray-400, syns i både ljust och mörkt läge)
const YEAR_COLORS = [LAKE_COLOR, "#98a2b3", "#98a2b3", "#98a2b3", "#98a2b3"];

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
  waterColor = LAKE_COLOR
): LakeSeries[] => [
  { name: "Vattennivå", type: "area", color: waterColor, data: inRange(level, from, to) },
  { name: "Nederbörd", type: "bar", color: PRECIPITATION_COLOR, axis: "right", data: inRange(precip, from, to) },
];

/* ---------- komponenten ---------- */

const Vomb = () => {
  const [level, setLevel] = useState<ChartPoint[]>([]);
  const [precip, setPrecip] = useState<ChartPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  
   // Standarddatum, sista datapost
  const [range, setRange] = useState<DateRangeValue>({
    from: new Date(2026, 8, 1),   
    to: new Date(2026, 8, 26),
  });

  // Vattennivå: medel per dag
  useEffect(() => {
    fetchAPI
      .getLakeLevel("Vomb")
      .then((res) =>
        setLevel(perDay(res.data.map((r) => ({ t: r.date, v: r.water_level })), "avg"))
      )
      .catch((e) => setError(e.message));
  }, []);

  // Nederbörd: summa per dag
  useEffect(() => {
    fetchAPI
      .getLakePrecipitation("Vomb")
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
      subtitle="Vomb"
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

export default Vomb;