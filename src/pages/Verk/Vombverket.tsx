import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'

const Vombverket = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Vombverket | Sydvatten" description="Översikt av Vombverkets mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Vombverket</h4>

      <ComponentCard title="Hur verk ska se ut" >
       <DescriptionOfData description='Här ska det ligga en jämförelsevy som benämns i issue:'/>
       <a href="https://github.com/TeamSydVatten/Frontend/issues/24"
              target="_blank"
            rel="noopener noreferrer">
            Länk till issue
            </a>
       </ComponentCard>
    </div>
  );
};

export default Vombverket;
