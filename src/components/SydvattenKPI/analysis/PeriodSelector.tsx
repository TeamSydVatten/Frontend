import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { historyYearOptions, type AnalysisSelection } from "./kpiOptions";

type Period = AnalysisSelection["period"];
type Historical = AnalysisSelection["historical"];

interface PeriodSelectorProps {
  period: Period;
  historical: Historical;
  onPeriodChange: (period: Period) => void;
  onHistoricalChange: (historical: Historical) => void;
}

/** Gör om ett Date-objekt till "ÅÅÅÅ-MM-DD" i lokal tid */
const toIsoDate = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  historical,
  onPeriodChange,
  onHistoricalChange,
}) => {
  const { t } = useTranslation();

  // DatePicker bygger om flatpickr när de här ändras, så de får inte skapas på nytt vid varje render
  const [defaultDates] = useState(() => [period.from, period.to]);
  const handleDateChange = useCallback(
    (dates: Date[]) => {
      if (dates.length === 2) {
        onPeriodChange({ from: toIsoDate(dates[0]), to: toIsoDate(dates[1]) });
      }
    },
    [onPeriodChange],
  );

  const yearOptions = historyYearOptions.map((years) => ({
    value: String(years),
    label: t("analysis.kpiSelector.previousYears", { count: years }),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
          {t("analysis.kpiSelector.period")}
        </h4>
        <DatePicker
          id="analysis-period"
          mode="range"
          rangeSeparator=" – "
          defaultDate={defaultDates}
          onChange={handleDateChange}
          placeholder={t("analysis.kpiSelector.periodPlaceholder")}
        />
      </div>

      <div className="space-y-3">
        <Switch
          label={t("analysis.kpiSelector.historical")}
          defaultChecked={historical.enabled}
          onChange={(enabled) => onHistoricalChange({ ...historical, enabled })}
        />
        {historical.enabled && (
          <Select
            options={yearOptions}
            defaultValue={String(historical.years)}
            onChange={(value) =>
              onHistoricalChange({ ...historical, years: Number(value) })
            }
          />
        )}
      </div>
    </div>
  );
};

export default PeriodSelector;
