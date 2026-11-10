import { useMemo } from "react";
import ElectricityPerRecievedWater from "@/components/SydvattenKPI/ElectricityPerRecievedWater";
import ComponentCard from "@/components/TailAdminComponents/common/ComponentCard";
import { usePowerData } from "@/hooks/usePowerData";

export const AllaMatare = () => {
  const { rows, loading, error } = usePowerData();

  const stations = useMemo(
    () =>
      [...new Set(rows.map((r) => r.location))].sort((a, b) =>
        a.localeCompare(b, "sv"),
      ),
    [rows],
  );

  if (loading) return <p>Laddar mätstationer...</p>;
  if (error) return <p>Kunde inte hämta data: {error}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {stations.map((station) => (
        <ComponentCard key={station} title={station}>
          <ElectricityPerRecievedWater location={station} />
        </ComponentCard>
      ))}
    </div>
  );
};