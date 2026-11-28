import { useEffect, useMemo, useState } from "react";
import { IoNotifications, IoTrophy, IoWarning } from "react-icons/io5";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HorizontalSlideIcon } from "@/icons";
import fetchAPI from "@/Services/APIClient";
import { municipalities } from "@/data/municipalities";

type Props = {
  title?: string;
};

type Row = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  population: number;
  totalFlow: number; // m³ under perioden
  days: number; // antal dagar perioden omfattar
};

const CURRENT_YEAR = new Date().getFullYear();
// De fem senaste åren, senaste först
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

const AVATAR_CLASSES = [
  "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
  "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
  "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
  "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Antal dagar mellan två datum, inklusive båda ändar (UTC, så sommartid inte påverkar)
function daysBetween(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / MS_PER_DAY) + 1;
}

// Pågående år klipps vid i dag
function daysInYear(year: number): number {
  const from = `${year}-01-01`;
  const fullYearEnd = `${year}-12-31`;
  const today = new Date().toISOString().slice(0, 10);
  return daysBetween(from, today < fullYearEnd ? today : fullYearEnd);
}

// Liter per person och dygn
const litersPerCapitaPerDay = (
  totalFlow: number,
  population: number,
  days: number,
) => Math.round((totalFlow * 1000) / days / population);

const getStatus = (lpcd: number) => {
  if (lpcd < 140)
    return {
      label: "Låg",
      className:
        "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500",
    };
  if (lpcd < 180)
    return {
      label: "Medel",
      className:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500",
    };
  return {
    label: "Hög",
    className: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500",
  };
};

const medalColors: Record<number, string> = {
  1: "text-yellow-500", // guld
  2: "text-gray-400", // silver
  3: "text-orange-700", // brons
};

function PositionBadge({ position }: { position: number }) {
  const color = medalColors[position];
  if (color) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IoTrophy className={`size-5 ${color}`} />
        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
          {position}
        </span>
      </span>
    );
  }
  return (
    <span className="pl-[26px] text-sm text-gray-500 dark:text-gray-400">
      {position}
    </span>
  );
}

const headerClass =
  "py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400";
const cellClass = "py-3 text-sm text-gray-500 dark:text-gray-400";

// Hämtar allt på en gång: rader per år, { 2025: Row[], 2024: Row[], ... }
async function loadAll(): Promise<Record<number, Row[]>> {
  const [populationRes, flowRes] = await Promise.all([
    fetchAPI.getPopulationLatest(),
    fetchAPI.getNetFlowYearly(YEARS[YEARS.length - 1], YEARS[0]),
  ]);

  const popByName = new Map<string, number>(
    populationRes.data.map(
      (r) => [r.municipality.trim().toUpperCase(), r.population] as [string, number],
    ),
  );

  const result: Record<number, Row[]> = {};
  for (const y of YEARS) result[y] = [];

  municipalities.forEach((m, i) => {
    const key = m.name.toUpperCase(); // backend lagrar versaler
    const population = popByName.get(key);
    if (!population) return;

    for (const r of flowRes.data) {
      if (r.municipality.toUpperCase() !== key) continue;
      // hoppa över kommuner/år utan mätdata, annars hamnar de på plats 1
      if (!r.total_sum || r.total_sum <= 0) continue;

      result[r.year]?.push({
        id: m.id,
        name: m.name,
        initials: m.name.slice(0, 2).toUpperCase(),
        avatarClassName: AVATAR_CLASSES[i % AVATAR_CLASSES.length],
        population,
        totalFlow: r.total_sum,
        days: daysInYear(r.year),
      });
    }
  });

  return result;
}

// Delar anropet mellan alla som frågar (t.ex. StrictModes dubbla effekt i dev)
let loadAllPromise: Promise<Record<number, Row[]>> | null = null;
function loadAllOnce() {
  if (!loadAllPromise) {
    loadAllPromise = loadAll().catch((err) => {
      loadAllPromise = null; // tillåt nytt försök efter fel
      throw err;
    });
  }
  return loadAllPromise;
}

export default function MunicipalityWaterUsageTable({
  title = "Vattenanvändning per capita",
}: Props) {
  const [year, setYear] = useState(CURRENT_YEAR - 1); // senaste hela året
  const [byYear, setByYear] = useState<Record<number, Row[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // true = lägst först (bäst placering överst)
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadAllOnce()
      .then((d) => {
        if (!cancelled) setByYear(d);
      })
      .catch(() => {
        if (!cancelled) setError("Kunde inte hämta data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // en gång: årsbyte gör inga anrop

  const data = byYear[year] ?? [];

  const rows = useMemo(() => {
    // Placeringen räknas alltid på lägst förbrukning = plats 1,
    // oavsett hur tabellen är sorterad just nu
    const ranked = data
      .map((m) => ({
        ...m,
        lpcd: litersPerCapitaPerDay(m.totalFlow, m.population, m.days),
      }))
      .sort((a, b) => a.lpcd - b.lpcd)
      .map((m, index) => ({ ...m, position: index + 1 }));

    return ascending ? ranked : [...ranked].reverse();
  }, [data, ascending]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Liter per person och dygn, {year}  {year === CURRENT_YEAR && " (pågående år, hittills)"}<br/><br/>
            <div className="flex flex-wrap items-center gap-2"><IoWarning/> Datan inkluderar industriförbrukning, dessutom har vissa kommuner (exempelvis Ängelholm) egen produktion av vatten.
           </div>
            
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {YEARS.map((y) => (
            <Button
              key={y}
              size="sm"
              variant={y === year ? "primary" : "outline"}
              onClick={() => setYear(y)}
            >
              {y}
              {y === CURRENT_YEAR ? "*" : ""}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setAscending((prev) => !prev)}
          >
            <HorizontalSlideIcon />
            {ascending ? "Lägst först" : "Högst först"}
          </Button>
        </div>
      </div>

      {loading && <div className="py-6 text-sm text-gray-500">Laddar...</div>}
      {error && <div className="py-6 text-sm text-red-500">{error}</div>}

      {!loading && !error && rows.length === 0 && (
        <div className="py-6 text-sm text-gray-500">
          Ingen data för {year}.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className={headerClass}>Placering</TableCell>
                <TableCell isHeader className={headerClass}>Kommun</TableCell>
                <TableCell isHeader className={headerClass}>Invånare</TableCell>
                <TableCell isHeader className={headerClass}>Total (m³)</TableCell>
                <TableCell isHeader className={headerClass}>Liter/person/dygn</TableCell>
                <TableCell isHeader className={headerClass}>Nivå</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((row) => {
                const status = getStatus(row.lpcd);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="py-3">
                      <PositionBadge position={row.position} />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-9 items-center justify-center rounded-full text-xs font-medium ${row.avatarClassName}`}
                        >
                          {row.initials}
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {row.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={cellClass}>
                      {row.population.toLocaleString("sv-SE")}
                    </TableCell>
                    <TableCell className={cellClass}>
                      {Math.round(row.totalFlow).toLocaleString("sv-SE")}
                    </TableCell>
                    <TableCell className={cellClass}>{row.lpcd}</TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}