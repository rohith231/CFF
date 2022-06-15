import React, { useState } from "react";
import PropTypes from "prop-types";
// import './Login.css';
import { Form, FormGroup, Label, Input } from "reactstrap";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Button from "reactstrap/lib/Button";
import LayerSwitcher from "ol-layerswitcher";

//{ setToken }
export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [layers, setLayers] = useState();

  async function loginUser(credentials) {
    console.log(credentials, "...credentials");
    var base64encodedData = Buffer.from(username + ":" + password).toString(
      "base64"
    );
    return fetch("http://localhost:8080/geoserver/rest/layers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + base64encodedData,
      },
      //   body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
  };

  return (
    <div>
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="exampleEmail">User Name</Label>
              <Input
                id="exampleEmail"
                name="email"
                placeholder="Geoserver user name"
                //   type="email"
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                id="examplePassword"
                name="password"
                placeholder="password "
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// };
