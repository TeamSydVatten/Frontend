import { useMemo, useState } from "react";
import { IoTrophy } from "react-icons/io5";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HorizontalSlideIcon } from "@/icons";

type SkaneMunicipality = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  population: number;
  totalUsageM3PerYear: number; // m³/år
};

export const skaneMunicipalitiesData: SkaneMunicipality[] = [
  {
    id: "1",
    name: "Malmö",
    initials: "MA",
    avatarClassName:
      "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
    population: 357000,
    totalUsageM3PerYear: 17_500_000,
  },
  {
    id: "2",
    name: "Helsingborg",
    initials: "HE",
    avatarClassName:
      "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
    population: 155000,
    totalUsageM3PerYear: 8_900_000,
  },
  {
    id: "3",
    name: "Lund",
    initials: "LU",
    avatarClassName:
      "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    population: 130000,
    totalUsageM3PerYear: 6_200_000,
  },
  {
    id: "4",
    name: "Kristianstad",
    initials: "KR",
    avatarClassName:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    population: 87000,
    totalUsageM3PerYear: 4_300_000,
  },
  {
    id: "5",
    name: "Landskrona",
    initials: "LA",
    avatarClassName:
      "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
    population: 46000,
    totalUsageM3PerYear: 2_100_000,
  },
  {
    id: "6",
    name: "Trelleborg",
    initials: "TR",
    avatarClassName:
      "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
    population: 47000,
    totalUsageM3PerYear: 2_600_000,
  },
  {
    id: "7",
    name: "Ängelholm",
    initials: "ÄN",
    avatarClassName:
      "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
    population: 44000,
    totalUsageM3PerYear: 2_000_000,
  },
  {
    id: "8",
    name: "Hässleholm",
    initials: "HÄ",
    avatarClassName:
      "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    population: 53000,
    totalUsageM3PerYear: 2_900_000,
  },
  {
    id: "9",
    name: "Ystad",
    initials: "YS",
    avatarClassName:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    population: 30000,
    totalUsageM3PerYear: 1_700_000,
  },
  {
    id: "10",
    name: "Eslöv",
    initials: "ES",
    avatarClassName:
      "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
    population: 35000,
    totalUsageM3PerYear: 1_500_000,
  },
];


type Props = {
  data?: SkaneMunicipality[];
  title?: string;
};

// Liter per person och dygn
const litersPerCapitaPerDay = (m: SkaneMunicipality) =>
  Math.round((m.totalUsageM3PerYear * 1000) / 365 / m.population);

const getStatus = (lpcd: number) => {
  if (lpcd < 140)
    return {
      label: "Låg",
      className:
        "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500",
    };
  if (lpcd < 180)
    return {
      label: "Medel",
      className:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500",
    };
  return {
    label: "Hög",
    className: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500",
  };
};

const medalColors: Record<number, string> = {
  1: "text-yellow-500", // guld
  2: "text-gray-400", // silver
  3: "text-orange-500", // brons
};

function PositionBadge({ position }: { position: number }) {
  const color = medalColors[position];
  if (color) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IoTrophy className={`size-5 ${color}`} />
        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
          {position}
        </span>
      </span>
    );
  }
  return (
    <span className="pl-[26px] text-sm text-gray-500 dark:text-gray-400">
      {position}
    </span>
  );
}

const headerClass =
  "py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400";
const cellClass = "py-3 text-sm text-gray-500 dark:text-gray-400";

export default function MunicipalityWaterUsageTable({
  data = skaneMunicipalitiesData,
  title = "Vattenanvändning per capita",
}: Props) {
  // true = lägst först (bäst placering överst)
  const [ascending, setAscending] = useState(true);

  const rows = useMemo(() => {
    // Placeringen räknas alltid på lägst förbrukning = plats 1,
    // oavsett hur tabellen är sorterad just nu
    const withLpcd = data
      .map((m) => ({ ...m, lpcd: litersPerCapitaPerDay(m) }))
      .sort((a, b) => a.lpcd - b.lpcd)
      .map((m, index) => ({ ...m, position: index + 1 }));

    return ascending ? withLpcd : [...withLpcd].reverse();
  }, [data, ascending]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Liter per person och dygn
          </p>
        </div>

        <Button variant="outline" onClick={() => setAscending((prev) => !prev)}>
          <HorizontalSlideIcon />
          {ascending ? "Lägst först" : "Högst först"}
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className={headerClass}>Placering</TableCell>
              <TableCell isHeader className={headerClass}>Kommun</TableCell>
              <TableCell isHeader className={headerClass}>Invånare</TableCell>
              <TableCell isHeader className={headerClass}>Total (m³/år)</TableCell>
              <TableCell isHeader className={headerClass}>Liter/person/dygn</TableCell>
              <TableCell isHeader className={headerClass}>Nivå</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((row) => {
              const status = getStatus(row.lpcd);
              return (
                <TableRow key={row.id}>
                  <TableCell className="py-3">
                    <PositionBadge position={row.position} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-9 items-center justify-center rounded-full text-xs font-medium ${row.avatarClassName}`}
                      >
                        {row.initials}
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {row.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cellClass}>
                    {row.population.toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell className={cellClass}>
                    {row.totalUsageM3PerYear.toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell className={cellClass}>{row.lpcd}</TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}