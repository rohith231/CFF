import React, { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import Input from "reactstrap/lib/Input";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

const DbPsswdModal = (props) => {
  const [psswd, setPsswd] = useState("");

  useEffect(() => {
    const dbDetails = props.dbNames.find((db) => db.datname === props.dbName);
    if (dbDetails?.psswd) {
      setPsswd(dbDetails.psswd);
    } else {
      setPsswd("");
    }
  }, [props.dbName]);

  const onSaveClick = () => {
    const temp = props.dbNames.map((db) => {
      if (db.datname === props.dbName) {
        return { ...db, psswd: psswd };
      } else {
        return db;
      }
    });
    props.setDbNames(temp);
    props.setShow(false);
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
          {props.dbName}
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Enter Password"
            type="text"
            value={psswd}
            onChange={(e) => {
              setPsswd(e.target.value);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              props.setShow(false);
            }}
          >
            Cancel
          </Button>
          <Button color="primary" onClick={onSaveClick}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DbPsswdModal;
