import React from 'react'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import DescriptionOfData from '@/components/sydvatten/DescriptionOfData'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'
const FlowOverview = () => {
  return (
    <div><PageBreadcrumb pageTitle='Flödesöversikt'/>
    <ComponentCard title="Hur flow ska se ut" >
      
       <DescriptionOfData description='Här ska flödesvy vara:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/26"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>
       </div>
  )
}

export default FlowOverview