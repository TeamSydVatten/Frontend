import type { ReactNode } from "react";
import { IoArrowForward, IoBarChart, IoBusiness, IoFlash, IoMap, IoWater } from "react-icons/io5";

/**
 * Alla sidor i menyn. Används av både sidomenyn (AppSidebar) och startsidans snabblänkar (Home),
 * så lägg till nya sidor här så syns de på båda ställena.
 * Namnen som visas kommer från common.json: sidebar.items.<key>
 */
export type NavItem = {
  name: string;
  key?: string;
  icon: ReactNode;
  path?: string;
  new?: boolean;
  target?: string;
  subItems?: {
    name: string;
    key?: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    target?: string;
  }[];
};

export const navItems: NavItem[] = [
  {
    icon: <IoWater/>,
    name: "Vatten",
    key: "lakes",
    subItems: [
      
      { name: "Vombsjön", key: "vomb", path: "/vomb" },
      { name: "Ringsjön", key: "ringsjon", path: "/ringsjon" },
      { name: "Bolmen", key: "bolmen", path: "/bolmen" }],
  },
  {
    icon: <IoArrowForward/>,
    name: "Flöde",
    key: "flow",
    subItems: [
      { name: "verkoversikt", key: "flowoverview", path: "/flowoverview" },
    ],
  },
  {
    icon: <IoBusiness/>,
    name: "Verk",
    key: "verk",
    subItems: [
      { name: "verkoversikt", key: "verkjamforelsevy", path: "/verkoverview" },
      { name: "Vombsjön", key: "vombverket", path: "/vombverket" },
      { name: "Ringsjön", key: "ringsjoverket", path: "/ringsjoverket" },
    ],
  },

  {
    icon: <IoMap/>,
    name: "Kommuner",
    key: "kommuner",
    subItems: [
      { name: "Kartöversikt", key: "kommunoversikt", path: "/kommuner" },
      { name: "Malmö", key: "malmo", path: "/malmo" },
      { name: "Lund", key: "lund", path: "/lund" }],
  },
  {
    icon: <IoFlash/>,
    name: "El",
    key: "elforbrukning",
    subItems: [
      { name: "Elöversikt", key: "el_oversikt", path: "/elOverview" },
      { name: "Alla mätare", key: "el_alla", path: "/el_alla"}],
  },
  {
    icon: <IoBarChart/>,
    name: "Analysis",
    key: "analysis",
    subItems: [
      { name: "verkoversikt", key: "analysis", path: "/analysvy" },
    ],
  },
];
