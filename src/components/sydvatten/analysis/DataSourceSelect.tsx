import { useId } from "react";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoChevronDown } from "react-icons/io5";
import { cn } from "@/utils";
import { kpiOptionById, kpiOptions, type KpiId } from "./kpiOptions";

interface DataSourceSelectProps {
  /** Platsens nummer, 1–5 */
  position: number;
  value: KpiId | null;
  /** Källor som redan är valda i andra rutor */
  takenIds: KpiId[];
  onChange: (value: KpiId | null) => void;
}

const DataSourceSelect: React.FC<DataSourceSelectProps> = ({
  position,
  value,
  takenIds,
  onChange,
}) => {
  const { t } = useTranslation();
  const id = useId();
  const selected = value ? kpiOptionById[value] : null;

  return (
    <div
      className={cn(
        "relative flex min-h-16 items-center gap-2.5 rounded-xl border bg-white px-3 py-3 shadow-theme-xs transition focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 hover:border-gray-300 dark:bg-gray-900 dark:focus-within:border-brand-800 dark:hover:border-gray-700",
        selected
          ? "border-gray-200 dark:border-gray-800"
          : "border-dashed border-gray-300 dark:border-gray-700",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-6 shrink-0 items-center justify-center text-xl",
          selected ? "text-brand-500 dark:text-brand-400" : "text-gray-400 dark:text-gray-500",
        )}
      >
        {selected ? selected.icon : <IoAddCircleOutline />}
      </span>

      <span aria-hidden="true" className="min-w-0 flex-1">
        <span className="block text-sm font-medium break-words text-gray-800 dark:text-white/90">
          <span className="text-gray-500 dark:text-gray-400">{position}. </span>
          {selected ? t(selected.labelKey) : t("analysis.kpiSelector.noneSelected")}
        </span>
        {selected && (
          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
            ({selected.unit})
          </span>
        )}
      </span>

      <IoChevronDown
        aria-hidden="true"
        className="shrink-0 text-gray-500 dark:text-gray-400"
      />

      {/* Den riktiga dropdownen ligger osynlig över rutan, så tangentbord och skärmläsare fungerar */}
      <label htmlFor={id} className="sr-only">
        {t("analysis.kpiSelector.sourceLabel", { position })}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || null) as KpiId | null)}
        className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0"
      >
        <option value="">{t("analysis.kpiSelector.noneSelected")}</option>
        {kpiOptions.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.id !== value && takenIds.includes(option.id)}
          >
            {t(option.labelKey)} ({option.unit})
          </option>
        ))}
      </select>
    </div>
  );
};

export default DataSourceSelect;
