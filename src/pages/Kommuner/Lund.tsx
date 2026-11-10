import React from 'react'

import Label from '@/components/form/Label'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
const Lund = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <Label><h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Lund</h4> </Label>
      <ComponentCard title="Databeskrivning">
        <DescriptionOfData description='Ingen data finns för Lund'></DescriptionOfData>
      </ComponentCard>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
        
      </div>
      
    </div>
  )
}

export default Lund