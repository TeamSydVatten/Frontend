import { useEffect, useState } from "react";
import { getMunicipalityStats, type MunicipalityStats } from "@/services/municipalityData";

export function useMunicipalityStats() {
  const [stats, setStats] = useState<Record<string, MunicipalityStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMunicipalityStats()
      .then((s) => !cancelled && setStats(s))
      .catch(() => !cancelled && setError("Kunde inte hämta data."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}