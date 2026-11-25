import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, BoxIconLine, MdOutlineWater } from "@/icons";

type WaterPeriodSummaryProps = {
  period: string;
  previousPeriod: string;
  volumeM3: number;
  previousVolumeM3: number;
  peakFlowLs: number;
  peakTime: string;
  validHours: number;
};



const formatNumber = (value: number, decimals = 0) =>
  new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

const WaterPeriodSummary = ({
  period,
  previousPeriod,
  volumeM3,
  previousVolumeM3,
  peakFlowLs,
  peakTime,
  validHours,
}: WaterPeriodSummaryProps) => {
  const changePercent =
    previousVolumeM3 > 0
      ? ((volumeM3 - previousVolumeM3) / previousVolumeM3) * 100
      : null;

    let ArrowComponent = null;
    let iconColor = "text-gray-400";

     if (changePercent !== null) {
      if (changePercent > 0) {
      ArrowComponent = ArrowUpIcon;
      iconColor = "text-green-600";
        } else if (changePercent < 0) {
      ArrowComponent = ArrowDownIcon;
      iconColor = "text-red-600";
        } else {
      ArrowComponent = ArrowRightIcon;
      iconColor = "text-gray-400";
    }
  }
  const changeText =
    changePercent === null
      ? "Kunde inte beräknas"
      : `${changePercent > 0 ? "+" : ""}${formatNumber(changePercent, 1)} %`;

  const metrics = [
    {
      label: "Vattenvolym under dygnet",
      value: `${formatNumber(volumeM3)} m³`,
      description: "Utgående vatten från Vombverket",
    },
    {
      label: "Förändringar mot föregående dygn",
      value: (
        <span className="inline-flex items-center gap-1">
          {changeText}
          {ArrowComponent && <ArrowComponent className={`h-5 w-5 ${iconColor}`} />}
        </span>
      ),
      description: `Jämfört med ${previousPeriod}`,
    },
    {  
      label: "Högsta flöde/H",
      value: `${formatNumber(peakFlowLs, 1)} L/s`,
      description: `Kl: ${peakTime}`,
    },
    {
      label: "Data sträcker sig över",
      value: `${validHours} av 24 timmar`,
      description:
        validHours === 24
          ? "Hela dygnet finns med"
          : "Dygnssammanställningen är ofullständig",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold text-gray-800" dark:text-white>
        Vombverket · dygnssammanfattning
      </h2>

      <p className="mt-1 text-sm text-gray-500">{period}</p>

      <dl className="xl-grid-cols-4 mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-sm text-gray-500">{metric.label}</dt>

            <dd className="mt-2 text-2xl font-semibold text-gray-800">
              {metric.value}
            </dd>

            <dd className="mt-2 text-sm text-gray-500">{metric.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default WaterPeriodSummary;
