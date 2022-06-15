import AdminUsers from "./tabs/AdminUsers";
import Clients from "./tabs/Clients";
import CreateAdminUser from "./tabs/CreateAdminUser";

export const clientManagRoutes = [
  {
    path: "/clients",
    name: "Clients",
    icon: "fa fa-user-circle text-red",
    component: Clients,
    layout: "/admin/client-management",
  },
  {
    path: "/new-admin",
    name: "Create Admin User",
    icon: "fas fa-user text-yellow",
    component: CreateAdminUser,
    layout: "/admin/client-management",
  },
  {
    path: "/admin-users",
    name: "Admin Users",
    icon: "fas fa-users text-pink",
    component: AdminUsers,
    layout: "/admin/client-management",
  },
];
