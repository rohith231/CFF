import React from "react";
import CommonManagement from "views/CommonManagement";
import { autoDeployRoutes } from "./autoDeployRoutes";

const AutoDeployment = () => {
  return (
    <div>
      <CommonManagement
        routes={autoDeployRoutes}
        defaultRoute={"/admin/auto-deployment/aws"}
      />
    </div>
  );
};

export default AutoDeployment;
