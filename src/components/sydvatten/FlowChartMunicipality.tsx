import { useEffect, useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import fetchAPI from "@/Services/APIClient";

interface WaterFlowRow {
  meter_id: string;
  timestamp: string;
  water_flow: number;
  is_normal: boolean | null;
}

interface WaterFlowResponse {
  status: string;
  count: number;
  data: WaterFlowRow[];
}

export default function FlowChartMunicipality({
  municipality,
}: {
  municipality: string;
}) {
  const [data, setData] = useState<WaterFlowRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const response = (await fetchAPI.getMunicipality(
          municipality
        )) as WaterFlowResponse;

        if (!cancelled) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Water flow API error:", err);
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [municipality]);

  const sortedData = useMemo(() => {
    return data
      .filter(
        (row) =>
          row.water_flow != null &&
          Number.isFinite(Number(row.water_flow))
      )
      .sort(
        (a, b) => Number(b.water_flow) - Number(a.water_flow)
      );
  }, [data]);

  const total = sortedData.reduce(
    (sum, row) => sum + Number(row.water_flow),
    0
  );

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: Math.max(180, sortedData.length * 38),
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "65%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: sortedData.map((row) => row.meter_id),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: ["#6B7280"],
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)}`,
      },
    },
    noData: {
      text: loading ? "Hämtar data..." : "Ingen data tillgänglig",
    },
  };

  const series = [
    {
      name: "Vattenflöde",
      data: sortedData.map((row) => Number(row.water_flow)),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Vattenflöde per mätare
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {municipality} · Senaste mättillfället
        </p>

        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Totalt vattenflöde
          </p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">
            {total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-[640px]">
          <Chart
            options={options}
            series={series}
            type="bar"
            height={Math.max(180, sortedData.length * 38)}
          />
        </div>
      </div>
    </div>
  );
}