import LocationCard from '@/components/sydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import LineChartOne from '@/components/charts/line/LineChartOne'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import ElectricityPerRecievedWater from '@/components/SydvattenKPI/ElectricityPerRecievedWater'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
const Vomb = () => {
  const thisLocation = locationById.vomb
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Vombsjön Översikt | Sydvatten" description="Översikt av Vombsjöns mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Vomb</h4> 
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      
        <VattenNivaCard location ={thisLocation}/>
        
        <LatestFlowCard location ={thisLocation} />
    
        <ElectricityPerRecievedWater location={thisLocation}/>

        
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

export default Vomb