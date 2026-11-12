import { IoWater } from "react-icons/io5";
import type { Location } from "@/types/location";
import flowAPI from "@/Services/APIClient";
import { meterWeight } from "@/config/meters";
import { useState, useEffect } from "react";
import MetricCard from "./MetricCard";

interface FlowRow {
  meter_id: string;
  timestamp: string;
  water_flow: number;
}

export default function LatestFlowCard({ location }: { location: Location }) {
  const [flow, setFlow] = useState<number | null>(null);
  const [latestDate, setDate] = useState<Date | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [change, setChange] = useState<number | undefined>(undefined);
  useEffect(() => {
    const load = async () => {
      try {
        const json = (await flowAPI.getData()) as { data: FlowRow[] };

        const rows = json.data.filter(
          (row) =>
            meterWeight(row.meter_id, location.meterId, row.timestamp) !== 0,
        );

        // Summera vattenflödet per tidpunkt
        const grouped = new Map<number, number>();

        rows.forEach((row) => {
          const timestamp = new Date(row.timestamp).getTime();
          const weight = meterWeight(
            row.meter_id,
            location.meterId,
            row.timestamp,
          );
          const value = Number(row.water_flow);

          if (
            !Number.isFinite(timestamp) ||
            !Number.isFinite(value) ||
            !Number.isFinite(weight) ||
            row.water_flow == null
          )
            return;

          grouped.set(
            timestamp,
            (grouped.get(timestamp) ?? 0) + weight * value,
          );
        });

        // Sortera från äldsta till senaste
        const sorted = [...grouped.entries()].sort((a, b) => a[0] - b[0]);

        if (sorted.length === 0) {
          setFlow(null);
          setDate(null);
          setHistory([]);
          setChange(undefined);
          return;
        }

        const latest = sorted.at(-1)!;
        const previous = sorted.at(-2);

        setFlow(latest[1]);
        setDate(new Date(latest[0]));

        setHistory(sorted.map((row) => row[1]));

        if (previous && previous[1] !== 0) {
          const percentage =
            ((latest[1] - previous[1]) / Math.abs(previous[1])) * 100;

          setChange(percentage);
        } else {
          setChange(undefined);
        }
      } catch (err) {
        console.error(err);
        setFlow(null);
        setDate(null);
        setHistory([]);
        setChange(undefined);
      }
    };

    load();
  }, [location.meterId]);
  return (
    <MetricCard
      title="Vattenflöde"
      value={flow}
      unit="liter/sekund"
      date={
        latestDate
          ? latestDate.toLocaleString("sv-SE", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : null
      }
      history={history}
      change={change}
      icon={<IoWater className="size-6" />}
    />
  );
}
