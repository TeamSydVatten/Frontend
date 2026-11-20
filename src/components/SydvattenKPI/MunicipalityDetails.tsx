import type { Municipality } from "@/types/municipality";
import { useMunicipalityStats } from "@/hooks/useMunicipalityStats";
import { CURRENT_YEAR, YEARS } from "@/services/municipalityData";

const nf = new Intl.NumberFormat("sv-SE");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Antal dagar hittills i år (inklusive i dag)
function daysSoFarThisYear() {
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), 0, 1);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - start) / MS_PER_DAY) + 1;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 dark:text-white/90">{value}</span>
    </div>
  );
}

export default function MunicipalityDetails({
  municipality,
}: {
  municipality?: Municipality;
}) {
  const { stats, loading, error } = useMunicipalityStats();

  if (!municipality) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Hovra över en kommun för att se data.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-gray-500">Laddar...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  const s = stats[municipality.id];
const thisYear = s?.flowByYear?.[CURRENT_YEAR];
const lossThisYear = s?.lossByYear?.[CURRENT_YEAR];

  // Per person och dygn, baserat på pågående år hittills
  const litersPerPersonPerDay =
    thisYear && s?.population
      ? (thisYear * 1000) / s.population / daysSoFarThisYear()
      : null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {municipality.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {municipality.description}
      </p>

      <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
        <Row
          label="Befolkning"
          value={s?.population ? nf.format(s.population) : "–"}
        />
        <Row
          label="Totalt mottaget vatten i år"
          value={thisYear ? `${nf.format(Math.round(thisYear))} m³` : "–"}
        />
        <Row
          label="Beräknad vattenförlust hittills i år"
          value={lossThisYear ? `${nf.format(Math.round(lossThisYear))} m³` : "–"}
        />
        <Row
          label="Förbrukning per person"
          value={
            litersPerPersonPerDay
              ? `${Math.round(litersPerPersonPerDay)} l/dag`
              : "–"
          }
        />
      </div>

      <h4 className="mt-6 text-sm font-semibold text-gray-800 dark:text-white/90">
        Mottaget vatten de senaste 5 åren
      </h4>
      <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-800">
        {YEARS.map((year) => {
          const value = s?.flowByYear[year];
          return (
            <Row
              key={year}
              label={year === CURRENT_YEAR ? `${year} (hittills)` : String(year)}
              value={value ? `${nf.format(Math.round(value))} m³` : "–"}
            />
          );
        })}
      </div>
    </div>
  );
}