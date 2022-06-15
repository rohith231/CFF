import React from "react";
import { Switch, Route } from "react-router-dom";
import FuncConfigByRoleId from "../FuncConfigByRoleId";
import FuncConfigOfAllROles from "../FunConfigOfAllRoles";

const FunctionalConfig = () => {
  return (
    <>
      <Switch>
        <Route
          path="/admin/index/config/functional/:roleId"
          component={FuncConfigByRoleId}
        />
        <Route
          path="/admin/index/config/functional"
          component={FuncConfigOfAllROles}
        />
      </Switch>
    </>
  );
};

export default FunctionalConfig;
