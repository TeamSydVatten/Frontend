import { PLANTS } from "@/api/sydvatten";
import { SELECT_CLASS } from "@/utils/chart";
import { ALL_PLANTS } from "@/utils/production";

interface PlantSelectProps {
  value: string;
  onChange: (plant: string) => void;
}

export default function PlantSelect({ value, onChange }: PlantSelectProps) {
  return (
    <select
      className={SELECT_CLASS}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {[ALL_PLANTS, ...PLANTS].map((plant) => (
        <option key={plant} value={plant}>
          {plant}
        </option>
      ))}
    </select>
  );
}
