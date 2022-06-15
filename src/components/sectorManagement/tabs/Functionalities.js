import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import Container from "reactstrap/lib/Container";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import searchFunctionality from "commonFunctions/searchFunctionality";
import AddFunctionalityModal from "./AddFunctionalityModal";
import { deleteFunctionality } from "network/ApiAxios";
import { getAllFuncsFuncgroups } from "network/ApiAxios";
import ConfigModal from "./ConfigModal";

const Functionalities = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchedFunc, setSearchedFunc] = useState("");
  const queryClient = useQueryClient();
  const [action, setAction] = useState("");

  const [isFuncGroup, setIsFuncGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [funcName, setFuncName] = useState("");
  const [funcId, setFuncId] = useState("");
  const [funcLabel, setFuncLabel] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [selectedSector, setSelectedSector] = useState("Select a sector");
  const [funcgroupId, setFuncGroupId] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery(
    ["allFuncsFuncgroups"],
    getAllFuncsFuncgroups,
    {
      select: (allFuncsFuncgroups) => allFuncsFuncgroups.data,
    }
  );

  const dltMutation = useMutation(deleteFunctionality, {
    onSuccess: () => {
      queryClient.invalidateQueries("allFuncsFuncgroups");
    },
  });

  const renderRows = (arr) => {
    return arr?.map((func, index) => {
      return (
        <tr key={func.id}>
          <th>{index + 1}</th>
          <td>{func.functionality_label}</td>
          <td>{func.sector_name}</td>
          <td>{func.group_name}</td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                setShowConfigModal(true);
              }}
            >
              <FontAwesomeIcon icon={faClipboardCheck} />
            </Button>
          </td>
          <td>
            <Button
              color="primary"
              className="rounded-circle"
              size="sm"
              onClick={() => {
                if (func.group_name === "ungrouped") {
                  setIsFuncGroup(false);
                  setFuncId(func.functionality_id);
                  setFuncName(func.functionality_name);
                  setFuncLabel(func.functionality_label);
                } else {
                  setIsFuncGroup(true);
                  setFuncId("");
                  setFuncName("");
                  setFuncLabel("");
                }
                setGroupName(func.group_name);
                setSectorId(func.sector_id);
                setSelectedSector(func.sector_name);
                setFuncGroupId(func.functionalgroup_id);
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
                dltMutation.mutate(func.functionality_id);
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
        searchFunctionality(
          searchedFunc,
          data.functionalities,
          "functionality_label"
        )
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
              Add Functionality
            </Button>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <InputGroup className="input-group-alternative mb-3">
              <Input
                placeholder="Functionality name"
                type="text"
                value={searchedFunc}
                onChange={(e) => {
                  setSearchedFunc(e.target.value);
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
                <th scope="col">Functionality Name</th>
                <th scope="col">Sector Name</th>
                <th scope="col">Group Name</th>
                <th scope="col">Micro service config</th>
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

        <AddFunctionalityModal
          funcName={funcName}
          funcId={funcId}
          sectorId={sectorId}
          funcLabel={funcLabel}
          selectedSector={selectedSector}
          isFuncGroup={isFuncGroup}
          groupName={groupName}
          funcgroupId={funcgroupId}
          show={showModal}
          setShow={setShowModal}
          action={action}
          setAction={setAction}
        />
        <ConfigModal show={showConfigModal} setShow={setShowConfigModal} />
      </Container>
    </>
  );
};

export default Functionalities;
