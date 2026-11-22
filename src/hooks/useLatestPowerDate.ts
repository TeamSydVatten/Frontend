import { useEffect, useState } from "react";
import fetchAPI from "@/Services/APIClient";

const DAY_MS = 86_400_000;
const STEP_DAYS = 30;
const MAX_STEPS = 24; // söker upp till ca två år bakåt

/** "YYYY-MM-DD" i lokal tid (toISOString skulle ge UTC och kan byta dag) */
export function isoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

let cache: Promise<Date | null> | null = null;

/**
 * Backend har ingen endpoint för "senaste mätning" för el, och datan slutar
 * inte alltid idag. Vi letar bakåt i 30-dagarsfönster med /power/period
 * tills vi hittar data, och tar senaste tidpunkten.
 */
async function findLatestPowerDate(): Promise<Date | null> {
  let to = new Date();
  for (let step = 0; step < MAX_STEPS; step++) {
    const from = new Date(to.getTime() - (STEP_DAYS - 1) * DAY_MS);
    const res = await fetchAPI.getPowerPeriod(isoDate(from), isoDate(to));
    if (res.data.length > 0) {
      const latest = res.data.reduce(
        (max, row) => Math.max(max, Date.parse(row.timestamp)),
        -Infinity,
      );
      const day = new Date(latest);
      return new Date(day.getFullYear(), day.getMonth(), day.getDate());
    }
    to = new Date(from.getTime() - DAY_MS);
  }
  return null;
}

/** Sista dagen som har eldata (null medan den hämtas eller om ingen finns). */
export function useLatestPowerDate() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    cache ??= findLatestPowerDate().catch((err) => {
      cache = null;
      throw err;
    });
    cache
      .then((d) => !cancelled && setDate(d))
      .catch((err) => console.error("Kunde inte hitta senaste eldata:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  return date;
}
