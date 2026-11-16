// Datumintervall-väljare (shadcn "Date Picker Range") för alla diagram.
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format, subDays, subYears, max as maxDate } from "date-fns";
import { sv } from "date-fns/locale";
import { CalenderIcon } from "@/icons";
import { cn } from "@/utils";
import { Calendar } from "@/components/ui/calendar/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/Popover";

export interface DateRangeValue {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  /** Första och sista dagen som har data */
  minDate?: Date;
  maxDate?: Date;
  /** Var kalendern fäster mot knappen ("end" när knappen står till höger) */
  align?: "start" | "end";
  className?: string;
}

const PRESETS = [
  { label: "7 dagar", range: (end: Date) => subDays(end, 6) },
  { label: "30 dagar", range: (end: Date) => subDays(end, 29) },
  { label: "1 år", range: (end: Date) => subYears(end, 1) },
  { label: "5 år", range: (end: Date) => subYears(end, 5) },
];

function formatDay(date: Date) {
  return format(date, "d MMM yyyy", { locale: sv });
}

export default function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate: lastDay,
  align = "start",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  const end = lastDay ?? new Date();

  const applyPreset = (getStart: (end: Date) => Date) => {
    const from = minDate ? maxDate([getStart(end), minDate]) : getStart(end);
    onChange({ from, to: end });
    setOpen(false);
  };

  // Klick 1 väljer startdag, klick 2 väljer slutdag och stänger.
  const handleSelect = (_range: DateRange | undefined, day: Date) => {
    if (!draft?.from) {
      setDraft({ from: day, to: undefined });
      return;
    }
    const [from, to] = day < draft.from ? [day, draft.from] : [draft.from, day];
    setDraft({ from, to });
    onChange({ from, to });
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setDraft(undefined);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:hover:bg-white/5",
            className,
          )}
        >
          <CalenderIcon className="size-5 text-gray-500 dark:text-gray-400" />
          {formatDay(value.from)} – {formatDay(value.to)}
        </button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-auto">
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          {draft?.from
            ? `Från ${formatDay(draft.from)} – välj slutdatum`
            : "Välj startdatum eller en snabbperiod"}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.range)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={draft?.from ?? value.from}
          selected={draft ?? value}
          onSelect={handleSelect}
          startMonth={minDate}
          endMonth={lastDay}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(lastDay ? [{ after: lastDay }] : []),
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}
