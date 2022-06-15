import React from "react";
import CommonManagement from "views/CommonManagement";
import { teamManagRoutes } from "./teamManagRoutes";

const TeamManagement = () => {
  return (
    <CommonManagement
      routes={teamManagRoutes}
      defaultRoute={"/admin/team-management/teams"}
    />
  );
};

export default TeamManagement;
