import Label from '@/components/form/Label'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import LineChartOne from '@/components/charts/line/LineChartOne'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import FlowChartMunicipality from '@/components/SydvattenKPI/FlowChartMunicipality'
import CompareBarChart from '@/components/SydvattenKPI/CompareBarChart'
import { municipalityById } from '@/data/municipalities'

const Malmo = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <Label><h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Malmö</h4> </Label>
      <ComponentCard title="Beskrivning av data">
        <DescriptionOfData/>
        </ComponentCard>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
          <FlowChartMunicipality municipality="Malmö" />
        <ComponentCard title="Vattenförbrukning / person">
          Ej implementerat
        </ComponentCard>
      </div>
    </div>
  )
}

export default Malmo