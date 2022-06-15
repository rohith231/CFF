import RolesDropdown from "components/commonComps/RolesDropdown";
import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter } from "react-bootstrap";
import { useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import { Modal } from "reactstrap";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";
import { useMutation } from "react-query";
import {
  createNewTeam,
  editTeamById,
  getDbUsersWithRoleByClient,
} from "../../../network/ApiAxios";
import Container from "reactstrap/lib/Container";

const AddTeamModal = (props) => {
  const [groupedUsers, setGroupedUsers] = useState([]);
  const [roleId, setRoleId] = useState("");
  const clientId = localStorage.getItem("client_id");
  const [teamName, setTeamName] = useState("");
  const [selectedRole, setSelectedRole] = useState("Select a role");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { data: usersData, isSuccess: isUsersS } = useQuery(
    ["getDbUsersWithRoleByClient"],
    () => getDbUsersWithRoleByClient(clientId),
    {
      select: (getDbUsersWithRoleByClient) => getDbUsersWithRoleByClient.data,
    }
  );
  const mutation = useMutation(createNewTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries(["allTeamsByClient"]);
    },
  });
  const editMutation = useMutation(editTeamById, {
    onSuccess: () => {
      queryClient.invalidateQueries(["allTeamsByClient"]);
    },
  });
  const data = queryClient.getQueriesData(["getTeamById", props.teamId]);
  useEffect(() => {
    if (props.action === "edit" && data[0][1]) {
      var teamById = data[0][1].data;
      setTeamName(teamById.teamName);
      const options = teamById.userTeam.map((elem) => {
        var userName;
        usersData?.users.forEach((user) => {
          if (user.id === elem.user_id) {
            userName = user.user_name;
          }
        });
        return { value: elem.user_id, label: userName };
      });
      setGroupedUsers(options);
    } else if (props.action === "add") {
      setTeamName("");
      setGroupedUsers([]);
    }
  }, [props.action, data[0][1]]);

  useEffect(() => {
    if (props.show === false) {
      setError("");
    }
  }, [props.show]);

  const usersDropDown = () => {
    if (isUsersS && usersData.success) {
      let options = usersData.users
        .filter((user) => {
          if (roleId) {
            return user.role_id === roleId;
          } else {
            return true;
          }
        })
        .map((user) => ({
          value: user.id,
          label: user.user_name,
        }));
      return (
        <Select
          isMulti
          name="users"
          value={groupedUsers}
          onChange={onSelectChange}
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      );
    }
  };
  const onSelectChange = (selectedOption) => {
    setGroupedUsers(selectedOption);
  };

  const onAddClick = () => {
    if (teamName && groupedUsers.length > 0) {
      if (props.action === "add") {
        const userIds = groupedUsers.map((user) => user.value);
        mutation.mutate(
          { teamName, userIds, clientId },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              setTeamName("");
              setGroupedUsers([]);
              setSelectedRole("Select a role");
            },
          }
        );
        props.setShow(false);
      } else if (props.action === "edit") {
        const userIds = groupedUsers.map((user) => user.value);
        editMutation.mutate(
          { teamId: props.teamId, teamName, userIds, clientId },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              setSelectedRole("Select a role");
            },
          }
        );
        props.setShow(false);
      }
    } else {
      setError("Make sure to fill all the inputs");
    }
  };

  return (
    <div>
      <Modal
        isOpen={props.show}
        toggle={() => {
          props.setShow(false);
        }}
      >
        <ModalHeader
          toggle={() => {
            props.setShow(false);
          }}
        >
          Create a new Team
        </ModalHeader>
        <ModalBody>
          <div>
            <InputGroup>
              <Input
                placeholder="Team name"
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
              />
            </InputGroup>
            <div style={{ marginTop: "30px" }}>
              <Container>
                <Row>
                  <Col sm="4" xs="4">
                    <label htmlFor="roles">Filter by Role :</label>
                  </Col>
                  <Col sm="8" xs="4" className="mt--2">
                    <RolesDropdown
                      setRoleId={setRoleId}
                      selectedRole={selectedRole}
                      setSelectedRole={setSelectedRole}
                    />
                  </Col>
                </Row>
              </Container>
              <div>{usersDropDown()}</div>
            </div>
            {error ? (
              <div className="text-muted font-italic">
                <small>
                  error:{" "}
                  <span className="text-red font-weight-700">{error}</span>
                </small>
              </div>
            ) : null}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              props.setShow(false);
            }}
          >
            Cancel
          </Button>
          <Button color="primary" onClick={onAddClick}>
            {props.action === "edit" ? "DONE" : "ADD"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddTeamModal;
