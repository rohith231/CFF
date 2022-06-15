import SectorsDropdown from "components/commonComps/SectorsDropdown";
import { createNewGroupFunctionality } from "network/ApiAxios";
import { editFunctionalitiesWithSectorId } from "network/ApiAxios";
import { editFuncFuncgroupsWithSectorId } from "network/ApiAxios";
import { getFuncsByFuncgroupId } from "network/ApiAxios";
import { createNewFunctionality } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from "reactstrap";
import Button from "reactstrap/lib/Button";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Label from "reactstrap/lib/Label";
import ModalHeader from "reactstrap/lib/ModalHeader";

const AddFunctionalityModal = (props) => {
  const [funcGroup, setFuncGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [funcNames, setFuncNames] = useState([{ funcName: "", funcLabel: "" }]);
  const [funcName, setFuncName] = useState("");
  const [funcLabel, setFuncLabel] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [selectedSector, setSelectedSector] = useState("Select a sector");

  const queryClient = useQueryClient();
  //for post
  const mutation = useMutation(createNewFunctionality, {
    onSuccess: () => {
      queryClient.invalidateQueries("allFuncsFuncgroups");
    },
  });
  const groupMutation = useMutation(createNewGroupFunctionality, {
    onSuccess: () => {
      queryClient.invalidateQueries("allFuncsFuncgroups");
    },
  });
  //for put
  const editMutation = useMutation(editFunctionalitiesWithSectorId, {
    onSuccess: () => {
      queryClient.invalidateQueries("allFuncsFuncgroups");
    },
  });
  const editGroupMutation = useMutation(editFuncFuncgroupsWithSectorId, {
    onSuccess: () => {
      queryClient.invalidateQueries("allFuncsFuncgroups");
    },
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (props.action === "edit") {
      setFuncName(props.funcName);
      setSectorId(props.sectorId);
      setFuncLabel(props.funcLabel);
      setSelectedSector(props.selectedSector);
      setFuncGroup(props.isFuncGroup);
      setGroupName(props.groupName);
    } else if (props.action === "add") {
      setFuncName("");
      setSectorId("");
      setFuncLabel("");
      setFuncGroup(false);
      setFuncNames([{ funcName: "", funcLabel: "" }]);
      setSelectedSector("Select a sector");
      setGroupName("");
    }
  }, [props.action, props.show]);

  useEffect(() => {
    if (props.show === false) {
      setFuncGroup(false);
      setFuncNames([{ funcName: "", funcLabel: "" }]);
      props.setAction("");
      setError("");
    }
  }, [props.show]);

  useEffect(() => {
    const runAsync = async () => {
      const res = await getFuncsByFuncgroupId(props.funcgroupId);
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.funcsByFuncgroupId.length > 0) {
              const funcs = res.data.funcsByFuncgroupId;
              var tempFuncs = funcs.map((func) => ({
                funcId: func.id,
                funcName: func.functionality_name,
                funcLabel: func.functionality_label,
              }));
              setFuncNames(tempFuncs);
            }
          }
        }
      }
    };
    if (props.action === "edit") {
      if (props.groupName !== "ungrouped") {
        runAsync();
      }
    }
  }, [props.action]);

  const onAddClick = () => {
    if (funcGroup) {
      if (
        groupName &&
        sectorId &&
        funcNames.every(
          (element) =>
            element.funcName.length > 0 && element.funcLabel.length > 0
        )
      ) {
        if (props.action === "add") {
          groupMutation.mutate(
            { groupName, funcNames, sectorId },
            {
              onSuccess: (response) => {
                const { data } = response;
                if (!data.success) {
                  setError(data.msg);
                  return;
                }
                setError("");
                setGroupName("");
                setFuncNames([{ funcName: "", funcLabel: "" }]);
                setSelectedSector("Select a sector");
                props.setShow(false);
              },
            }
          );
        } else if (props.action === "edit") {
          editGroupMutation.mutate(
            { groupName, funcNames, sectorId, groupId: props.funcgroupId },
            {
              onSuccess: (response) => {
                const { data } = response;
                if (!data.success) {
                  setError(data.msg);
                  return;
                }
                setError("");
                setGroupName("");
                setFuncNames([{ funcName: "", funcLabel: "" }]);
                setSelectedSector("Select a sector");
                props.setShow(false);
              },
            }
          );
        }
      } else {
        setError("Make sure to fill all the inputs");
        return;
      }
    } else {
      if (funcName && sectorId && funcLabel) {
        if (props.action === "add") {
          mutation.mutate(
            { funcName, funcLabel, sectorId },
            {
              onSuccess: (response) => {
                const { data } = response;
                if (!data.success) {
                  setError(data.msg);
                  return;
                }
                setError("");
                setFuncName("");
                setFuncLabel("");
                setSelectedSector("Select a sector");
                props.setShow(false);
              },
            }
          );
        } else if (props.action === "edit") {
          editMutation.mutate(
            { funcName, funcLabel, sectorId, funcId: props.funcId },
            {
              onSuccess: (response) => {
                const { data } = response;
                if (!data.success) {
                  setError(data.msg);
                  return;
                }
                setError("");
                setFuncName("");
                setFuncLabel("");
                setSelectedSector("Select a sector");
                props.setShow(false);
              },
            }
          );
        }
      } else {
        setError("Make sure to fill all the inputs");
        return;
      }
    }
  };

  const singleFunctionality = () => {
    return (
      <>
        <FormGroup>
          <InputGroup>
            <Input
              placeholder="Functionality name"
              type="text"
              value={funcName}
              onChange={(e) => {
                setFuncName(e.target.value);
              }}
            />
            <Input
              placeholder="Functionality label"
              type="text"
              value={funcLabel}
              onChange={(e) => {
                setFuncLabel(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  };

  const groupFunctionalities = () => {
    const handleFuncInputChange = (i, e) => {
      let newFuncNames = [...funcNames];
      newFuncNames[i][e.target.name] = e.target.value;
      setFuncNames(newFuncNames);
    };
    const removeFuncFields = (i) => {
      let newFuncNames = [...funcNames];
      newFuncNames.splice(i, 1);
      setFuncNames(newFuncNames);
    };
    const addFuncFields = () => {
      setFuncNames([...funcNames, { funcName: "", funcLabel: "" }]);
    };
    return (
      <>
        <FormGroup>
          <InputGroup>
            <Input
              placeholder="Group name"
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          {funcNames.map((element, index) => {
            return (
              <InputGroup key={index} className="mb-2">
                <Input
                  placeholder="Functionality name"
                  type="text"
                  name="funcName"
                  value={element.funcName}
                  onChange={(e) => {
                    handleFuncInputChange(index, e);
                  }}
                />
                <Input
                  placeholder="Functionality label"
                  type="text"
                  name="funcLabel"
                  value={element.funcLabel}
                  onChange={(e) => {
                    handleFuncInputChange(index, e);
                  }}
                />
                {index ? (
                  <Button size="sm" onClick={() => removeFuncFields(index)}>
                    <i className="fas fa-minus"></i>
                  </Button>
                ) : null}
              </InputGroup>
            );
          })}
        </FormGroup>
        <FormGroup>
          <Button color="primary" size="sm" onClick={() => addFuncFields()}>
            add more..
          </Button>
        </FormGroup>
      </>
    );
  };
  const shouldCreateGroupFuncRender = () => {
    if (props.action === "add") {
      return (
        <FormGroup style={{ marginLeft: 20 }}>
          <Input
            type="checkbox"
            value={"funcGroup"}
            checked={funcGroup}
            onChange={() => {
              setFuncGroup((prevState) => !prevState);
            }}
          />
          <Label check>Create group of Functionalities</Label>
        </FormGroup>
      );
    } else if (props.action === "edit") {
      return null;
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
          Create a new Functionality
        </ModalHeader>
        <ModalBody>
          {shouldCreateGroupFuncRender()}

          {funcGroup ? groupFunctionalities() : singleFunctionality()}
          <FormGroup>
            <SectorsDropdown
              setSectorId={setSectorId}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
            />
          </FormGroup>
          {error ? (
            <div className="text-muted font-italic">
              <small>
                error: <span className="text-red font-weight-700">{error}</span>
              </small>
            </div>
          ) : null}
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

export default AddFunctionalityModal;
