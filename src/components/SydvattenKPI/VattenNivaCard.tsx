import React, { useEffect, useState } from "react";
import { ArrowDownIcon, MdOutlineWater } from "@/icons";
import Badge from "../ui/badge/Badge";
import type { Location } from "@/types/location";
import fetchAPI from "@/Services/APIClient";
import MetricCard from "./MetricCard";

export default function VattenNivaCard({ location }: { location: Location }) {
  const [waterLevel, setWaterLevel] = useState<number | null>(null);
  const [latestDate, setDate] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAPI.getLakeLevel(location.id);

        const sorted = [...response.data]
          .filter(
            (row) =>
              row.water_level != null &&
              Number.isFinite(Number(row.water_level)),
          )
          .sort((a, b) => a.date.localeCompare(b.date));

        const latest = sorted.at(-1);

        setWaterLevel(latest ? Number(latest.water_level) : null);

        setDate(latest?.date ?? null);

        setHistory(sorted.map((row) => Number(row.water_level)));

        console.log("Aktuell sjö:", location.id);
        console.log("Antal mätningar:", sorted.length);
        console.log("Senaste mätning:", latest);
      } catch (err) {
        console.error("Fel vid hämtning:", err);
      }
    };

    load();
  }, [location.id]);

  return (
    <MetricCard
      title="Vattennivå"
      value={waterLevel}
      unit="m ö.h."
      date={latestDate}
      history={history}
      icon={<MdOutlineWater className="size-6" />}
    />
  );
}
