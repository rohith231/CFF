import React from "react";
import CommonManagement from "views/CommonManagement";
import { roleManagRoutes } from "./roleManagRoutes";

const RoleManagement = () => {
  return (
    <div>
      <CommonManagement
        routes={roleManagRoutes}
        defaultRoute={"/admin/role-management/roles"}
      />
    </div>
  );
};

export default RoleManagement;
