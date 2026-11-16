// shadcn/ui Popover (Radix), anpassad till TailAdmin-temat.
import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentProps } from "react";
import { cn } from "@/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-99999 rounded-xl border border-gray-200 bg-white p-4 text-gray-800 shadow-theme-lg outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-white/90",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
