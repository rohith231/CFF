import ChartsTable from "components/commonComps/ChartsTable";
import ExperienceTable from "components/commonComps/ExperienceTable";
import RolesDropdown from "components/commonComps/RolesDropdown";
import _ from "lodash";
import { setRoleCharts } from "network/ApiAxios";
import { setRoleExp } from "network/ApiAxios";
import { setRoleFunctionalities } from "network/ApiAxios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import FormGroup from "reactstrap/lib/FormGroup";
import Row from "reactstrap/lib/Row";
import FuncConfigTable from "../commonComps/FuncConfigTable";

const FunConfigOfAllRoles = () => {
  const [roleId, setRoleId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Select a role");
  const [permittedChart, setPermittedChart] = useState({});
  const [permittedWidget, setPermittedWidget] = useState({});
  const [expId, setExpId] = useState(null);
  const [existingExpId, setExistingExpId] = useState(null);
  const [error, setError] = useState("");
  const widMutation = useMutation(setRoleFunctionalities);
  const chartMutation = useMutation(setRoleCharts);
  const expMutation = useMutation(setRoleExp);
  const [existingWidgets, setExistingWidgets] = useState();
  const [existingCharts, setExistingCharts] = useState();

  const onConfirmClick = () => {
    if (roleId) {
      var funcIds = [];
      var chartIds = [];
      for (let key in permittedWidget) {
        if (permittedWidget[key]) {
          funcIds.push(key);
        }
      }
      for (let key in permittedChart) {
        if (permittedChart[key]) {
          chartIds.push(key);
        }
      }

      if (!_.isEqual(existingWidgets, permittedWidget)) {
        widMutation.mutate(
          { roleId, funcIds },
          {
            onSuccess: (response) => {
              setError("");
            },
          }
        );
      }
      if (!_.isEqual(existingCharts, permittedChart)) {
        chartMutation.mutate(
          { roleId, chartIds },
          {
            onSuccess: (response) => {
              setError("");
            },
          }
        );
      }

      if (existingExpId !== expId) {
        expMutation.mutate(
          { roleId, expId },
          {
            onSuccess: (response) => {
              setError("");
            },
          }
        );
      }
    } else {
      setError("Please select a role");
    }
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="6" md="6" sm="4">
            <RolesDropdown
              setRoleId={setRoleId}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </Col>
        </Row>
        <FuncConfigTable
          permittedFunc={permittedWidget}
          roleId={roleId}
          setPermittedFunc={setPermittedWidget}
          setExistingWidgets={setExistingWidgets}
        />
        <ChartsTable
          permittedFunc={permittedChart}
          roleId={roleId}
          setExistingCharts={setExistingCharts}
          setPermittedFunc={setPermittedChart}
        />
        <ExperienceTable
          expId={expId}
          setExistingExpId={setExistingExpId}
          roleId={roleId}
          setExpId={setExpId}
        />
        {error ? (
          <div className="text-muted font-italic">
            <small>
              error: <span className="text-red font-weight-700">{error}</span>
            </small>
          </div>
        ) : null}
        <FormGroup className="text-center mt-4">
          <Button color="primary" onClick={onConfirmClick}>
            Confirm
          </Button>
        </FormGroup>
      </Container>
    </>
  );
};

export default FunConfigOfAllRoles;
