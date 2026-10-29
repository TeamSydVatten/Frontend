import ElectricityConsum from '@/components/SydvattenKPI/ElectricityConsum'
import React from 'react'
import { electricityDataById } from '@/data/electricityData'

const ElOverview = () => {
  return (
     <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:gap-6">
        <ElectricityConsum electricityData={electricityDataById.vombverket} />
        <ElectricityConsum electricityData={electricityDataById.ringsjoverket} />
        <ElectricityConsum electricityData={electricityDataById.ringsjoholmPump} />
        <ElectricityConsum electricityData={electricityDataById.teckomatorptPump} />
        <ElectricityConsum electricityData={electricityDataById.aktabodenPump} />
        <ElectricityConsum electricityData={electricityDataById.gunnestorpStation} />
        <ElectricityConsum electricityData={electricityDataById.kallbyPumpstation} />
    </div>
  )
}

export default ElOverview