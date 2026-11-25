import DescriptionOfData from '@/components/sydvatten/DescriptionOfData'
import SkaneOverview from '@/components/sydvatten/SkaneOverview'
import MunicipalityWaterUsageTable from '@/components/sydvatten/Hiscores'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'

const Kommuner = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <PageMeta title="Översikt Kommuner | Sydvatten" description="Karta med kommuners data" />
    <PageBreadcrumb pageTitle='Kommunöversikt'/>
    <ComponentCard title="Kommunvy - förklaring" >
       <DescriptionOfData description='Här ska det ligga en topplista som benämns i issue:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/8"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>
        <MunicipalityWaterUsageTable></MunicipalityWaterUsageTable>

    
    <ComponentCard title="Kommuner"><SkaneOverview /></ComponentCard>
    
    </div>
  )
}

export default Kommuner