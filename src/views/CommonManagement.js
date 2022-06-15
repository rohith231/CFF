import Header from "components/Headers/Header";
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import { NavLink as NavLinkRRD } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

const CommonManagement = (props) => {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      );
    });
  };
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            activeClassName="active"
            className="p-3 "
          >
            <i className={prop.icon} style={{ paddingRight: 5 }} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };
  return (
    <div>
      <Header />
      <Card>
        <CardHeader style={{ border: "0px" }}>
          <Nav tabs>{createLinks(props.routes)}</Nav>
        </CardHeader>
        <CardBody>
          <Switch>
            {getRoutes(props.routes)}
            <Redirect from="*" to={props.defaultRoute} />
          </Switch>
        </CardBody>
      </Card>
    </div>
  );
};

export default CommonManagement;
