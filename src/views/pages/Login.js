import React, { useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";

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
} from "reactstrap";
import { getActiveAvatar, login } from "../../network/ApiAxios";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const mutation = useMutation(login);

  const tryLogin = async () => {
    mutation.mutate(
      { email, password },
      {
        onSuccess: async (response) => {
          const { data } = response;
          if (data.success) {
            setError("");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("role_id", data.role_id);
            localStorage.setItem("client_id", data.client_id);
            const res = await getActiveAvatar(data.user.id);
            if (res.data.avatar) {
              localStorage.setItem("avatar", res.data.avatar.src);
            }

            props.history.push(`/admin`);
          } else {
            setPassword("");
            setError(data.msg);
          }
        },
      }
    );
  };
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <i className="ni ni-circle-08 ni-5x" />
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
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
                    autoComplete="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              {error ? (
                <div className="text-muted font-italic">
                  <small>
                    error:{" "}
                    <span className="text-red font-weight-700">{error}</span>
                  </small>
                </div>
              ) : null}
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={tryLogin}
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <Link className="text-light" to={"/auth/reset-password"}>
              <small>Forgot password?</small>
            </Link>
          </Col>
          <Col className="text-right" xs="6">
            <Link className="text-light" to={"/auth/register"}>
              <small>Try it free</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
