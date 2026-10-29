import LocationCard from '@/components/sydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/sydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/sydvattenKPI/VattenNivaCard'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import LineChartOne from '@/components/charts/line/LineChartOne'
import ElectricityPerRecievedWater from '@/components/sydvattenKPI/ElectricityPerRecievedWater'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'

const Ringsjon = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Ringsjön | Sydvatten" description="Översikt av ringsjöns mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Ringsjön</h4> 
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">

                    
                   <VattenNivaCard location ={locationById.ringsjon}/>
                  
                   <LatestFlowCard location ={locationById.ringsjon} />
                    <ElectricityPerRecievedWater location={locationById.ringsjon}/>
            </div>
            <ComponentCard title="Elförbruking">
          <LineChartOne />
          </ComponentCard>
          <ComponentCard title="Vattenproduktion">
          <LineChartOne />
          </ComponentCard>
        </div>
    
  )
}

export default Ringsjon