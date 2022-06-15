import Aws from "./tabs/Aws";
import Google from "./tabs/Google";

export const autoDeployRoutes = [
  {
    path: "/aws",
    name: "AWS",
    icon: "fab fa-aws",
    component: Aws,
    layout: "/admin/auto-deployment",
  },
  {
    path: "/google",
    name: "GOOGLE",
    icon: "fab fa-google",
    component: Google,
    layout: "/admin/auto-deployment",
  },
];
