import DataTableApproval from "./tabs/dataTableApproval/DataTableApproval";
import ExpBuild from "./tabs/ExpBuild";
import External from "./tabs/external/External";
import FunctionalConfig from "./tabs/FunctionalConfig";
import MapConfig from "./tabs/mapConfig/MapConfig";

export const dashboardConfigRoutes = [
  {
    path: "/functional",
    name: "Functional Configuration",
    icon: "ni ni-single-02 text-yellow",
    component: FunctionalConfig,
    layout: "/admin/index/config",
  },
  {
    path: "/map",
    name: "Map Configuration",
    icon: "fas fa-map text-pink",
    component: MapConfig,
    layout: "/admin/index/config",
  },
  {
    path: "/ext",
    name: "Embed External Service",
    icon: "fas fa-link text-orange",
    component: External,
    layout: "/admin/index/config",
  },
  // {
  //   path: "/expBuild",
  //   name: "Experience builder",
  //   icon: "fas fa-link text-orange",
  //   component: ExpBuild,
  //   layout: "/admin/index/config",
  // },
  {
    path: "/dataTableApproval",
    name: "Data Table Approval",
    icon: "fas fa-table text-yellow",
    component: DataTableApproval,
    layout: "/admin/index/config",
  },
];
