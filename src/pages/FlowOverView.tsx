import React from 'react'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
const FlowOverview = () => {
  return (
    <ComponentCard title="Hur flow ska se ut" >
       <DescriptionOfData description='Här ska flödesvy vara:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/26"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>
  )
}

export default FlowOverview