import { useState } from "react";
import { vombDailySummaries } from "@/data/vombDailySummaries";
import WaterPeriodSummary from "./WaterPeriodSummary";

const WaterPeriodExplorer = () => {
  const [selectedIndex, setSelectedIndex] = useState(
    vombDailySummaries.length - 1,
  );

  const summary = vombDailySummaries[selectedIndex];

  const isFirstDay = selectedIndex === 0;
  const isLastDay = selectedIndex === vombDailySummaries.length - 1;

  const showPreviousDay = () => {
    setSelectedIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const showNextDay = () => {
    setSelectedIndex((currentIndex) =>
      Math.min(vombDailySummaries.length - 1, currentIndex + 1),
    );
  };

  if (!summary) {
    return null;
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Byt dygn i sammanfattningen
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={showPreviousDay}
            disabled={isFirstDay}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Föregående dygn
          </button>

          <button
            type="button"
            onClick={showNextDay}
            disabled={isLastDay}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Nästa dygn
          </button>
        </div>
      </div>

      <WaterPeriodSummary {...summary} />
    </div>
  );
};

export default WaterPeriodExplorer;
