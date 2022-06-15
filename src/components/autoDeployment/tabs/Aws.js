import React from "react";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";

const Aws = () => {
  return (
    <>
      <Card className="shadow">
        <CardHeader>
          <h2 className="text-muted">Connection params:</h2>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <InputGroup>
              <Input placeholder="Secret Key" type="text" />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup>
              <Input placeholder="Access Key" type="text" />
            </InputGroup>
          </FormGroup>
          <FormGroup className="text-center">
            <Button color="primary">Next</Button>
          </FormGroup>
        </CardBody>
      </Card>
    </>
  );
};

export default Aws;
