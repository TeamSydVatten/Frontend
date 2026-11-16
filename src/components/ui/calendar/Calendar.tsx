// shadcn/ui Calendar (react-day-picker v9), anpassad till TailAdmin-temat.
import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { sv } from "date-fns/locale";
import { ChevronLeftIcon } from "@/icons";
import { cn } from "@/utils";

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={sv}
      showOutsideDays={showOutsideDays}
      className={cn("relative text-sm", className)}
      classNames={{
        months: "flex flex-col gap-6 sm:flex-row",
        month: "flex flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-white/5",
        button_next:
          "flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-white/5",
        month_caption: "flex h-8 items-center justify-center",
        caption_label:
          "text-sm font-medium capitalize text-gray-800 dark:text-white/90",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-center text-xs font-normal text-gray-500 dark:text-gray-400",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center",
        day_button:
          "size-9 rounded-lg text-gray-700 hover:bg-gray-100 disabled:pointer-events-none dark:text-gray-300 dark:hover:bg-white/5",
        selected:
          "[&>button]:bg-brand-500 [&>button]:text-white [&>button]:hover:bg-brand-600 dark:[&>button]:bg-brand-500 dark:[&>button]:text-white",
        range_start: "rounded-s-lg bg-brand-50 dark:bg-brand-500/15",
        range_end: "rounded-e-lg bg-brand-50 dark:bg-brand-500/15",
        range_middle:
          "bg-brand-50 dark:bg-brand-500/15 [&>button]:bg-transparent! [&>button]:text-brand-600! dark:[&>button]:text-brand-300!",
        today: "[&>button]:font-semibold [&>button]:ring-1 [&>button]:ring-brand-300 dark:[&>button]:ring-brand-800",
        outside: "opacity-40",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <ChevronLeftIcon
            className={cn(
              "size-4",
              orientation === "right"
                ? "rotate-180 rtl:rotate-0"
                : "rtl:rotate-180",
            )}
          />
        ),
      }}
      {...props}
    />
  );
}
