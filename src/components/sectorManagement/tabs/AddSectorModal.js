import { editSectorById } from "network/ApiAxios";
import { createNewSector } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from "reactstrap";
import Button from "reactstrap/lib/Button";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import ModalHeader from "reactstrap/lib/ModalHeader";

const AddSectorModal = (props) => {
  const [sectorName, setSectorName] = useState("");
  const [sectorCode, setSectorCode] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation(createNewSector, {
    onSuccess: () => {
      queryClient.invalidateQueries("allSectors");
    },
  });
  const editMutation = useMutation(editSectorById, {
    onSuccess: () => {
      queryClient.invalidateQueries(["allSectors"]);
    },
  });
  useEffect(() => {
    if (props.action === "edit") {
      setSectorName(props.sectorName);
      setSectorCode(props.sectorCode);
    } else if (props.action === "add") {
      setSectorName("");
      setSectorCode("");
    }
  }, [props.action, props.sectorCode, props.show]);
  useEffect(() => {
    if (props.show === false) {
      setError("");
    }
  }, [props.show]);

  const onAddClick = () => {
    if (sectorName && sectorCode) {
      if (props.action === "add") {
        mutation.mutate(
          { sectorName, sectorCode },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              setSectorName("");
              setSectorCode("");
            },
          }
        );
        props.setShow(false);
      } else if (props.action === "edit") {
        editMutation.mutate(
          { sectorId: props.sectorId, sectorName, sectorCode },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
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
          Create a new Sector
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
              placeholder="Sector name"
              type="text"
              value={sectorName}
              onChange={(e) => {
                setSectorName(e.target.value);
              }}
            />
          </InputGroup>
          <br />
          <InputGroup>
            <Input
              placeholder="Sector Code"
              type="text"
              value={sectorCode}
              onChange={(e) => {
                setSectorCode(e.target.value);
              }}
            />
          </InputGroup>
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

export default AddSectorModal;
