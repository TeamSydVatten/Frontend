import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import LineChartOne from '@/components/charts/line/LineChartOne'
import ElectricityPerRecievedWater from '@/components/SydvattenKPI/ElectricityPerRecievedWater'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'

const Ringsjon = () => {
  const thisLocation = locationById.ringsjon
  return (
    
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Ringsjön | Sydvatten" description="Översikt av ringsjöns mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Ringsjön</h4> 
      <ComponentCard title ="Vilken data baseras detta på?">
              <DescriptionOfData description="Data visualiserad på den här sidan är genererad via diverse exceldokument med data som erhållits från Sydvatten, denna data har sedan städats och visas nu här.">
                             </DescriptionOfData>
              </ComponentCard>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">

                    
                   <VattenNivaCard location ="ring"/>
                  
                   <LatestFlowCard location ={locationById.ringsjon} />
                    <ElectricityPerRecievedWater location="ringsjon"/>
            </div>
        </div>
    
  )
}

export default Ringsjon