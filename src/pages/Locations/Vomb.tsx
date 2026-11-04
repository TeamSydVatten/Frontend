import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import ElectricityPerRecievedWater from '@/components/SydvattenKPI/ElectricityPerRecievedWater'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import CompareLineChart from '@/components/SydvattenKPI/CompareLineChart'
import WaterPeriodExplorer from '@/components/SydvattenKPI/WaterPeriodExplorer'

const Vomb = () => {
  const thisLocation = locationById.lund;
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Vombsjön Översikt | Sydvatten" description="Översikt av Vombsjöns mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Vomb</h4>
      
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6"> 
      <VattenNivaCard location ={thisLocation}/>
      <LatestFlowCard location ={thisLocation} />
      <ElectricityPerRecievedWater location={thisLocation}/>
    </div>
      
      <ComponentCard title ="Vilken data baseras detta på?">
        <DescriptionOfData/>
        </ComponentCard>

        <WaterPeriodExplorer></WaterPeriodExplorer>
    
        <ComponentCard title="Välj vilken data som ska visas">
          <CompareLineChart location={thisLocation}/>
        </ComponentCard>

    </div>
  );
};

export default Vomb;
