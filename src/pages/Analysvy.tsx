import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import React from 'react'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'

const Analysvy = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
        <PageMeta title="Analys | Sydvatten" description="Kombineringsvy för KPIer" />
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">KPI-jämförelser</h4>

    <ComponentCard title="Hur analys ska se ut" >
       <DescriptionOfData description='Förklaring av issue finns nedan:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/9"
              target="_blank"
            rel="noopener noreferrer">
            Länk till SuperComponent. Innehåller även tre subcomponents
            </a>
       </ComponentCard>


       
       <ComponentCard title="Exempelbild">
        <img
      className=" h-1201px w-902px object-cover object-center" src="src/pages/klippi.png" alt="cool pix"/>
       </ComponentCard>
 
    </div>
    
  )
}

export default Analysvy