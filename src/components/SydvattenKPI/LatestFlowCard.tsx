import { IoWater } from "react-icons/io5";
import type { Location } from "@/types/location";
import flowAPI from "@/Services/APIClient";
import { meterWeight } from "@/config/meters";
import { useState, useEffect } from "react";

export default function LatestFlowCard({ location }: { location: Location }) {
  const [flow, setFlow] = useState<number | null>(null);
  const [latestDate, setDate] = useState<Date | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const json = await flowAPI.getData();
          
        const rows = json.data.filter(
          (row) => meterWeight(row.meter_id, location.meterId, row.timestamp) !== 0
        );

        if (rows.length === 0) {
        setFlow(null);
        setDate(null);
        return;
}

        const latestTime = Math.max(
          ...rows.map((r) => new Date(r.timestamp).getTime())
        );

        const total = rows
          .filter((r) => new Date(r.timestamp).getTime() === latestTime)
          .reduce(
            (sum, r) =>
              sum + meterWeight(r.meter_id, location.meterId, r.timestamp) * r.water_flow,
            0
          );

        setFlow(total);
        setDate(new Date(latestTime));
      } catch (err) {
        console.error(err);
      }
    };
    load();
    

  }, [location.meterId]); 
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <IoWater className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {/*{t("orders")}*/}
              Senast uppmätta flöde : {latestDate
              ? latestDate.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })
              : ""}
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              {flow !== null ? flow.toFixed(1) : "Ingen data"} liter / sekund
            </h4>
          </div>
        </div>

    </div>
  );
}