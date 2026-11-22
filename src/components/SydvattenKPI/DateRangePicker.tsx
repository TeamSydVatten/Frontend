import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "react-aria-components";
import { CalendarDate, type DateValue } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/calendar";
import { CalenderIcon } from "@/icons";
import { cn } from "@/lib/utils";

export interface DateRangeValue {
  from: Date;
  to: Date;
}

export interface DateRangePreset {
  /** i18n-nyckel för knappens text */
  labelKey: string;
  /** Antal dagar bakåt från sista dagen med data */
  days: number;
}

/** Snabbval som passar de flesta diagram */
const DEFAULT_PRESETS: DateRangePreset[] = [
  { labelKey: "dateRange.presets.week", days: 7 },
  { labelKey: "dateRange.presets.month", days: 30 },
  { labelKey: "dateRange.presets.year", days: 365 },
  { labelKey: "dateRange.presets.fiveYears", days: 5 * 365 },
];

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  /** Första och sista dagen som har data */
  minDate?: Date;
  maxDate?: Date;
  presets?: DateRangePreset[];
  className?: string;
}

const DAY_MS = 86_400_000;

function toCalendarDate(date: Date) {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function toDate(value: DateValue) {
  return new Date(value.year, value.month - 1, value.day);
}

const dayFormat = new Intl.DateTimeFormat("sv-SE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** shadcn (aria-nova) datumintervallväljare med snabbval. */
export default function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  presets = DEFAULT_PRESETS,
  className,
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const end = maxDate ?? new Date();

  const applyPreset = (days: number) => {
    let from = new Date(end.getTime() - (days - 1) * DAY_MS);
    if (minDate && from < minDate) from = minDate;
    onChange({ from, to: end });
    setOpen(false);
  };

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      <Button variant="outline" className={cn("h-11 gap-2 px-3", className)}>
        <CalenderIcon className="size-5 text-muted-foreground" />
        {dayFormat.format(value.from)} – {dayFormat.format(value.to)}
      </Button>

      <Popover placement="bottom start" className="w-auto">
        <Dialog aria-label={t("dateRange.label")} className="outline-hidden">
          <div className="mb-2 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.labelKey}
                variant="outline"
                size="sm"
                onPress={() => applyPreset(preset.days)}
              >
                {t(preset.labelKey)}
              </Button>
            ))}
          </div>

          <RangeCalendar
            aria-label={t("dateRange.label")}
            numberOfMonths={2}
            value={{ start: toCalendarDate(value.from), end: toCalendarDate(value.to) }}
            minValue={minDate ? toCalendarDate(minDate) : undefined}
            maxValue={toCalendarDate(end)}
            onChange={(range) => {
              if (!range) return;
              onChange({ from: toDate(range.start), to: toDate(range.end) });
              setOpen(false);
            }}
          />
        </Dialog>
      </Popover>
    </PopoverTrigger>
  );
}
