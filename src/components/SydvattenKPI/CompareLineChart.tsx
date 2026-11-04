import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { Location } from "@/types/location";
import CheckBoxKPI, { KPI_OPTIONS, type KpiKey } from "./CheckBoxKPI";

export default function CompareLineChart({ location }: { location?: Location }) {
  const [selected, setSelected] = useState<Record<KpiKey, boolean>>({
    electric: true,
    precipitation: false,
    water: false,
  });

  const handleToggle = (key: KpiKey, checked: boolean) =>
    setSelected((prev) => ({ ...prev, [key]: checked }));

  const activeKpis = KPI_OPTIONS.filter((k) => selected[k.key]);

  const series = activeKpis.map((k) => ({
  name: k.label,
  data: location.kpis[k.key].map((p) => ({
    x: new Date(p.date).getTime(),
    y: p.value,
  })),
}));

  const options: ApexOptions = useMemo(
    () => ({
      colors: activeKpis.map((k) => k.color),
      legend: { show: true, position: "top", horizontalAlign: "left" },
      chart: {
        fontFamily: "Outfit, sans-serif",
        height: 310,
        type: "area",
        toolbar: { show: false },
      },
      stroke: { curve: "straight", width: 2 },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.55, opacityTo: 0 },
      },
      markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      dataLabels: { enabled: false },
      tooltip: { enabled: true },
      xaxis: {
  type: "datetime",
  labels: { format: "dd MMM", datetimeUTC: false },
  axisBorder: { show: false },
  axisTicks: { show: false },
  tooltip: { enabled: false },
},
      yaxis: {
        labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      },
      noData: { text: "Välj minst en datakälla" },
    }),
    [location, selected]
  );

  if (!location) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {location.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Välj vilken data som ska visas i diagrammet
          </p>
        </div>
        <CheckBoxKPI selected={selected} onToggle={handleToggle} />
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-[640px] 2xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}