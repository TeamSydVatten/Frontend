import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import React from 'react'

const Analysvy = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
        <PageMeta title="Analys | Sydvatten" description="Kombineringsvy för KPIer" />
    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">KPI-jämförelser</h4>
        <img
      className=" h-1201px w-902px object-cover object-center"
      src="src/pages/klippi.png"
      alt="cool pix"
    />
    </div>
    
  )
}

export default Analysvy