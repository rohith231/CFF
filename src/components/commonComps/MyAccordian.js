import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

const MyAccordian = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb--4">
      <Card>
        <CardHeader onClick={() => setIsOpen((prevState) => !prevState)}>
          <Row className="font-weight-bold">
            <Col sm="3" xs="2">
              <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
            </Col>
            <Col sm="9" xs="10" style={{ textAlign: "start" }}>
              {" "}
              {props.accHeader}
            </Col>
          </Row>
        </CardHeader>
        <Collapse isOpen={isOpen}>
          <CardBody className="ml--2">{props.accBody()}</CardBody>
        </Collapse>
      </Card>
    </div>
  );
};

export default MyAccordian;
