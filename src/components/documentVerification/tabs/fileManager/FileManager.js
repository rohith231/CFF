import {
  faChevronLeft,
  faFileUpload,
  faFolder,
  faFolderPlus,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import iconByType from "commonFunctions/iconByType";
import UploadModal from "components/commonComps/UploadModal";
import { createRootFolder } from "network/ApiAxios";
import { getFilesByParent } from "network/ApiAxios";
import { getFoldersByParent } from "network/ApiAxios";
import { getRootFolderByClient } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import AddFolderModal from "./AddFolderModal";
import { useMutation, useQueryClient } from "react-query";
import { fileUpload } from "network/ApiAxios";

const FileManager = () => {
  const [objects, setObjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const clientId = localStorage.getItem("client_id");
  const [parentId, setParentId] = useState();
  const [folderPath, setFolderPath] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation(fileUpload);

  useEffect(() => {
    const runAsync = async () => {
      const { data } = await getRootFolderByClient(clientId);
      if (data) {
        if (data.rootId) {
          setParentId(data.rootId);
        } else {
          const res = await createRootFolder(clientId);
          if (res.data) {
            setParentId(res.data.folderId);
          }
        }
      }
    };
    runAsync();
  }, []);

  const { data } = useQuery(
    ["foldersByParent", parentId],
    () => getFoldersByParent(parentId),
    {
      select: (foldersByParent) => foldersByParent.data,
    }
  );
  const { data: fileData } = useQuery(
    ["filesByParent", parentId],
    () => getFilesByParent(parentId),
    {
      select: (filesByParent) => filesByParent.data,
    }
  );
  let timer;
  const onObjectClick = (event, folderId, folderpath, backId) => {
    clearTimeout(timer);
    if (event.detail === 1) {
      timer = setTimeout(() => {
      }, 200);
    } else if (event.detail === 2) {
      setParentId(folderId);
      setFolderPath(folderpath);
    }
  };

  const renderFolders = () => {
    if (data) {
      if (data.folders) {
        return data.folders.map((folder) => {
          return (
            <Row key={folder.id}>
              <Col
                sm="10"
                xs="8"
                className="p-2"
                onClick={(event) =>
                  onObjectClick(
                    event,
                    folder.id,
                    folder.folder_path,
                    folder.parent_id
                  )
                }
                style={{ textAlign: "start" }}
              >
                <span
                  style={{ fontSize: "20px", color: "#ffeb3b" }}
                  className="px-2"
                >
                  <FontAwesomeIcon icon={faFolder} />
                </span>
                {getFolderName(folder.folder_path)}
              </Col>
              <Col sm="2" xs="4" className="p-2">
                <Button color="primary" className="rounded-circle" size="sm">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
                <Button color="primary" className="rounded-circle" size="sm">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Col>
            </Row>
          );
        });
      }
    }
  };

  const getFolderName = (filePath) => {
    const tempArr = filePath.split("/");
    return tempArr.at(-1);
  };
  const renderFiles = () => {
    if (fileData) {
      if (fileData.files) {
        return fileData.files.map((file) => {
          return (
            <Row key={file.id}>
              <Col
                sm="10"
                xs="8"
                className="p-2"
                style={{ textAlign: "start" }}
              >
                <span style={{ fontSize: "20px" }} className="px-2">
                  <FontAwesomeIcon icon={iconByType(file.type)} />
                </span>
                {file.file_name}
              </Col>
              <Col sm="2" xs="4" className="p-2">
                <Button color="primary" className="rounded-circle" size="sm">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
                <Button color="primary" className="rounded-circle" size="sm">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Col>
            </Row>
          );
        });
      }
    }
  };

  const addFolderClick = () => {
    setAction("add");
    setShowModal(true);
  };

  const uploadFunctionality = (files, setFiles, setError) => {
    if (parentId) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folderId", parentId);
      formData.append("folderPath", folderPath);
      mutation.mutate(formData, {
        onSuccess: (response) => {
          const { data } = response;
          if (!data.success) {
            setError(data.msg);
            return;
          }
          setShowUploadModal(false);
          setFiles([]);
          queryClient.invalidateQueries(["filesByParent", parentId]);
        },
      });
    }
  };

  return (
    <div>
      <Container fluid>
        <div className="text-center mt-3">
          <Card className="shadow">
            <CardHeader style={{ paddingTop: "5px", paddingBottom: "0px" }}>
              <Row>
                <Col style={{ textAlign: "start" }}>
                  <span style={{ fontSize: "25px" }}>
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (data.backId) {
                          setParentId(data.backId);
                        }
                      }}
                    />
                  </span>
                  {/* <span style={{ fontSize: "25px", marginLeft: "8px" }}>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ cursor: "pointer" }}
                      
                    />
                  </span> */}
                </Col>
                <Col style={{ textAlign: "end" }}>
                  <span style={{ fontSize: "30px" }}>
                    <FontAwesomeIcon
                      icon={faFolderPlus}
                      style={{ cursor: "pointer" }}
                      onClick={addFolderClick}
                    />
                  </span>
                  <span style={{ fontSize: "28px", marginLeft: "8px" }}>
                    <FontAwesomeIcon
                      onClick={() => {
                        setShowUploadModal(true);
                      }}
                      icon={faFileUpload}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                </Col>
              </Row>
            </CardHeader>
            <CardBody
              style={{
                padding: "0px 15px 0px 15px",
              }}
            >
              {renderFolders()}
              {renderFiles()}
            </CardBody>
          </Card>
        </div>
      </Container>
      <AddFolderModal
        show={showModal}
        setShow={setShowModal}
        action={action}
        setObjects={setObjects}
        objects={objects}
        parentId={parentId}
        folderPath={folderPath}
      />
      <UploadModal
        show={showUploadModal}
        setShow={setShowUploadModal}
        uploadFunctionality={uploadFunctionality}
      />
    </div>
  );
};

export default FileManager;
