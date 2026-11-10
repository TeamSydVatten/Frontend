import { useNavigate } from "react-router";
import { IoWater } from "react-icons/io5";
import { MdElectricBolt, MdLocationCity, MdMap } from "react-icons/md";
import ComponentCard from "@/components/TailAdminComponents/common/ComponentCard";
import Button from "@/components/ui/button/Button";

type LinkItem = { label: string; to: string; icon: React.ReactNode };
type LinkGroup = { title: string; links: LinkItem[] };

const groups: LinkGroup[] = [
  {
    title: "Översikter",
    links: [
      { label: "Vombsjön - Översikt", to: "/vomb", icon: <IoWater className="size-5" /> },
      { label: "Ringsjön - Översikt", to: "/ringsjon", icon: <IoWater className="size-5" /> },
      { label: "Bolmen - Översikt", to: "/bolmen", icon: <IoWater className="size-5" /> },
    ],
  },
  {
    title: "Kommuner",
    links: [
      { label: "Kartöversikt", to: "/karta", icon: <MdMap className="size-5" /> },
      { label: "Malmö", to: "/kommun/malmo", icon: <MdLocationCity className="size-5" /> },
      { label: "Lund", to: "/kommun/lund", icon: <MdLocationCity className="size-5" /> },
    ],
  },
  {
    title: "Elförbrukning",
    links: [
      { label: "Elöversikt", to: "/el", icon: <MdElectricBolt className="size-5" /> },
      { label: "Alla mätare (El)", to: "/el_alla", icon: <MdElectricBolt className="size-5" /> },
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