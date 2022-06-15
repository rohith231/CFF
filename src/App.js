import React from "react";
import { Switch, Redirect, Router } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AuthRoutes from "./components/PrivateRoute/AuthRoutes";
import history from "commonFunctions/history";

const App = () => {
  const roleId = localStorage.getItem("role_id");
  const redirectPath = () => {
    if (roleId === "3") {
      return `/admin/client-management`;
    } else if (roleId === "2") {
      return `/admin/index/config/map`;
    } else if (roleId === "1" && roleId > 3) {
      return `/admin/index`;
    } else {
      return `/admin`;
    }
  };
  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute path="/admin" component={AdminLayout} />
        <AuthRoutes path="/auth" component={AuthLayout} />
        <Redirect from="/" to={redirectPath()} />
      </Switch>
    </Router>
  );
};

export default App;
