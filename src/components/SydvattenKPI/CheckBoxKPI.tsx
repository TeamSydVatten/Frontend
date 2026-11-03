import React from 'react'
import { useState } from "react";
import Checkbox from '../form/input/Checkbox'

const CheckBoxKPI = () => {
    const [electric_checked, electric_setChecked] = useState(false);
    const [nederbord_checked, nederbord_setChecked] = useState(false);
    const [water_checked, water_setChecked] = useState(false);
  return (
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        <Checkbox
      id="godkann"
      label="Elförbrukning"
      checked={electric_checked}
      onChange={electric_setChecked}
    />

    <Checkbox
      id="godkann"
      label="Nederbörd"
      checked={nederbord_checked}
      onChange={nederbord_setChecked}
    />

    <Checkbox
      id="godkann"
      label="Vattenflöde"
      checked={water_checked}
      onChange={water_setChecked}
    />
        </div>
  )
}

export default CheckBoxKPI