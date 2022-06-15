import React, { useState, useEffect } from "react";
// reactstrap components
import { Card, Container, Row, Col } from "reactstrap";

import Header from "components/Headers/Header.js";
import DashboardScene from "components/gisMaps/DashboardScene";
import { getActiveWebmap } from "network/ApiAxios";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import Button from "reactstrap/lib/Button";
import CardHeader from "reactstrap/lib/CardHeader";
import CardBody from "reactstrap/lib/CardBody";
import { getActivePortal } from "network/ApiAxios";
import Charts from "components/dashboard/Charts";
import PortalDropdown from "components/commonComps/PortalDropdown";
import DbConfigModal from "components/commonComps/DbConfigModal";
import DashboardMap from "components/openGis/DashboardMap";

const Index = () => {
  const roleId = localStorage.getItem("role_id");
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <>
      <Header />
      {/* Page content */}
      <Row>
        <Col xl="12">
          <DashboardMap />
        </Col>
      </Row>
      <Row>
        <Col>
          <Charts />
        </Col>
      </Row>
      <DbConfigModal show={showConfigModal} setShow={setShowConfigModal} />
    </>
  );
};

export default Index;
