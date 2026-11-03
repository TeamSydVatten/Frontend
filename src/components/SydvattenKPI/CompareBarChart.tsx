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
@@ -29,20 +34,7 @@ export default function BarChartOne() {
      colors: ["transparent"],
    },
    xaxis: {
      categories,













      axisBorder: {
        show: false,
      },
@@ -71,7 +63,6 @@ export default function BarChartOne() {
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
@@ -81,10 +72,15 @@ export default function BarChartOne() {
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

@@ -95,4 +91,4 @@ export default function BarChartOne() {
      </div>
    </div>
  );
}