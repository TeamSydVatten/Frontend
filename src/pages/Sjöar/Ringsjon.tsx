import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/sydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/sydvattenKPI/VattenNivaCard'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import LineChartOne from '@/components/charts/line/LineChartOne'
import ElectricityPerRecievedWater from '@/components/sydvattenKPI/ElectricityPerRecievedWater'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'

const Ringsjon = () => {
  const thisLocation = locationById.ringsjon
  return (
    
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Ringsjön | Sydvatten" description="Översikt av ringsjöns mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Ringsjön</h4> 
      <div><ComponentCard title="Ej implementerat" >
       <DescriptionOfData description='Hur SJÖAR ska se ut benämns här:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/23"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>
      </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">

                    
                   <VattenNivaCard location ="ring"/>
                  
                   <LatestFlowCard location ={locationById.ringsjon} />
                    <ElectricityPerRecievedWater location="ringsjon"/>
            </div>
        </div>
    
  )
}

export default Ringsjon