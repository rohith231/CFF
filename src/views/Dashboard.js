import DashboardConfig from "components/dashboardConfig/DashboardConfig";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Index from "./Index";

const Dashboard = () => {
  const roleId = localStorage.getItem("role_id");

  const adminRoute = () => {
    if (roleId === "2") {
      return <Route path="/admin/index/config" component={DashboardConfig} />;
    }
  };

  return (
    <>
      <Switch>
        <Route
          path="/admin/index"
          component={roleId === "2" ? DashboardConfig : Index}
          exact
        />
        {adminRoute()}
        <Redirect from="*" to={`/`} />
      </Switch>
    </>
  );
};

export default Dashboard;
