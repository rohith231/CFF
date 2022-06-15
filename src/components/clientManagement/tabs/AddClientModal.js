import SectorsDropdown from "components/commonComps/SectorsDropdown";
import { editClientById } from "network/ApiAxios";
import { updateBanner } from "network/ApiAxios";
import { createNewClient } from "network/ApiAxios";
import React, { useState, useEffect } from "react";
import { ModalBody, ModalFooter } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from "reactstrap";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";

const AddClientModal = (props) => {
  const [clientName, setClientName] = useState("");
  const [sectorId, setSectorId] = useState(null);
  const [banner, setBanner] = useState(null);
  const [selectedSector, setSelectedSector] = useState("Select a sector");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState();
  const queryClient = useQueryClient();
  const mutation = useMutation(createNewClient, {
    onSuccess: () => {
      queryClient.invalidateQueries("cliWithSec");
    },
  });
  const editMutation = useMutation(editClientById, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cliWithSec"]);
    },
  });

  const bannerMutation = useMutation(updateBanner, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cliWithSec"]);
    },
  });

  useEffect(() => {
    if (props.action === "edit") {
      setClientName(props.clientName);
      setSectorId(props.sectorId);
      setSelectedSector(props.sectorName);
    } else if (props.action === "add") {
      setClientName("");
      setSectorId(null);
      setBanner(null);
      setSelectedSector("Select a sector");
    }
  }, [props.action, props.clientId, props.show]);
  useEffect(() => {
    if (props.show === false) {
      setSelectedSector("Select a sector");
      setBanner(null);
      setError("");
    }
  }, [props.show]);

  useEffect(() => {
    if (!banner) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(banner);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [banner]);

  const onAddClick = () => {
    if (clientName && sectorId && banner) {
      const formData = new FormData();
      formData.append("banner", banner);
      if (props.action === "add") {
        mutation.mutate(
          { clientName, sectorId },
          {
            onSuccess: async (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              bannerMutation.mutate({
                clientId: data.clientId,
                banner: formData,
              });
              setError("");
              setClientName("");
              setBanner(null);
              setSelectedSector("Select a sector");
            },
          }
        );
        props.setShow(false);
      } else if (props.action === "edit") {
        editMutation.mutate(
          { clientId: props.clientId, clientName, sectorId },
          {
            onSuccess: async (response) => {
              const { data } = response;
              if (!data.success) {
                setError(data.msg);
                return;
              }
              bannerMutation.mutate({
                clientId: props.clientId,
                banner: formData,
              });
              setError("");
              setSelectedSector("Select a sector");
            },
          }
        );
        props.setShow(false);
      }
    } else {
      setError("Make sure to fill all the inputs");
    }
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
          Create a new client
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <InputGroup>
              <Input
                placeholder="Client name"
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                }}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <p className="ml-2">
              {props.action === "edit" ? "change banner:" : "select baner:"}{" "}
            </p>
            <Row>
              <Col sm="8">
                <Input
                  accept="image/*"
                  type="file"
                  className="form-control"
                  name="banner"
                  id="bannerImg"
                  onChange={(e) => {
                    setBanner(e.target.files[0]);
                  }}
                />
              </Col>
              <Col sm="4">
                <img
                  src={
                    props.action === "edit"
                      ? banner
                        ? preview
                        : props.banner
                      : banner
                      ? preview
                      : null
                  }
                  alt="logo"
                  style={{ width: "50px", height: "50px" }}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <SectorsDropdown
              setSectorId={setSectorId}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
            />
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
          <Button color="primary" onClick={onAddClick}>
            {props.action === "edit" ? "DONE" : "ADD"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddClientModal;
