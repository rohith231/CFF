import Roles from "./tabs/Roles";

export const roleManagRoutes = [
  {
    path: "/roles",
    name: "Roles",
    icon: "ni ni-single-copy-04",
    component: Roles,
    layout: "/admin/role-management",
  },
];
