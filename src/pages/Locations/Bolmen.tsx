import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import { locationById } from '@/data/locations'
import ElectricityPerRecievedWater from '@/components/SydvattenKPI/ElectricityPerRecievedWater'
const Bolmen = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Bolmen | Sydvatten" description="Överikt av Bolmens mätningar" />
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Bolmen</h4>
    <ComponentCard title ="Vilken data baseras detta på?">
              <DescriptionOfData description="Data visualiserad på den här sidan är genererad via diverse exceldokument med data som erhållits från Sydvatten, denna data har sedan städats och visas nu här."> </DescriptionOfData>
              </ComponentCard> 
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6"> 
          <VattenNivaCard location="bolmen"></VattenNivaCard>
          <LatestFlowCard location={locationById.bolmen}></LatestFlowCard>
          <ElectricityPerRecievedWater location='bolmen'></ElectricityPerRecievedWater>
       </div>
      
    </div>
  )
}

export default Bolmen