import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { Location } from "@/types/location";

export default function LineChartOne({ location }: { location?: Location }) {
  if (!location) return null;

  const categories = location.series.map((point) => point.date);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
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
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: location.name,
      data: location.series.map((point) => point.value),
    },
    {
      name: "Förlust",
      data: location.lossSeries.map((point) => point.value),
    },
  ];

  return (
    <div className="custom-scrollbar max-w-full overflow-x-auto">
      <div id="chartEight" className="min-w-250 2xl:min-w-full">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}