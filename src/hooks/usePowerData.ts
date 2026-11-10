
import { useEffect, useState } from "react";
import fetchAPI from "@/Services/APIClient";

export interface PowerRow {
  location: string;
  timestamp: string;
  usage: number;
}

interface PowerResponse {
  data: PowerRow[];
}

let cache: Promise<PowerRow[]> | null = null;

function loadPower(): Promise<PowerRow[]> {
  if (!cache) {
    cache = (fetchAPI.getPowerData() as Promise<PowerResponse>)
      .then((json) => json.data)
      .catch((err) => {
        cache = null;
        throw err;
      });
  }
  return cache;
}

export function usePowerData() {
  const [rows, setRows] = useState<PowerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPower()
      .then((r) => !cancelled && setRows(r))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Fel"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, loading, error };
}