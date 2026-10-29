import React from 'react'
import Label from '@/components/form/Label'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import LineChartOne from '@/components/charts/line/LineChartOne'
import LineChart from '../TailAdminPages/Charts/LineChart'

const Malmo = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <Label><h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Malmö</h4> </Label>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
        <ComponentCard title="Elanvändning">
          <LineChartOne></LineChartOne>
        </ComponentCard>

        <ComponentCard title="Vattenförbrukning / person">
          <LineChartOne></LineChartOne>
        </ComponentCard>
      </div>
    </div>
  )
}

export default Malmo