import { editRoleById } from "network/ApiAxios";
import { createNewRole } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from "reactstrap";
import Button from "reactstrap/lib/Button";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import ModalHeader from "reactstrap/lib/ModalHeader";

const AddRoleModal = (props) => {
  const [roleName, setRoleName] = useState("");
  const clientId = localStorage.getItem("client_id");
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const mutation = useMutation(createNewRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("dbRolesByClient");
    },
  });
  const editMutation = useMutation(editRoleById, {
    onSuccess: () => {
      queryClient.invalidateQueries(["dbRolesByClient"]);
    },
  });

  useEffect(() => {
    if (props.action === "edit") {
      setRoleName(props.roleName);
    } else if (props.action === "add") {
      setRoleName("");
    }
  }, [props.action, props.roleId, props.show]);

  useEffect(() => {
    if (props.show === false) {
      setError("");
    }
  }, [props.show]);

  const onAddClick = () => {
    if (roleName) {
      if (props.action === "add") {
        mutation.mutate(
          { roleName, clientId },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              setRoleName("");
            },
          }
        );
        props.setShow(false);
      } else if (props.action === "edit") {
        editMutation.mutate(
          { roleId: props.roleId, roleName },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              setRoleName("");
            },
          }
        );
        props.setShow(false);
      }
    } else {
      setError("Make sure to fill the input");
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
          Create a new Role
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
              placeholder="Role name"
              type="text"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
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

export default AddRoleModal;
