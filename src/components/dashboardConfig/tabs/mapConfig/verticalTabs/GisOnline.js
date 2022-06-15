import React, { useState, useEffect } from "react";
import { createNewPortal } from "network/ApiAxios";
import { useMutation } from "react-query";
import Button from "reactstrap/lib/Button";
import Container from "reactstrap/lib/Container";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Portal from "@arcgis/core/portal/Portal";
import { useHistory } from "react-router-dom";

const GisOnline = (props) => {
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [isOrg, setIsOrg] = useState(false);
  const mutation = useMutation(createNewPortal);
  const history = useHistory();
  
  useEffect(() => {
    if (orgName) {
      const runAsync = async () => {
        let portal = new Portal({
          url: `https://${orgName}.maps.arcgis.com/`,
        });
        try {
          const res = await portal.load();
          if (res && res.isOrganization) {
            setError("");
            setIsOrg(res.isOrganization);
          } else {
            setIsOrg(false);
            setError("Not a valid organization name");
          }
        } catch (error) {
          setError(error.message);
        }
      };
      runAsync();
    }
  }, [orgName]);

  const onSetClick = () => {
    if (orgName && props.roleId) {
      if (isOrg) {
        mutation.mutate(
          {
            portalName: "online",
            orgName,
            roleId: props.roleId,
          },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (data.success) {
                setError("");
                history.push("/admin/index/config/map/portalId");
              } else {
                setError(data.msg);
              }
            },
          }
        );
      }
    } else {
      setError("Make sure to fill the input");
    }
  };

  return (
    <>
      <Container className="mt-3">
        <FormGroup>
          <InputGroup>
            <Input
              placeholder="organization name"
              type="text"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
              }}
            />
          </InputGroup>
        </FormGroup>
        <div>
          {error ? (
            <div className="text-muted font-italic">
              <small>
                error: <span className="text-red font-weight-700">{error}</span>
              </small>
            </div>
          ) : null}
        </div>
        <FormGroup className="text-center">
          <Button color="primary" onClick={onSetClick}>
            SET
          </Button>
        </FormGroup>
      </Container>
    </>
  );
};

export default GisOnline;
