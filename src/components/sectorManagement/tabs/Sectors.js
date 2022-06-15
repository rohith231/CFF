import React, { useState } from "react";
import AddSectorModal from "./AddSectorModal";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import Container from "reactstrap/lib/Container";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { getAllSectors } from "network/ApiAxios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import searchFunctionality from "commonFunctions/searchFunctionality";
import { deleteSector } from "network/ApiAxios";

const Sectors = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchedSector, setSearchedSector] = useState("");
  const [action, setAction] = useState("");
  const [sectorId, setSectorId] = useState(null);
  const [sectorName, setSectorName] = useState("");
  const [sectorCode, setSectorCode] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["allSectors"],
    getAllSectors,
    {
      select: (allSectors) => allSectors.data,
    }
  );

  const dltMutation = useMutation(deleteSector, {
    onSuccess: () => {
      queryClient.invalidateQueries("allSectors");
    },
  });

  const renderRows = (arr) => {
    return arr?.map((sector, index) => {
      return (
        <tr key={sector.id}>
          <th>{index + 1}</th>
          <td>{sector.sector_name}</td>
          <td>{sector.sector_code}</td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                setSectorId(sector.id);
                setSectorName(sector.sector_name);
                setSectorCode(sector.sector_code);
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
                dltMutation.mutate(sector.id);
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
        searchFunctionality(searchedSector, data.sectors, "sector_name")
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
              Add Sector
            </Button>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <InputGroup className="input-group-alternative mb-3">
              <Input
                placeholder="Sector name"
                type="text"
                value={searchedSector}
                onChange={(e) => {
                  setSearchedSector(e.target.value);
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
                <th scope="col">Sector Name</th>
                <th scope="col">Sector Code</th>
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

        <AddSectorModal
          show={showModal}
          sectorId={sectorId}
          sectorCode={sectorCode}
          sectorName={sectorName}
          setShow={setShowModal}
          action={action}
        />
      </Container>
    </>
  );
};

export default Sectors;
