import React from "react";
import CommonManagement from "views/CommonManagement";
import { docVerRoutes } from "./docVerRoutes";

const DocVer = () => {
  return (
    <div>
      <CommonManagement
        routes={docVerRoutes}
        defaultRoute={"/admin/document-verification/fManager"}
      />
    </div>
  );
};

export default DocVer;
