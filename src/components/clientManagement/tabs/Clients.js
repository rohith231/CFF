import React, { useState } from "react";
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
import searchFunctionality from "commonFunctions/searchFunctionality";
import AddClientModal from "./AddClientModal";
import { getAllClientsWithSector } from "network/ApiAxios";
import { deleteClient } from "network/ApiAxios";

const Clients = () => {
  const [searchedClient, setSearchedClient] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [banner, setBanner] = useState("");
  const [action, setAction] = useState("");
  const [sectorId, setSectorId] = useState(null);
  const [sectorName, setSectorName] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["cliWithSec"],
    getAllClientsWithSector,
    {
      select: (cliWithSec) => cliWithSec.data,
    }
  );
  const dltMutation = useMutation(deleteClient, {
    onSuccess: () => {
      queryClient.invalidateQueries("cliWithSec");
    },
  });

  const renderRows = (arr) => {
    return arr?.map((client, index) => {
      return (
        <tr key={client.id}>
          <th>{index + 1}</th>
          <td>{client.client_name}</td>
          <td>
            {client.banner ? (
              <img
                src={client.banner}
                alt="banner"
                style={{ width: "50px", height: "50px" }}
              />
            ) : (
              "no img"
            )}
          </td>
          <td>{client.sector_name}</td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                setClientId(client.id);
                setSectorId(client.sector_id);
                setClientName(client.client_name);
                setBanner(client.banner);
                setSectorName(client.sector_name);
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
                dltMutation.mutate(client.id);
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
        searchFunctionality(searchedClient, data.clients, "client_name")
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
              Add Client
            </Button>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <InputGroup className="input-group-alternative mb-3">
              <Input
                placeholder="Client name"
                type="text"
                value={searchedClient}
                onChange={(e) => {
                  setSearchedClient(e.target.value);
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
                <th scope="col">Client Name</th>
                <th scope="col">banner</th>
                <th scope="col">Sector Name</th>
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

        <AddClientModal
          show={showModal}
          setShow={setShowModal}
          clientId={clientId}
          clientName={clientName}
          banner={banner}
          sectorId={sectorId}
          sectorName={sectorName}
          action={action}
        />
      </Container>
    </>
  );
};

export default Clients;
