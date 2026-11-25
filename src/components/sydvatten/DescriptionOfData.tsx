import React from 'react'

export function DescriptionOfData ({ description }: { description: string }) {
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
        {description}
    </div>
  )
}

export default DescriptionOfData