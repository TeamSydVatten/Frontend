import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import flowAPI from "@/Services/APIClient";

export function FlowDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const readings = await flowAPI.getData();
      console.log("readings:", readings);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  }, []);
  
}

