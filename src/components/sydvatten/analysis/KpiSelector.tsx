import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoBarChart } from "react-icons/io5";
import DataSourceSelect from "./DataSourceSelect";
import PeriodSelector from "./PeriodSelector";
import { MAX_SOURCES, type AnalysisSelection, type KpiId } from "./kpiOptions";

interface KpiSelectorProps {
  value: AnalysisSelection;
  onChange: (value: AnalysisSelection) => void;
}

/** Översta delen av analysverktyget (issue #10): välj datakällor och tidsperiod. */
const KpiSelector: React.FC<KpiSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const takenIds = value.sources.filter((id): id is KpiId => id !== null);

  const setSource = (index: number, id: KpiId | null) => {
    const sources = [...value.sources];
    sources[index] = id;
    onChange({ ...value, sources });
  };

  // Datumväljaren startas om när dess onChange byts ut, så setPeriod måste vara stabil.
  // Därför läser den senaste värdet från en ref i stället för att bero på `value`.
  const latest = useRef({ value, onChange });
  useEffect(() => {
    latest.current = { value, onChange };
  });
  const setPeriod = useCallback(
    (period: AnalysisSelection["period"]) =>
      latest.current.onChange({ ...latest.current.value, period }),
    [],
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        <IoBarChart aria-hidden="true" className="mt-1 size-7 shrink-0 text-brand-500" />
        <div>
          <h3 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            {t("analysis.kpiSelector.title")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("analysis.kpiSelector.description", { max: MAX_SOURCES })}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50 sm:p-5 xl:grid-cols-[1fr_auto_16rem]">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
            {t("analysis.kpiSelector.sources.title")}
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {value.sources.map((source, index) => (
              <DataSourceSelect
                key={index}
                position={index + 1}
                value={source}
                takenIds={takenIds}
                onChange={(id) => setSource(index, id)}
              />
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="hidden w-px bg-gray-200 dark:bg-gray-800 xl:block" />

        <PeriodSelector
          period={value.period}
          historical={value.historical}
          onPeriodChange={setPeriod}
          onHistoricalChange={(historical) => onChange({ ...value, historical })}
        />
      </div>
    </section>
  );
};

export default KpiSelector;
