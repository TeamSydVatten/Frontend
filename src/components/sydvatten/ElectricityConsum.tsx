import type { ElectricityData } from "@/types/ElectricityData";
import { MdElectricBolt } from "react-icons/md";
import { useNavigate } from "react-router";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons";

interface ElectricityConsumptionCardProps {
  electricityData : ElectricityData;
}

export default function ElectricityConsumptionCard({ electricityData }: ElectricityConsumptionCardProps) {
  const navigate = useNavigate();

  return ( //<div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3" >
    
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {electricityData.name}
      </h3>
      
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {electricityData.description}
      </p>

      <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">
         Elförbrukning i snitt: {electricityData.averageConsumption} kwh
      </p>

      <div className="mt-3">
        <p className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2">
          Senaste elförbrukning:
        </p>
        <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
          {Object.entries(electricityData.lasthoursOfConsumption).map(([time, consumption]) => (
            <div key={time} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Kl {time}</span>
              <span className="font-medium text-gray-800 dark:text-white/90">{consumption} kWh</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        className="mt-4"
        size="sm"
        variant="outline"
        endIcon={<ArrowRightIcon className="size-4" />}
        onClick={() => navigate(`/${electricityData.id}`)}
      >
        Visa detaljer
      </Button>
    </div>
  );
}