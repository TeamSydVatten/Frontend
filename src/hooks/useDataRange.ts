import { useEffect, useState } from "react";
import { startOfDay } from "date-fns";
import fetchAPI from "@/Services/APIClient";

interface RangeResponse {
  flow?: { from: string | null; to: string | null };
  power?: { from: string | null; to: string | null };
  error?: string;
}

export interface DataRange {
  minDate: Date;
  maxDate: Date;
}

let cache: Promise<RangeResponse> | null = null;

/** Första och sista dagen som har data, för datumväljare. */
export function useDataRange(dataset: "flow" | "power") {
  const [range, setRange] = useState<DataRange | null>(null);

  useEffect(() => {
    let cancelled = false;
    cache ??= (fetchAPI.getDataRange() as Promise<RangeResponse>)
      .then((json) => {
        // Backend svarar med {status: "404", error} om databasen inte nås
        if (!json.flow || !json.power) {
          throw new Error(json.error ?? "Ogiltigt API-svar");
        }
        return json;
      })
      .catch((err) => {
        cache = null;
        throw err;
      });
    cache
      .then((json) => {
        const { from, to } = json[dataset] ?? {};
        if (!cancelled && from && to) {
          setRange({
            minDate: startOfDay(new Date(from)),
            maxDate: startOfDay(new Date(to)),
          });
        }
      })
      .catch((err) => console.error("Range API error", err));
    return () => {
      cancelled = true;
    };
  }, [dataset]);

  return range;
}
