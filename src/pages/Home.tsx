import Label from '@/components/form/Label'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'
import ComponentCard from '@/components/TailAdminComponents/common/ComponentCard'
import Button from '@/components/ui/button/Button'
import { BoxIcon, MapIcon } from '@/icons'
import { Link } from 'react-router'
import { MdElectricBolt, MdLocationCity } from 'react-icons/md'
import { IoWaterOutline } from 'react-icons/io5'
const Home = () => {
  return (

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <PageMeta title="Översikt | Sydvatten" description="Översikt och startskärm" />
      <Label><h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Startsida</h4> </Label>
      <ComponentCard title="Översikter">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-6">
        <Link to="/vomb">
          <Button
              size="sm"
              variant="outline"
              startIcon={<IoWaterOutline className="size-5" />}
            >
              Vombsjön - Översikt
            </Button>
            </Link>

            <Link to="/ringsjon">
          <Button
              size="sm"
              variant="outline"
              startIcon={<IoWaterOutline className="size-5" />}
            >
              Ringsjön - Översikt
            </Button>
            </Link>

            <Link to="/bolmen">
          <Button
              size="sm"
              variant="outline"
              startIcon={<IoWaterOutline className="size-5" />}
            >
              Bolmen - Översikt
            </Button>
            </Link>

             

      </div>
      </ComponentCard>

      <ComponentCard title="Kommuner">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-6">
        <Link to="/kommuner">
          <Button
              size="sm"
              variant="outline"
              startIcon={<MapIcon className='size-5' />}
            >
              Kartöversikt
            </Button>
            </Link>

        <Link to="/malmo">
          <Button
              size="sm"
              variant="outline"
              startIcon={<MdLocationCity className="size-5" />}
            >
              Malmö
            </Button>
            </Link>

        <Link to="/lund">
          <Button
              size="sm"
              variant="outline"
              startIcon={<MdLocationCity className="size-5" />}
            >
              Lund
            </Button>
            </Link>

      </div>
      </ComponentCard>

      <ComponentCard title="Elförbrukning">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-6">
        <Link to="/elOverview">
          <Button
              size="sm"
              variant="outline"
              startIcon={<MdElectricBolt className="size-5" />}
            >
              Elöversikt
            </Button>
            </Link>

        <Link to="/el_alla">
          <Button
              size="sm"
              variant="outline"
              startIcon={<MdElectricBolt className="size-5" />}
            >
              Alla mätare (El)
            </Button>
            </Link>

      </div>
      </ComponentCard>
      
    </div>
  )
}

export default Home