import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import { useState } from 'react'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'
import KpiSelector from '@/components/SydvattenKPI/analysis/KpiSelector'
import { defaultAnalysisSelection, type AnalysisSelection } from '@/components/SydvattenKPI/analysis/kpiOptions'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb'

const Analysvy = () => {
  // Valen ligger här så att diagrammet (issue #11) kan använda samma state
  const [selection, setSelection] = useState<AnalysisSelection>(defaultAnalysisSelection)

  return (
    <div className='grid grid-cols-1 gap-4'>
        <PageMeta title="Analys | Sydvatten" description="Kombineringsvy för KPIer" />
    <PageBreadcrumb pageTitle='Analysvy'/>
    <KpiSelector value={selection} onChange={setSelection} />

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