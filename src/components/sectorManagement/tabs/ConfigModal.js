import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Label from "reactstrap/lib/Label";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

const ConfigModal = (props) => {
  const [error, setError] = useState("");
  const [parameters, setParameters] = useState([{ parameter: "" }]);

  const removeFuncFields = (i) => {
    let newParameters = [...parameters];
    newParameters.splice(i, 1);
    setParameters(newParameters);
  };
  const addFuncFields = () => {
    setParameters([...parameters, { parameter: "" }]);
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
          Config Microservice
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <InputGroup>
              <Input placeholder="Integrate micro service" type="text" />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label>Set parameters</Label>
          </FormGroup>

          {parameters.map((parameter, index) => {
            return (
              <InputGroup key={index} className="mb-2">
                <Input placeholder="parameter" type="text" />
                {index ? (
                  <Button size="sm" onClick={() => removeFuncFields(index)}>
                    <i className="fas fa-minus"></i>
                  </Button>
                ) : null}
              </InputGroup>
            );
          })}
          <FormGroup>
            <Button color="primary" size="sm" onClick={() => addFuncFields()}>
              add more..
            </Button>
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
          <Button color="primary">SET</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConfigModal;
