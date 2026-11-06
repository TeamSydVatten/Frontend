import type { Location } from "@/types/location";
import { MdElectricBolt } from "react-icons/md";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import fetchAPI from "@/Services/APIClient";
import MetricCard from "./MetricCard";
import { useEffect, useState } from "react";


interface PowerRow {
  location: string;
  timestamp: string;
  usage: number;
}

interface PowerResponse {
  data: PowerRow[];
}

const powerLocations: Record<string, string> = {
  vomb: "Vombverket",
  ringsjon: "Ringsjöverket",
};

export default function ElectricityPerRecievedWater({
  location,
}: {
  location: Location;
}) {
  const [electricity, setElectricity] = useState<number | null>(null);
  const [latestDate, setDate] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [change, setChange] = useState<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const json = (await fetchAPI.getPowerData()) as PowerResponse;

        const powerLocation = powerLocations[location.id];

        const sorted = json.data
          .filter(
            (row) =>
              row.location === powerLocation &&
              row.usage != null &&
              Number.isFinite(Number(row.usage)) &&
              Number.isFinite(Date.parse(row.timestamp)),
          )
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );

        const latest = sorted.at(-1);
        const previous = sorted.at(-2);

        if (cancelled) return;

        setElectricity(latest ? Number(latest.usage) : null);

        setDate(latest?.timestamp ?? null);

        setHistory(sorted.map((row) => Number(row.usage)));

        if (latest && previous && Number(previous.usage) !== 0) {
          const percentage =
            ((Number(latest.usage) - Number(previous.usage)) /
              Math.abs(Number(previous.usage))) *
            100;

          setChange(percentage);
        } else {
          setChange(undefined);
        }
      } catch (err) {
        console.log("Power API error", err);
        if (!cancelled) {
          setElectricity(null);
          setDate(null);
          setHistory([]);
          setChange(undefined);
        }
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [location.id]);

  return (
    <MetricCard
      title="Elförbrukning"
      value={electricity}
      unit="kWh"
      date={
        latestDate
          ? new Date(latestDate).toLocaleString("sv-SE", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : null
      }
      history={history}
      change={change}
      lowerIsBetter={true}
      icon={<MdElectricBolt className="size-4" />}
    />
  );
}
