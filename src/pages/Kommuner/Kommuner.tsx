import Label from '@/components/form/Label'
import SkaneOverview from '@/components/SydvattenKPI/SkaneOverview'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'

const Kommuner = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <PageMeta title="Översikt Kommuner | Sydvatten" description="Karta med kommuners data" />
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Översikt</h4> 
    <ComponentCard title="Kommuner"><SkaneOverview /></ComponentCard>
    
    </div>
  )
}

export default Kommuner