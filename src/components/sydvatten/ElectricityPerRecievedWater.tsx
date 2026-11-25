import { MdElectricBolt } from "react-icons/md";
import fetchAPI from "@/Services/APIClient";
import MetricCard from "./MetricCard";
import { useEffect, useState } from "react";
import { usePowerData } from "@/hooks/usePowerData";

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
  location: string;
}) {
  const [electricity, setElectricity] = useState<number | null>(null);
  const [latestDate, setDate] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [change, setChange] = useState<number | undefined>(undefined);

  const { rows } = usePowerData();

useEffect(() => {
  const powerLocation = powerLocations[location] ?? location;

  const sorted = rows
    .filter(
      (row) =>
        row.location === powerLocation &&
        row.usage != null &&
        Number.isFinite(Number(row.usage)) &&
        Number.isFinite(Date.parse(row.timestamp)),
    )
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

  const latest = sorted.at(-1);
  const previous = sorted.at(-2);

  setElectricity(latest ? Number(latest.usage) : null);
  setDate(latest?.timestamp ?? null);
  setHistory(sorted.map((r) => Number(r.usage)));

  if (latest && previous && Number(previous.usage) !== 0) {
    setChange(
      ((Number(latest.usage) - Number(previous.usage)) /
        Math.abs(Number(previous.usage))) * 100,
    );
  } else {
    setChange(undefined);
  }
}, [rows, location]);

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
