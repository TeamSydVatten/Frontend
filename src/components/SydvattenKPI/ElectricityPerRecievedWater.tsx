import type { Location } from "@/types/location";
import { MdElectricBolt } from "react-icons/md";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
export default function ElectricityPerRecievedWater({ location }: { location: Location }) {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <MdElectricBolt className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Elförbrukning
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              {location.waterflow} Kilowatt / timme 
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            0.3%
          </Badge>
        </div>
      </div>
      </div>
  );
}
