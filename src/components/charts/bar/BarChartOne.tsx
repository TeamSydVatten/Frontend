import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { Location } from "@/types/location";

export default function BarChartOne({ location }: { location?: Location }) {
  if (!location) return null;

  const categories = location.series.map((point) => point.date);

  const options: ApexOptions = {
    colors: ["#465fff", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
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
      <div id="chartOne" className="min-w-250">
        <Chart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}