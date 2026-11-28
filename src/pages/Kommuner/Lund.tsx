import React from 'react'

import DescriptionOfData from '@/components/sydvatten/DescriptionOfData'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PopulationTrendChart from '@/components/sydvatten/PopulationTrendChart'
import FlowPeriodChart from '@/components/sydvatten/FlowPeriodChart'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
const Lund = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <PageBreadcrumb pageTitle='Lund - översikt'/>
      <ComponentCard title="Databeskrivning">
        <DescriptionOfData description='Ingen data finns för Lund'></DescriptionOfData>
      </ComponentCard>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
        <PopulationTrendChart municipality="Lund" />
        <FlowPeriodChart municipality="Lund" />
      </div>
      
    </div>
  )
}

export default Lund