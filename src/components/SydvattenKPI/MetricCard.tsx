import type { ReactNode } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
import Badge from "../ui/badge/Badge";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";

interface MetricCardProps {
  title: string;
  value: number | null;
  unit: string;
  date?: string | null;
  icon?: ReactNode;
  change?: number;
  history?: number[];
  lowerIsBetter?: boolean;
}

export default function MetricCard({
  title,
  value,
  unit,
  date,
  icon,
  change,
  history = [],
  lowerIsBetter = false,
}: MetricCardProps) {
  // Visa de 14 senaste mätningarna
  const chartData = history.filter(Number.isFinite).slice(-14);

  // Hitta minsta och största vattennivån
  const minValue = Math.min(...chartData);
  const maxValue = Math.max(...chartData);
  const range = maxValue - minValue;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white">
            {icon}
          </div>
        )}
      </div>

      {/* Current value */}
      <div className="mt-5">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {value !== null
            ? value.toLocaleString("sv-SE", {
                maximumFractionDigits: 2,
              })
            : "Ingen data"}
        </h2>

        <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {unit}
        </span>
      </div>

      {/* Dynamic percentage change */}

      {change !== undefined && Number.isFinite(change) && (
        <div className="mt-4 flex items-center">
          <Badge
            color={
              change === 0
                ? "light"
                : lowerIsBetter
                  ? change < 0
                    ? "success"
                    : "error"
                  : change > 0
                    ? "success"
                    : "error"
            }
          >
            {change > 0 ? (
              <MdArrowUpward className="h-4 w-4" />
            ) : change < 0 ? (
              <MdArrowDownward className="h-4 w-4" />
            ) : (
              <span>→</span>
            )}

            <span>{Math.abs(change).toFixed(1)}%</span>
          </Badge>
        </div>
      )}

      {/* Latest measurement */}
      {date && (
        <p className="mt-3 text-xs text-gray-400">Senast uppmätt: {date}</p>
      )}

      {/* Historical chart */}
      {chartData.length > 1 && (
        <div className="mt-auto pt-8">
          <p className="mb-4 text-xs text-gray-400">
            Senaste {chartData.length} mätningarna
          </p>

          <div className="flex h-28 w-full items-end gap-1.5">
            {chartData.map((item, index) => {
              const height =
                range === 0 ? 50 : 20 + ((item - minValue) / range) * 80;

              return (
                <div
                  key={index}
                  title={`${item.toLocaleString("sv-SE")} ${unit}`}
                  className={`min-w-0 flex-1 rounded-t-md transition-colors ${
                    index === chartData.length - 1
                      ? "bg-indigo-500"
                      : "bg-indigo-200 hover:bg-indigo-400 dark:bg-indigo-500/50"
                  }`}
                  style={{
                    height: `${height}%`,
                  }}
                />
              );
            })}
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>Äldsta</span>
            <span>Senaste</span>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Relativ skala inom perioden
          </p>
        </div>
      )}
    </div>
  );
}
