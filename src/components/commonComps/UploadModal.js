import React, { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import { Card, ListGroup, ListGroupItem } from "reactstrap";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import iconByType from "commonFunctions/iconByType";

const UploadModal = (props) => {
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (props.show === false) {
      setError("");
    }
  }, [props.show]);

  const handleDrop = (acceptedFiles) => {
    setFiles(files.concat(acceptedFiles[0]));
  };

  const removeitem = (remove) => {
    const DeleteFile = [...files];
    DeleteFile.map((item, index) => {
      if (item.path === remove.path) {
        DeleteFile.splice(index, 1);
      }
    });
    setFiles(DeleteFile);
  };

  const bytesToKb = (bytes) => {
    return Math.round((bytes / 1024) * 100) / 100;
  };

  const onUploadClick = () => {
    if (files.length > 0) {
      props.uploadFunctionality(files, setFiles, setError);
    } else {
      setError("upload atleast one file");
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
          upload files
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="text-center mt-3">
              <Card
                className="shadow"
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    borderWidth: "3px",
                    borderStyle: "dashed",
                  }}
                  className="text-muted"
                >
                  <Dropzone onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <span style={{ fontSize: "3em" }}>
                          <FontAwesomeIcon icon={faUpload} />
                        </span>
                        <h4 className="text-muted p-2">
                          Choose a file or drop it here
                        </h4>
                      </div>
                    )}
                  </Dropzone>
                </div>
              </Card>

              <h4>Files:</h4>
              {files.map((file, index) => (
                <ListGroup key={index}>
                  <ListGroupItem>
                    <Row>
                      <Col md={2} sm={2} xs={2}>
                        <span className="border border-light rounded-circle p-2">
                          <FontAwesomeIcon icon={iconByType(file.type)} />
                        </span>
                      </Col>
                      <Col
                        md={8}
                        sm={8}
                        xs={8}
                        className="pl-0"
                        style={{ textAlign: "left" }}
                      >
                        <h5>
                          {file.name}
                          <span className="text-muted ml-2">
                            ({bytesToKb(file.size)}KB)
                          </span>
                        </h5>
                      </Col>
                      <Col md={2} sm={2} xs={2}>
                        <span
                          style={{ cursor: "pointer" }}
                          className="text-muted"
                        >
                          <FontAwesomeIcon
                            onClick={() => removeitem(file)}
                            icon={faTimes}
                          />
                        </span>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              ))}
            </div>
          </div>
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
          <Button color="primary" onClick={onUploadClick}>
            Upload
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UploadModal;
