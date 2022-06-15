import React, { useState } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Toast from "react-bootstrap/Toast";
import { register } from "../../network/ApiAxios";
import config from "../../config";
import { useMutation } from "react-query";

const Register = (props) => {
  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prefix, setPrefix] = useState("Select title");
  const [toastMessage, setToastMessage] = useState(
    "Email sent! Check it to reset your password."
  );
  const [userID, setUserID] = useState(null);

  const roleId = props.roleId ? props.roleId : "2";
  const clientId = props.clientId ? props.clientId : "1";
  const mutation = useMutation(register);
  const registerUser = async () => {
    if (
      !(fName && userName && email && password && confirmPassword && checkbox)
    ) {
      setError(
        "Make sure to fill all the inputs and agree to the privacy policy"
      );
      return;
    }

    if (prefix === "Select title") {
      setError("Select title for user");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!roleId) {
      setError("select a role for this user");
      return;
    }
    mutation.mutate(
      {
        prefix,
        fName,
        mName,
        lName,
        userName,
        email,
        password,
        roleId,
        clientId,
      },
      {
        onSuccess: (response) => {
          const { data } = response;
          if (!data.success) {
            setError(data.msg);
            return;
          }
          if (config.DEMO) {
            setToastMessage(
              "This is a demo, so we will not send you an email. Instead, click on this link to verify your account:"
            );
            setUserID(data.userID);
          }
          setError("");
          setPrefix("Select title");
          setFName("");
          setMName("");
          setLName("");
          setUserName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setCheckbox(false);
          setShowToast(true);
        },
      }
    );
  };
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const onPrefixClick = (value) => {
    setPrefix(value);
  };

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          minHeight: "100px",
          width: "35%",
          right: 10,
          bottom: 80,
          zIndex: 50,
        }}
      >
        <Toast
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
          }}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={10000}
          autohide={!config.DEMO}
        >
          <Toast.Header>
            <img
              style={{ height: "30px", width: "100px" }}
              src={require("assets/img/brand/tech-pro.jpg").default}
              alt="..."
            />
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
            {config.DEMO ? (
              <a href={config.DOMAIN_NAME + "/auth/confirm-email/" + userID}>
                {config.DOMAIN_NAME + "/auth/confirm-email/" + userID}
              </a>
            ) : null}
          </Toast.Body>
        </Toast>
      </div>
      <Card className="bg-secondary shadow border-0">
        <CardBody>
          <div>
            <h1 className="text-center text-muted mb-3">Register</h1>
          </div>
          <hr />
          <Form role="form">
            <FormGroup>
              <Row>
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  style={{ marginLeft: "15px" }}
                >
                  <DropdownToggle caret>{prefix}</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => onPrefixClick("Mr")}>
                      Mr
                    </DropdownItem>
                    <DropdownItem onClick={() => onPrefixClick("Mrs")}>
                      Mrs
                    </DropdownItem>
                    <DropdownItem onClick={() => onPrefixClick("Miss")}>
                      Miss
                    </DropdownItem>
                    <DropdownItem onClick={() => onPrefixClick("Ms")}>
                      Ms
                    </DropdownItem>
                    <DropdownItem onClick={() => onPrefixClick("Dr")}>
                      Dr
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <div className="col-lg-4 col-sm-12">
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="First name"
                      type="text"
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Middle name"
                      type="text"
                      value={mName}
                      onChange={(e) => setMName(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Last name"
                      type="text"
                      value={lName}
                      onChange={(e) => setLName(e.target.value)}
                    />
                  </InputGroup>
                </div>
              </Row>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="User name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="new-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            {props.renderDropdown ? props.renderDropdown() : null}

            {error ? (
              <div className="text-muted font-italic">
                <small>
                  error:{" "}
                  <span className="text-red font-weight-700">{error}</span>
                </small>
              </div>
            ) : null}
            <Row className="my-4">
              <Col xs="12">
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id="customCheckRegister"
                    type="checkbox"
                    checked={checkbox}
                    onChange={() => setCheckbox(!checkbox)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customCheckRegister"
                  >
                    <span className="text-muted">
                      I agree with the{" "}
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
              </Col>
            </Row>
            <div className="text-center">
              <Button
                onClick={registerUser}
                className="mt-4"
                color="primary"
                type="button"
              >
                Create account
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default Register;
