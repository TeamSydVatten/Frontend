import { IoWater } from "react-icons/io5";
import type { Location } from "@/types/location";
import type { DailyFlowRow } from "@/types/APItypes";
import flowAPI from "@/Services/APIClient";
import { useState, useEffect } from "react";
import MetricCard from "./MetricCard";

// Platsens meterId -> kommun i backend (flow_meters.municipality)
const FLOW_MUNICIPALITY: Record<string, string> = {
  lund: "Lund",
  eslov: "Eslöv",
};

// Hur långt bak vi hämtar dygnsvärden (datan slutar inte alltid idag)
const LOOKBACK_DAYS = 365;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function LatestFlowCard({ location }: { location: Location }) {
  const [flow, setFlow] = useState<number | null>(null);
  const [latestDate, setDate] = useState<Date | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [change, setChange] = useState<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const reset = () => {
      setFlow(null);
      setDate(null);
      setHistory([]);
      setChange(undefined);
    };

    const load = async () => {
      const municipality = FLOW_MUNICIPALITY[location.meterId];
      if (!municipality) {
        reset();
        return;
      }

      try {
        const today = new Date();
        const from = new Date(today.getTime() - LOOKBACK_DAYS * 86_400_000);

        // Dagligt medelflöde, netto (PLUS − MINUS) räknat i backend
        const json = await flowAPI.getMunicipalityDailyFlow(
          municipality,
          isoDate(from),
          isoDate(today),
        );

        const sorted = (json.data ?? [])
          .filter((row: DailyFlowRow) => Number.isFinite(Number(row.avg_sum)))
          .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

        if (cancelled) return;
        if (sorted.length === 0) {
          reset();
          return;
        }

        const latest = sorted.at(-1)!;
        const previous = sorted.at(-2);
        const latestValue = Number(latest.avg_sum);

        setFlow(latestValue);
        setDate(new Date(latest.date));
        setHistory(sorted.map((row) => Number(row.avg_sum)));

        const previousValue = previous ? Number(previous.avg_sum) : 0;
        setChange(
          previous && previousValue !== 0
            ? ((latestValue - previousValue) / Math.abs(previousValue)) * 100
            : undefined,
        );
      } catch (err) {
        console.error("Vattenflöde API-fel:", err);
        if (!cancelled) reset();
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [location.meterId]);

  return (
    <MetricCard
      title="Vattenflöde"
      value={flow}
      unit="liter/sekund (dygnsmedel)"
      date={
        latestDate
          ? latestDate.toLocaleDateString("sv-SE", { dateStyle: "short" })
          : null
      }
      history={history}
      change={change}
      icon={<IoWater className="size-6" />}
    />
  );
}
