import { deleteRole } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Container } from "reactstrap";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import AddRoleModal from "./AddRoleModal";
import { useHistory } from "react-router-dom";
import searchFunctionality from "commonFunctions/searchFunctionality";
import FuncPopover from "./FuncPopover";
import { getDbRolesByClient } from "network/ApiAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Roles = () => {
  const [searchedRole, setSearchedRole] = useState("");
  const [action, setAction] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const clientId = localStorage.getItem("client_id");
  const queryClient = useQueryClient();
  const history = useHistory();
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["dbRolesByClient"],
    () => getDbRolesByClient(clientId),
    {
      select: (dbRolesByClient) => dbRolesByClient.data,
    }
  );
  const dltMutation = useMutation(deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("dbRolesByClient");
    },
  });

  const renderRows = (arr) => {
    return arr?.map((role, index) => {
      return (
        <tr key={role.id}>
          <th>{index + 1}</th>
          <td>{role.role_name}</td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                setRoleName(role.role_name);
                setRoleId(role.id);
                setAction("edit");
                setShowModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </Button>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                dltMutation.mutate(role.id);
              }}
            >
              <i className="fas fa-trash"></i>
            </Button>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                history.push(`/admin/index/config/functional/${role.id}`);
              }}
            >
              <i className="fas fa-arrow-right"></i>
            </Button>
          </td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              id={`Popover${role.id}`}
              type="button"
            >
              <i className="fas fa-clipboard-list"></i>
            </Button>
            <FuncPopover id={role.id} />
          </td>
        </tr>
      );
    });
  };

  const renderTable = () => {
    if (isSuccess && data.success) {
      return renderRows(
        searchFunctionality(searchedRole, data.roles, "role_name")
      );
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <div className="col-lg-6 col-md-6  col-sm-6">
            <Button
              onClick={() => {
                setAction("add");
                setShowModal(true);
              }}
            >
              Add Role
            </Button>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <InputGroup className="input-group-alternative mb-3">
              <Input
                placeholder="Role name"
                type="text"
                value={searchedRole}
                onChange={(e) => {
                  setSearchedRole(e.target.value);
                }}
              />
              <Button color="primary">Search</Button>
            </InputGroup>
          </div>
        </Row>
        <Card className="shadow">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Role Name</th>
                <th scope="col">Action</th>
                <th scope="col">Functionalities</th>
              </tr>
            </thead>
            <tbody>
              {renderTable()}
              {isLoading && (
                <tr>
                  <td>Loading ...</td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td>Error fetching data..</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
        <AddRoleModal
          show={showModal}
          setShow={setShowModal}
          roleName={roleName}
          roleId={roleId}
          action={action}
        />
      </Container>
    </>
  );
};

export default Roles;
