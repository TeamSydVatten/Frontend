import React, { useEffect, useState } from 'react'
import { ArrowDownIcon, MdOutlineWater } from "@/icons";
import Badge from "../ui/badge/Badge";
import type { Location } from "@/types/location";
import fetchAPI from '@/Services/APIClient';

export default function VattenNivaCard({ location }: { location: Location }) {
const [waterLevel, setWaterLevel] = useState<number | null>(null);
const [latestDate, setDate] =useState<string | null>(null);

useEffect(() => {
  const load = async () => {
    try {
      const response = await fetchAPI.getLakeLevel(location.id);
      setWaterLevel(response.data[0]?.water_level ?? null);
      setDate(response.data[0]?.date ?? null)
    } catch (err) {
      console.error(err);
    }
  };
  load();
}, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <MdOutlineWater className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {/*{t("orders")}*/}
              Vattennivå : {latestDate}
              
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              {waterLevel} meter över havet
            </h4>
          </div>
              
        </div>
      </div>
  )
}