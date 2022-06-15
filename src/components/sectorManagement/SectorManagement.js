import React from "react";
import CommonManagement from "views/CommonManagement";
import { sectorManagRoutes } from "./sectorManagRoutes";

const SectorManagement = () => {
  return (
    <CommonManagement
      routes={sectorManagRoutes}
      defaultRoute={"/admin/sector-management/sectors"}
    />
  );
};

export default SectorManagement;
