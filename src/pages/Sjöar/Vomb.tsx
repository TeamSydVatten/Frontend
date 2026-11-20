import { locationById } from '@/data/locations'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import ElectricityPerRecievedWater from '@/components/SydvattenKPI/ElectricityPerRecievedWater'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
const Vomb = () => {
  const thisLocation = locationById.vomb;
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Vombsjön Översikt | Sydvatten" description="Översikt av Vombsjöns mätningar" />
      <PageBreadcrumb pageTitle='Vomb'/>
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
      <VattenNivaCard location ="Vomb"/>
      <LatestFlowCard location ={thisLocation} />
    </div>

    </div>
  );
};

export default Vomb;
