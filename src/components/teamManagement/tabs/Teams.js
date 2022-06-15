import { deleteTeam } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import Container from "reactstrap/lib/Container";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import AddTeamModal from "./AddTeamModal";
import { getUserTeamById } from "network/ApiAxios";
import searchFunctionality from "commonFunctions/searchFunctionality";
import { getAllTeamsByClient } from "network/ApiAxios";

const Teams = () => {
  const [searchedTeam, setSearchedTeam] = useState("");
  const [action, setAction] = useState("");
  const clientId = localStorage.getItem("client_id");
  const [teamId, setTeamId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["allTeamsByClient"],
    () => getAllTeamsByClient(clientId),
    {
      select: (allTeamsByClient) => allTeamsByClient.data,
    }
  );

  const dltMutation = useMutation(deleteTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries("allTeamsByClient");
    },
  });

  const { refetch } = useQuery(
    ["getTeamById", teamId],
    () => getUserTeamById(teamId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  useEffect(() => {
    if (teamId) {
      refetch();
    }
  }, [teamId, showModal]);

  const renderRows = (arr) => {
    return arr?.map((team, index) => {
      return (
        <tr key={team.id}>
          <th>{index + 1}</th>
          <td>{team.team_name}</td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                setTeamId(team.id);
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
                dltMutation.mutate(team.id);
              }}
            >
              <i className="fas fa-trash"></i>
            </Button>
          </td>
        </tr>
      );
    });
  };
  const renderTable = () => {
    if (isSuccess && data.success) {
      return renderRows(
        searchFunctionality(searchedTeam, data.teams, "team_name")
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
              Add Team
            </Button>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <InputGroup className="input-group-alternative mb-3">
              <Input
                placeholder="Team name"
                type="text"
                value={searchedTeam}
                onChange={(e) => {
                  setSearchedTeam(e.target.value);
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
                <th scope="col">Team Name</th>
                <th scope="col">Action</th>
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

        <AddTeamModal
          show={showModal}
          setShow={setShowModal}
          teamId={teamId}
          action={action}
        />
      </Container>
    </>
  );
};

export default Teams;
