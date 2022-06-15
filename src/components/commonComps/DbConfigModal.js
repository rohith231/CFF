import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

const DbConfigModal = (props) => {
  const [nullValid, setNullValid] = useState(true);
  const [typoValid, setTypoValid] = useState(true);
  const [missngValid, setMissngValid] = useState(true);
  const [srcFldValid, setSrcFldValid] = useState(true);
  return (
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
        Configuration
      </ModalHeader>
      <ModalBody>
        <FormGroup check>
          <Input
            type="checkbox"
            checked={nullValid}
            onChange={() => {
              setNullValid(!nullValid);
            }}
          />
          <Label check>Null Validation</Label>
        </FormGroup>
        <FormGroup check>
          <Input
            type="checkbox"
            checked={typoValid}
            onChange={() => {
              setTypoValid(!typoValid);
            }}
          />
          <Label check>Typo Validation</Label>
        </FormGroup>
        <FormGroup check>
          <Input
            type="checkbox"
            checked={missngValid}
            onChange={() => {
              setMissngValid(!missngValid);
            }}
          />
          <Label check>Missing Data Validation</Label>
        </FormGroup>
        <FormGroup check>
          <Input
            type="checkbox"
            checked={srcFldValid}
            onChange={() => {
              setSrcFldValid(!srcFldValid);
            }}
          />
          <Label check>Source_Field compare Validation</Label>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            props.setShow(false);
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            props.setShow(false);
          }}
        >
          Edit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DbConfigModal;
