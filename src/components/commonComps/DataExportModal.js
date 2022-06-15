import React from "react";
import Select from "react-select";
import Button from "reactstrap/lib/Button";
import FormGroup from "reactstrap/lib/FormGroup";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

const DataExportModal = (props) => {
  const dataOps = [
    { value: "chocolate", label: "All Data" },
    { value: "strawberry", label: "Data Subset" },
  ];
  const teamsOps = [
    { value: "chocolate", label: "Field Team 1" },
    { value: "vanilla", label: "Field Team 2" },
    { value: "strawberry", label: "Inspection Team" },
  ];
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
          Data Export
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Select placeholder="Select Data" options={dataOps} />
          </FormGroup>

          <FormGroup>
            <Select placeholder="Select a Team" options={teamsOps} />
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
            Publish
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DataExportModal;
