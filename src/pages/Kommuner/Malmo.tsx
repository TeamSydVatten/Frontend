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

    </div>
  )
}

export default Malmo