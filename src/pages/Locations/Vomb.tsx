import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import ElectricityPerRecievedWater from '@/components/SydvattenKPI/ElectricityPerRecievedWater'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import CompareLineChart from '@/components/SydvattenKPI/CompareLineChart'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
const Vomb = () => {
  const thisLocation = locationById.vomb;
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Vombsjön Översikt | Sydvatten" description="Översikt av Vombsjöns mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Vomb</h4>
      <ComponentCard title ="Vilken data baseras detta på?">
              <DescriptionOfData description="Data visualiserad på den här sidan är genererad via diverse exceldokument med data som erhållits från Sydvatten, denna data har sedan städats och visas nu här.">
              
              </DescriptionOfData>
              </ComponentCard>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6"> 
      <VattenNivaCard location ="Vomb"/>
      <LatestFlowCard location ={thisLocation} />
      <ElectricityPerRecievedWater location="Vombverket"/>
    </div>
        <ComponentCard title="Exempel hur data kan visas (ej baserad på riktig data)">
          <CompareLineChart location={thisLocation}/>
        </ComponentCard>

    </div>
  );
};

export default Vomb;
