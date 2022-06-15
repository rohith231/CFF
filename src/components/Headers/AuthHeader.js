import React from "react";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";

const AuthHeader = (props) => {
  const renderByPath = () => {
    if (props.pathname === "/auth/register") {
      return (
        <p className="text-lead text-light">
          Try our free trail version for 15 days.
        </p>
      );
    } else {
      return null;
    }
  };
  return (
    <Container>
      <div className="header-body text-center mb-6">
        <Row className="justify-content-center">
          <Col lg="5" md="6">
            <h1 className="text-white ">Welcome!</h1>
            {renderByPath()}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AuthHeader;
