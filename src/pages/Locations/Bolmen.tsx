import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import LineChartOne from '@/components/charts/line/LineChartOne'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
const Bolmen = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Bolmen | Sydvatten" description="Överikt av Bolmens mätningar" />
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Bolmen</h4> 
       <ComponentCard title="Tunnelflöde historik">
          <LineChartOne></LineChartOne>
       </ComponentCard>
    </div>
  )
}

export default Bolmen