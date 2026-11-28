import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import DescriptionOfData from '@/components/sydvatten/DescriptionOfData'
import PopulationTrendChart from '@/components/sydvatten/PopulationTrendChart'
import FlowPeriodChart from '@/components/sydvatten/FlowPeriodChart'

const Malmo = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <PageBreadcrumb pageTitle='Malmö - översikt'/>
      <ComponentCard title="Kommunvy - förklaring" >
       <DescriptionOfData description='Varje kommun ska visa olika saker:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/19"
              target="_blank"
            rel="noopener noreferrer">
            Issue - Befolkningsmängdskomponent
            </a>
            <br></br>
      <a href="https://github.com/TeamSydVatten/Frontend/issues/20"
              target="_blank"
            rel="noopener noreferrer">
             Issue - Snittförbrukningcomponent
            </a>
            
       </ComponentCard>

      <PopulationTrendChart municipality="Malmö" />
      <FlowPeriodChart municipality="Malmö" />
    </div>
  )
}

export default Malmo