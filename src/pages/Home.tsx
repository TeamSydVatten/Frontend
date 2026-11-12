import { useNavigate } from "react-router";
import { IoWater, IoWaterOutline } from "react-icons/io5";
import { Md12Mp, MdElectricBolt, MdLocationCity, MdMap, MdOutlineElectricBolt, MdOutlineLocationCity, MdOutlineMap } from "react-icons/md";
import ComponentCard from "@/components/TailAdminComponents/common/ComponentCard";
import Button from "@/components/ui/button/Button";

type LinkItem = { label: string; to: string; icon: React.ReactNode };
type LinkGroup = { title: string; links: LinkItem[] };

const groups: LinkGroup[] = [
  {
    title: "Översikter",
    links: [
      { label: "Vombsjön - Översikt", to: "/vomb", icon: <IoWaterOutline className="size-5" /> },
      { label: "Ringsjön - Översikt", to: "/ringsjon", icon: <IoWaterOutline className="size-5" /> },
      { label: "Bolmen - Översikt", to: "/bolmen", icon: <IoWaterOutline className="size-5" /> },
    ],
  },
  {
    title: "Kommuner",
    links: [
      { label: "Kartöversikt", to: "/karta", icon: <MdOutlineMap className="size-5" /> },
      { label: "Malmö", to: "/kommun/malmo", icon: <MdOutlineLocationCity className="size-5" /> },
      { label: "Lund", to: "/kommun/lund", icon: <MdOutlineLocationCity className="size-5" /> },
    ],
  },
  {
    title: "Elförbrukning",
    links: [
      { label: "Elöversikt", to: "/el", icon: <MdOutlineElectricBolt className="size-5" /> },
      { label: "Alla mätare (El)", to: "/el_alla", icon: <MdOutlineElectricBolt className="size-5" /> },
    ],
  },
];

export default function Startsida() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Startsida</h1>

      {groups.map((group) => (
        <ComponentCard key={group.title} title={group.title}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {group.links.map((l) => (
              <div key={l.to}>
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={l.icon}
                  onClick={() => navigate(l.to)}
                >
                  {l.label}
                </Button>
              </div>
            ))}
          </div>
        </ComponentCard>
      ))}
    </div>
  );
}