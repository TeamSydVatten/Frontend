import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/sydvatten/DescriptionOfData'
import PageBreadcrumb from '@/components/TailAdminComponents/common/PageBreadCrumb';

const Ringsjoverket = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Ringsjöverket | Sydvatten" description="Översikt av Ringsjöverkets mätningar" />
      <PageBreadcrumb pageTitle='Ringsjöverket'/>

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

export default Ringsjoverket;
