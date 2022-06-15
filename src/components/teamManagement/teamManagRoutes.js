import CreateUsers from "./tabs/CreateUsers";
import Teams from "./tabs/Teams";
import DbUsersTable from "./tabs/DbUsersTable";

export const teamManagRoutes = [
  {
    path: "/teams",
    name: "Teams",
    icon: "fa fa-user-circle",
    component: Teams,
    layout: "/admin/team-management",
  },
  {
    path: "/new",
    name: "Create Users",
    icon: "ni ni-single-copy-04",
    component: CreateUsers,
    layout: "/admin/team-management",
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-folder-17 text-pink",
    component: DbUsersTable,
    layout: "/admin/team-management",
  },
];
