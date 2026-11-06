import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface DailyPoint {
  date: string;
  usage: number | null;
}

interface ElectricityLineChartProps {
  data: DailyPoint[];
}

const electricityColors = {
  line: "#F59E0B",
  marker: "#FBBF24",
  markerBorder: "#D97706",
};

export default function ElectricityLineChart({
  data,
}: ElectricityLineChartProps) {
  // Kontrollera att vi har minst två mätningar
  const validPoints = data.filter(
    (point) => point.usage !== null && Number.isFinite(point.usage),
  );

  // Diagrammets inställningar
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 310,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    colors: [electricityColors.line],

    stroke: {
      curve: "smooth",
      width: 3,
    },

    markers: {
      size: 4,
      colors: [electricityColors.marker],
      strokeColors: electricityColors.markerBorder,
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },

    // Datum längst ner
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd MMM",
        datetimeUTC: false,
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    // Förbrukning på Y-axeln
    yaxis: {
      labels: {
        formatter: (value) =>
          value.toLocaleString("sv-SE", {
            maximumFractionDigits: 0,
          }),
        style: {
          colors: ["#9CA3AF"],
          fontSize: "12px",
        },
      },
    },

    // Informationsruta vid hover
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (value) =>
          value == null
            ? "Ingen data"
            : `${value.toLocaleString("sv-SE", {
                maximumFractionDigits: 2,
              })} kWh`,
      },
    },

    // Bakgrundslinjer
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    legend: {
      show: false,
    },

    noData: {
      text: "Ingen historisk data",
    },
  };

  // Omvandla våra värden till ApexCharts-format
  const series = [
    {
      name: "Elförbrukning",
      data: data.map((point) => ({
        x: new Date(`${point.date}T12:00:00Z`).getTime(),
        y: point.usage,
      })),
    },
  ];

  // Visa meddelande om historiken är otillräcklig
  if (validPoints.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Minst två dagar med mätningar krävs för att visa en trend.
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="line"
        height={310}
        width="100%"
      />
    </div>
  );
}
