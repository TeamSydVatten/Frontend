import type { Location } from "@/types/location";
import { useNavigate } from "react-router";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const navigate = useNavigate();

  return ( //<div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3" >
    
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {location.name}
      </h3>
      
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {location.description}
      </p>

      <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">
         Vattenflöde: {location.waterflow} m³/s
      </p>

      <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">
        Vattennivå: {location.waterlevel} MöH
      </p>

      <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">
        Elförburkning: 123 Kw/h
      </p>
      <Button
        className="mt-4"
        size="sm"
        variant="outline"
        endIcon={<ArrowRightIcon className="size-4" />}
        onClick={() => navigate(`/${location.id}`)}
      >
        Visa detaljer
      </Button>
    </div>
  );
}