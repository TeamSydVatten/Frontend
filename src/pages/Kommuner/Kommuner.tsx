import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import SkaneOverview from '@/components/SydvattenKPI/SkaneOverview'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'

const Kommuner = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <PageMeta title="Översikt Kommuner | Sydvatten" description="Karta med kommuners data" />
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Översikt</h4>
    <ComponentCard title="Kommunvy - förklaring" >
       <DescriptionOfData description='Här ska det ligga en topplista som benämns i issue:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/8"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>


    
    <ComponentCard title="Kommuner"><SkaneOverview /></ComponentCard>
    
    </div>
  )
}

export default Kommuner