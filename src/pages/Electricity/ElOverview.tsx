import { useEffect, useMemo, useState } from "react";
import { MdElectricBolt } from "react-icons/md";
import ElectricityConsum from "@/components/SydvattenKPI/ElectricityConsum";
import { electricityDataById } from "@/data/electricityData";
import fetchAPI from "@/Services/APIClient";
import ElectricityLineChart from "@/components/SydvattenKPI/ElectricityLineChart";
import {
  MdTrendingDown,
  MdTrendingUp,
  MdRemove,
  MdInfoOutline,
} from "react-icons/md";

interface PowerRow {
  location: string;
  timestamp: string;
  usage: number;
}

interface PowerResponse {
  data: PowerRow[];
}

interface DailyPoint {
  date: string;
  usage: number | null;
}
type TrendStatus = "decrease" | "increase" | "stable" | "missing";

interface EnergyInsight {
  id: string;
  name: string;
  change: number | null;
  status: TrendStatus;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const powerLocations: Record<string, string> = {
  vombverket: "Vombverket",
  ringsjoverket: "Ringsjöverket",
  teckomatorptPump: "Teckomatorp pumpstation",
};

const facilities = Object.values(electricityDataById);

function getPowerLocation(id: string, name: string) {
  return powerLocations[id] ?? name;
}

function sumUsage(rows: PowerRow[]) {
  return rows.reduce((sum, row) => sum + row.usage, 0);
}

function formatUsage(value: number) {
  return value.toLocaleString("sv-SE", {
    maximumFractionDigits: 1,
  });
}

function dataKey(timestamp: string | number) {
  return new Date(timestamp).toLocaleDateString("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Bygge med en serie där saknade dagar är inkluderade
function buildDailySeries(
  rows: PowerRow[],
  latestTime: number,
  days: number,
): DailyPoint[] {
  const grouped = new Map<string, number>();

  for (const row of rows) {
    const day = dataKey(row.timestamp);

    grouped.set(day, (grouped.get(day) ?? 0) + row.usage);
  }

  const lastDay = Date.parse(`${dataKey(latestTime)}T12:00:00Z`);

  return Array.from({ length: days }, (_, index) => {
    const time = lastDay - (days - 1 - index) * DAY_MS;
    const date = new Date(time).toISOString().slice(0, 10);

    return {
      date,
      usage: grouped.get(date) ?? null,
    };
  });
}

export default function ElOverview() {
  const [powerData, setPowerData] = useState<PowerRow[]>([]);
  const [period, setPeriod] = useState<7 | 30>(7);
  const [selectedFacility, setSelectedFacility] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const response = (await fetchAPI.getPowerData()) as PowerResponse;

        if (!Array.isArray(response.data)) {
          throw new Error("Ogiltigt API Svar");
        }

        const valid = response.data
          .filter(
            (row) =>
              row.location &&
              row.usage != null &&
              Number.isFinite(Number(row.usage)) &&
              Number.isFinite(Date.parse(row.timestamp)),
          )
          .map((row) => ({
            ...row,
            usage: Number(row.usage),
          }));

        if (!cancelled) {
          setPowerData(valid);
          setError(null);
        }
      } catch (err) {
        console.error("Power API error", err);

        if (!cancelled) {
          setPowerData([]);
          setError("Kunde inte hämta energidata");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  //Här kommer filtrering av alla registrerade anläggningar

  const recognizedData = useMemo(() => {
    const names = new Set(
      facilities.map((facility) =>
        getPowerLocation(facility.id, facility.name),
      ),
    );
    return powerData.filter((row) => names.has(row.location));
  }, [powerData]);

  //Hitta senaste mätningar

  const latestTime = useMemo(() => {
    return recognizedData.reduce(
      (latest, row) => Math.max(latest, Date.parse(row.timestamp)),
      -Infinity,
    );
  }, [recognizedData]);
  const hasData = Number.isFinite(latestTime);

  const { currentRows, previousRows } = useMemo(() => {
    if (!hasData) {
      return {
        currentRows: [] as PowerRow[],
        previousRows: [] as PowerRow[],
      };
    }

    const allDays = buildDailySeries([], latestTime, period * 2);

    const currentDays = new Set(
      allDays.slice(-period).map((point) => point.date),
    );

    const previousDays = new Set(
      allDays.slice(0, period).map((point) => point.date),
    );

    return {
      currentRows: recognizedData.filter((row) =>
        currentDays.has(dataKey(row.timestamp)),
      ),
      previousRows: recognizedData.filter((row) =>
        previousDays.has(dataKey(row.timestamp)),
      ),
    };
  }, [recognizedData, latestTime, period, hasData]);

  const totalUsage = sumUsage(currentRows);
  const previousUsage = sumUsage(previousRows);

  const namesWithData = new Set(
    [...currentRows, ...previousRows].map((row) => row.location),
  );

  const comparable =
    namesWithData.size > 0 &&
    [...namesWithData].every((name) => {
      const current = currentRows.filter((row) => row.location === name);

      const previous = previousRows.filter((row) => row.location === name);

      return (
        current.length > 0 &&
        current.length === previous.length &&
        new Set(current.map((row) => dataKey(row.timestamp))).size === period &&
        new Set(previous.map((row) => dataKey(row.timestamp))).size === period
      );
    });

  const totalChange =
    comparable && previousUsage > 0
      ? ((totalUsage - previousUsage) / previousUsage) * 100
      : null;

  const comparison = facilities
    .map((facility) => {
      const name = getPowerLocation(facility.id, facility.name);

      const rows = currentRows.filter((row) => row.location === name);

      return {
        facility,
        usage: sumUsage(rows),
        count: rows.length,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.usage - a.usage);

  const maxUsage = Math.max(...comparison.map((item) => item.usage), 1);
  const chartRows = currentRows.filter((row) => {
    if (selectedFacility === "all") return true;

    const facility = facilities.find((item) => item.id === selectedFacility);

    return facility
      ? row.location === getPowerLocation(facility.id, facility.name)
      : false;
  });

  // Data förberedlser till Taladmin Line Chart
  const chartData = hasData
    ? buildDailySeries(chartRows, latestTime, period)
    : [];

  const insights: EnergyInsight[] = facilities.map((facility) => {
    const name = getPowerLocation(facility.id, facility.name);

    const current = currentRows.filter((row) => row.location === name);

    const previous = previousRows.filter((row) => row.location === name);

    // Kontrollera om perioderna går att jämföra
    const comparable =
      current.length > 0 &&
      current.length === previous.length &&
      new Set(current.map((row) => dataKey(row.timestamp))).size === period &&
      new Set(previous.map((row) => dataKey(row.timestamp))).size === period;

    const oldTotal = sumUsage(previous);

    if (!comparable || oldTotal <= 0) {
      return {
        id: facility.id,
        name: facility.name,
        change: null,
        status: "missing",
      };
    }

    const change = ((sumUsage(current) - oldTotal) / oldTotal) * 100;

    let status: TrendStatus = "stable";

    if (change <= -5) {
      status = "decrease";
    } else if (change >= 5) {
      status = "increase";
    }

    return {
      id: facility.id,
      name: facility.name,
      change,
      status,
    };
  });

  // Sammanfatta resultatet
  const decreasingCount = insights.filter(
    (item) => item.status === "decrease",
  ).length;

  const increasingCount = insights.filter(
    (item) => item.status === "increase",
  ).length;

  const stableCount = insights.filter(
    (item) => item.status === "stable",
  ).length;

  const missingCount = insights.filter(
    (item) => item.status === "missing",
  ).length;

  const comparableInsights = insights.filter(
    (item) => item.status !== "missing",
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Energiöversikt
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Följ och jämför energianvändningen vid Sydvattens vattenverk och
          pumpstationer.
        </p>

        {hasData && (
          <p className="mt-2 text-xs text-gray-400">
            Senaste tillgängliga mätning:{" "}
            {new Date(latestTime).toLocaleString("sv-SE")}
          </p>
        )}
      </header>

      <div className="flex gap-2">
        {([7, 30] as const).map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => setPeriod(days)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              period === days
                ? "bg-amber-500 text-gray-950"
                : "border border-gray-200 bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {days} dagar
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Registrerade anläggningar"
          value={String(facilities.length)}
          description="I energiöversikten"
        />

        <SummaryCard
          title="Registrerad förbrukning"
          value={
            loading
              ? "Laddar..."
              : currentRows.length
                ? `${formatUsage(totalUsage)} kWh`
                : "—"
          }
          description={`Senaste ${period} kalenderdagarna`}
        />

        <SummaryCard
          title="Förändring"
          value={
            totalChange !== null
              ? `${totalChange > 0 ? "+" : ""}${totalChange.toFixed(1)} %`
              : "—"
          }
          description={
            comparable
              ? "Jämfört med föregående period"
              : "Jämförbar historik saknas"
          }
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Förbrukning över tid
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Daglig registrerad energiförbrukning
            </p>
          </div>

          <select
            value={selectedFacility}
            onChange={(event) => setSelectedFacility(event.target.value)}
            aria-label="Välj anläggning"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Alla anläggningar</option>

            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>

        <ElectricityLineChart data={chartData} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Jämför anläggningar
        </h2>

        <p className="mt-1 mb-6 text-sm text-gray-500">
          Registrerad förbrukning under vald period
        </p>

        {comparison.length === 0 ? (
          <p className="text-sm text-gray-400">
            Ingen förbrukningsdata tillgänglig.
          </p>
        ) : (
          <div className="space-y-5">
            {comparison.map(({ facility, usage }) => (
              <div key={facility.id}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="font-medium dark:text-white">
                    {facility.name}
                  </span>

                  <span className="text-gray-500">
                    {formatUsage(usage)} kWh
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${Math.max(0, (usage / maxUsage) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-xs text-gray-400">
          {comparison.length} av {facilities.length} anläggningar har mätningar
          under perioden.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <MdElectricBolt className="size-6 text-amber-500" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insikter från energidata
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Förändring jämfört med föregående {period}-dagarsperiod
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-green-200 p-4 dark:border-green-900">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <MdTrendingDown className="size-5" />
              <span className="text-sm font-medium">Minskningar</span>
            </div>

            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              {decreasingCount}
            </p>
          </div>

          <div className="rounded-xl border border-red-200 p-4 dark:border-red-900">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <MdTrendingUp className="size-5" />
              <span className="text-sm font-medium">Ökningar</span>
            </div>

            <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
              {increasingCount}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MdRemove className="size-5" />
              <span className="text-sm font-medium">Stabila</span>
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
              {stableCount}
            </p>
          </div>
        </div>

        {comparableInsights.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ingen anläggning har tillräcklig jämförbar historik ännu.
          </p>
        ) : (
          <div className="space-y-3">
            {comparableInsights.map((insight) => {
              const isDecrease = insight.status === "decrease";
              const isIncrease = insight.status === "increase";

              const TrendIcon = isDecrease
                ? MdTrendingDown
                : isIncrease
                  ? MdTrendingUp
                  : MdRemove;

              const colorClasses = isDecrease
                ? "text-green-600 dark:text-green-400"
                : isIncrease
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400";

              const label = isDecrease
                ? "Minskad förbrukning"
                : isIncrease
                  ? "Ökad förbrukning"
                  : "Relativt stabil förbrukning";

              return (
                <div
                  key={insight.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`shrink-0 ${colorClasses}`}>
                      <TrendIcon className="size-6" />
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {insight.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {label}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-lg font-semibold tabular-nums ${colorClasses}`}
                  >
                    {insight.change !== null
                      ? `${insight.change > 0 ? "+" : ""}${insight.change.toLocaleString(
                          "sv-SE",
                          {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          },
                        )} %`
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {missingCount > 0 && (
          <div className="mt-5 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MdInfoOutline className="mt-0.5 size-5 shrink-0" />

            <p>
              {missingCount} av {facilities.length} anläggningar saknar
              tillräcklig jämförbar historik för vald period.
            </p>
          </div>
        )}

        <p className="mt-5 text-xs text-gray-400">
          Förändringar klassificeras som ökningar eller minskningar vid minst 5
          %. Mindre förändringar visas som relativt stabila.
        </p>
      </section>

      <section>{/*
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Anläggningar och pumpstationer
        </h2>

        <p className="mt-2 mb-5 text-sm text-gray-500 dark:text-gray-400">
          Utforska energianvändningen vid respektive anläggning.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {facilities.map((facility) => (
            <ElectricityConsum key={facility.id} electricityData={facility} />
          ))}
        </div> */}
      </section>
    </div>
  );
}

//lunchpaus jobbat 2 timmar
function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

        <MdElectricBolt className="size-5 text-gray-400" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-2 text-xs text-gray-400">{description}</p>
    </div>
  );
}
