import { createNewFolder } from "network/ApiAxios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Button from "reactstrap/lib/Button";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

const AddFolderModal = (props) => {
  const [error, setError] = useState("");
  const [folderName, setFolderName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(createNewFolder, {
    onSuccess: () => {
      queryClient.invalidateQueries("foldersByParent");
    },
  });
  // const editMutation = useMutation(editRoleById, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["dbRolesByClient"]);
  //   },
  // });
  // useEffect(() => {
  //   if (props.action === "edit") {
  //     setFolderName(props.folderName);
  //   } else if (props.action === "add") {
  //     setFolderName("");
  //   }
  // }, [props.action, props.folderId, props.show]);
  // useEffect(() => {
  //   if (props.show === false) {
  //     setError("");
  //   }
  // }, [props.show]);

  const onActionClick = () => {
    if (folderName) {
      if (props.action === "add") {
        mutation.mutate(
          {
            folderPath: `${props.folderPath}/${folderName}`,
            parentId: props.parentId,
          },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              setFolderName("");
            },
          }
        );
        props.setShow(false);
      }
      //  else if (props.action === "edit") {
      //   editMutation.mutate(
      //     { folderId: props.folderId, folderName },
      //     {
      //       onSuccess: (response) => {
      //         const { data } = response;
      //         if (!data.success) {
      //           setError(data.msg);
      //           return;
      //         }
      //         setError("");
      //         setFolderName("");
      //       },
      //     }
      //   );
      //   props.setShow(false);
      // }
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
          Create a new client
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <InputGroup>
              <Input
                placeholder="Folder name"
                type="text"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                }}
              />
            </InputGroup>
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
          <Button color="primary" onClick={onActionClick}>
            {props.action === "edit" ? "DONE" : "ADD"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddFolderModal;
