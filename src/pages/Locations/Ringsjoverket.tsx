import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import DescriptionOfData from '@/components/SydvattenKPI/DescriptionOfData'

const Ringsjoverket = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <PageMeta title="Ringsjöverket | Sydvatten" description="Översikt av Ringsjöverkets mätningar" />
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Ringsjöverket</h4>

      <ComponentCard title="Vilken data baseras detta på?">
        <DescriptionOfData />
      </ComponentCard>
    </div>
  );
};

export default Ringsjoverket;
