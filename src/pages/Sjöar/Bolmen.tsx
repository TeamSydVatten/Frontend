import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import VattenNivaCard from '@/components/SydvattenKPI/VattenNivaCard'
import LatestFlowCard from '@/components/SydvattenKPI/LatestFlowCard'
import { locationById } from '@/data/locations'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
const Bolmen = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Bolmen | Sydvatten" description="Överikt av Bolmens mätningar" />
      <PageBreadcrumb pageTitle='Bolmen'/>
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
          <VattenNivaCard location="bolmen"></VattenNivaCard>
          <LatestFlowCard location={locationById.bolmen}></LatestFlowCard>
       </div>
      
    </div>
  )
}

export default Bolmen