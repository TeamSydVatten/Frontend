import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
const VerkOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Verköversikt | Sydvatten" description="Översikt av de olika verken" />
      <PageBreadcrumb pageTitle='Verköversikt'/>

      <ComponentCard title="Jämförelsevy" >
       <DescriptionOfData description='Här ska det ligga en jämförelsevy som benämns i issue:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/25"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>
    </div>
  )
}

export default VerkOverview