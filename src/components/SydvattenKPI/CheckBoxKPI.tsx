import Checkbox from "../form/input/Checkbox";

export type KpiKey = "electric" | "precipitation" | "water";

export const KPI_OPTIONS: { key: KpiKey; label: string; color: string }[] = [
  { key: "electric", label: "Elförbrukning", color: "#465FFF" },
  { key: "precipitation", label: "Nederbörd", color: "#9CB9FF" },
  { key: "water", label: "Vattenflöde", color: "#12B76A" },
];

type Props = {
  selected: Record<KpiKey, boolean>;
  onToggle: (key: KpiKey, checked: boolean) => void;
};

export default function CheckBoxKPI({ selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {KPI_OPTIONS.map(({ key, label }) => (
        <Checkbox
          key={key}
          id={`kpi-${key}`}          // unikt id per checkbox!
          label={label}
          checked={selected[key]}
          onChange={(checked) => onToggle(key, checked)}
        />
      ))}
    </div>
  );
}