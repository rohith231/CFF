import React from "react";

import CommonManagement from "views/CommonManagement";
import { dashboardConfigRoutes } from "./dashboardConfigRoutes";

const DashboardConfig = () => {
  return (
    <CommonManagement
      routes={dashboardConfigRoutes}
      defaultRoute={"/admin/index/config/functional"}
    />
  );
};

export default DashboardConfig;
