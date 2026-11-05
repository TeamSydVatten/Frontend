import React from 'react'
import LocationCard from '@/components/sydvattenKPI/LocationCard'
import { locationById } from '@/data/locations'
import Label from '@/components/form/Label'
import PageMeta from '@/components/TailAdminComponents/common/PageMeta'

const Home = () => {
  const locations = Object.values(locationById).filter(Boolean)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <PageMeta title="Översikt | Sydvatten" description="Översikt och startskärm" />
      <Label>
        <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">Översikt</h4>
      </Label>

      {locations.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No locations are available right now. Please try again later.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home