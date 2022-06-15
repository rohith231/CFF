import Login from "views/pages/Login.js";
import ConfirmEmail from "./views/pages/ConfirmEmail";
import ResetPassword from "./views/pages/ResetPassword";
import ConfirmPassword from "./views/pages/ConfirmPassword";
import ResetPasswordSuccess from "./views/pages/ResetPasswordSuccess";
import ProfileManagement from "components/profileManagement/ProfileManagement";
import TeamManagement from "components/teamManagement/TeamManagement";
import RoleManagement from "components/roleManagement/RoleManagement";
import Dashboard from "views/Dashboard";
import ClientManagement from "components/clientManagement/ClientManagement";
import SectorManagement from "components/sectorManagement/SectorManagement";
import AutoDeployment from "components/autoDeployment/AutoDeployment";
import DocVer from "components/documentVerification/DocVer";
import Register from "views/pages/Register";
import MlPrediction from "./components/mlPrediction"
//1 && >3 =dashboard-user, 2=admin, 3=super admin
// "*" indicates access for all dashboard_user roles
var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 ",
    component: Dashboard,
    layout: "/admin",
    access: ["*", "2"],
  },
  {
    path: "/ml-prediction",
    // name: "MlPrediction",
    // icon: "ni ni-tv-2 ",
    component: MlPrediction,
    layout: "/admin",
    access: ["*", "2", "3"],
  },
  {
    path: "/document-verification",
    name: "Document Management",
    icon: "fas fa-file",
    component: DocVer,
    layout: "/admin",
    access: ["2"],
  },
  {
    path: "/client-management",
    name: "Client Management",
    icon: "fas fa-user-tie",
    component: ClientManagement,
    layout: "/admin",
    access: ["3"], //only for roleId=3, super admin index page
  },
  {
    path: "/sector-management",
    name: "Sector Management",
    icon: "fas fa-industry",
    component: SectorManagement,
    layout: "/admin",
    access: ["3"],
  },
  {
    path: "/auto-deployment",
    name: "Auto Deployment",
    icon: "fas fa-magic",
    component: AutoDeployment,
    layout: "/admin",
    access: ["3"],
  },
  {
    path: "/team-management",
    name: "Team Management",
    icon: "fa fa-users",
    component: TeamManagement,
    layout: "/admin",
    access: ["2"], //only for roleId=2 and 3
  },
  {
    path: "/role-management",
    name: "Role Management",
    icon: "fa fa-user",
    component: RoleManagement,
    layout: "/admin",
    access: ["2"], //only for roleId=2
  },
  // {
  //   path: "/profile-management",
  //   name: "Profile Management",
  //   icon: "fa fa-id-card",
  //   component: ProfileManagement,
  //   layout: "/admin",
  //   access: ["*", "2", "3"],
  // },

  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin",
  // },

  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin",
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/confirm-email/:id",
    name: "Confirm Email",
    icon: "ni ni-check-bold text-green",
    component: ConfirmEmail,
    layout: "/auth",
  },

  // {
  //   path: "/users",
  //   name: "Users",
  //   icon: "ni ni-folder-17 text-pink",
  //   component: UsersTable,
  //   layout: "/admin",
  // },
  {
    path: "/reset-password",
    name: "Reset Password",
    icon: "ni ni-folder-17 text-pink",
    component: ResetPassword,
    layout: "/auth",
  },
  {
    path: "/confirm-password/:id",
    name: "Confirm Password",
    icon: "ni ni-folder-17 text-pink",
    component: ConfirmPassword,
    layout: "/auth",
  },
  {
    path: "/reset-success",
    name: "Password Reset Confirmed",
    icon: "ni ni-folder-17 text-pink",
    component: ResetPasswordSuccess,
    layout: "/auth",
  },
];
export default routes;
