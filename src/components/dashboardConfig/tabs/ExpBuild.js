import config from "config";
import { createNewConfig } from "network/ApiAxios";
import { getConfigByClient } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useMutation } from "react-query";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";

const ExpBuild = () => {
  const clientId = localStorage.getItem("client_id");
  const [isAccntConfig, setIsAccntConfig] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const mutation = useMutation(createNewConfig);

  const runAsync = async () => {
    const { data } = await getConfigByClient(clientId);
    if (data) {
      if (data.success) {
        if (data.config) {
          if (data.config.username) {
            setIsAccntConfig(true);
          } else {
            setIsAccntConfig(false);
          }
        } else {
          setIsAccntConfig(false);
        }
      }
    }
  };
  useEffect(() => {
    runAsync();
  }, []);

  const renderConfigForm = () => {
    const onDoneClick = () => {
      if (username.length > 0) {
        mutation.mutate(
          { username, clientId },
          {
            onSuccess: async (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              setError("");
              runAsync();
              setUsername("");
            },
          }
        );
      } else {
        setError("Make sure to fill the input");
      }
    };
    return (
      <Card className="shadow">
        <CardHeader>
          <h2 className="text-muted">configure your account:</h2>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <InputGroup>
              <Input
                placeholder="User name"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </InputGroup>
          </FormGroup>
          {error ? (
            <div className="text-muted font-italic">
              <small>
                error: <span className="text-red font-weight-700">{error}</span>
              </small>
            </div>
          ) : null}
          <FormGroup className="text-center">
            <Button color="primary" onClick={onDoneClick}>
              Done
            </Button>
          </FormGroup>
        </CardBody>
      </Card>
    );
  };
  const renderBasedOnConfig = () => {
    if (isAccntConfig === true) {
      return <Iframe url={config.EXP_BUILD_URL} width="100%" height="650px" />;
    } else if (isAccntConfig === false) {
      return renderConfigForm();
    } else {
      return <p>Loading...</p>;
    }
  };

  return <div>{renderBasedOnConfig()}</div>;
};

export default ExpBuild;
