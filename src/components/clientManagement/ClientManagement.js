import React from "react";
import CommonManagement from "views/CommonManagement";
import { clientManagRoutes } from "./clientManagRoutes";

const ClientManagement = () => {
  return (
    <CommonManagement
      routes={clientManagRoutes}
      defaultRoute={"/admin/client-management/clients"}
    />
  );
};

export default ClientManagement;
