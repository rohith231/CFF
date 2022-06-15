import Functionalities from "./tabs/Functionalities";
import Sectors from "./tabs/Sectors";

export const sectorManagRoutes = [
  {
    path: "/sectors",
    name: "Sectors",
    icon: "fas fa-industry text-green",
    component: Sectors,
    layout: "/admin/sector-management",
  },
  {
    path: "/functionalities",
    name: "Widgets",
    icon: "fas a-puzzle-piece",
    component: Functionalities,
    layout: "/admin/sector-management",
  },
];
