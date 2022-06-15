import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import { getFuncsFuncgroupsByRoleId } from "network/ApiAxios";
import MyAccordian from "components/commonComps/MyAccordian";
import { funcContext } from "GlobalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faGlasses } from "@fortawesome/free-solid-svg-icons";
import Card from "reactstrap/lib/Card";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import AlertModal from "./modals/AlertModal";
import UploadModal from "components/commonComps/UploadModal";
import { dbUsersFileUpload } from "network/ApiAxios";
import DataExportModal from "components/commonComps/DataExportModal";
import { useHistory } from "react-router-dom";

const FunctionalityBar = () => {
  const [groups, setGroups] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDataExportModal, setShowDataExportModal] = useState(false);
  const [title, setTitle] = useState("");
  const roleId = localStorage.getItem("role_id");
  const [state, dispatch] = useContext(funcContext);
  const mutation = useMutation(dbUsersFileUpload);
  const { data, isSuccess } = useQuery(
    ["funcsfuncgroupsByRole", roleId],
    () => getFuncsFuncgroupsByRoleId(roleId),
    {
      select: (funcsfuncgroupsByRole) => funcsfuncgroupsByRole.data,
    }
  );
  let history = useHistory();
  useEffect(() => {
    if (data) {
      let newGroup = {};
      data.funcsFuncgroups?.forEach((item) => {
        if (newGroup[item.group_name]) {
          newGroup[item.group_name] = [
            ...newGroup[item.group_name],
            {
              funcName: item.functionality_name,
              funcLabel: item.functionality_label,
              funcId: item.id,
            },
          ];
        } else {
          newGroup[item.group_name] = [
            {
              funcName: item.functionality_name,
              funcLabel: item.functionality_label,
              funcId: item.id,
            },
          ];
        }
      });
      setGroups(newGroup);
    }
  }, [data]);

  const renderList = () => {
    console.log(" ---------> outer func <---------------")
    const onUngroupedFuncClick = (func) => {
      console.log(func, " --------------------> func")
      if (func.funcName === "upload") {
        setShowUploadModal(true);
      } else if (func.funcName === "fieldValidation") {
        dispatch({ type: "toggleFuncs", payload: func.funcName });
      } else if (func.funcName === "dataExport") {
        setShowDataExportModal(true);
      } else if (func.funcName === "primaryValidation") {
        dispatch({ type: "toggleFuncs", payload: func.funcName });
      } else if (func.funcName === "ml Predictions") {
        history.push("/admin/ml-prediction");
      }
      else {
        setTitle(func.funcName);
        setShowModal(true);
      }
    };

    const onGroupedFuncClick = (func) => {
      setTitle(func.funcName);
      setShowModal(true);
    };

    let listItems = [];
    for (const key in groups) {
      if (key === "ungrouped") {
        listItems.push(
          ...groups[key].map((func) => {
            return (
              <ListGroupItem
                key={func.funcId}
                onClick={() => onUngroupedFuncClick(func)}
                style={
                  state[func.funcName]
                    ? {
                      backgroundColor: "#b2dfdb",
                      border: "solid 1px #80cbc4",
                    }
                    : {}
                }
              >
                <Row>
                  <Col sm="3" xs="2">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-5" />
                  </Col>
                  <Col sm="9" xs="10" style={{ textAlign: "start" }}>
                    {" "}
                    {func.funcLabel} 
                  </Col>
                </Row>
              </ListGroupItem>
            );
          })
        );
      } else {
        const accBody = () => {
          return groups[key].map((func) => {
            return (
              <ListGroupItem
                key={func.funcId}
                onClick={() => onGroupedFuncClick(func)}
                style={
                  state[func.funcName]
                    ? {
                      backgroundColor: "#b2dfdb",
                      border: "solid 1px #80cbc4",
                    }
                    : {}
                }
              >
                <Row>
                  <Col sm="3" xs="2">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-5" />
                  </Col>
                  <Col sm="9" xs="10" style={{ textAlign: "start" }}>
                    {" "}
                    {func.funcLabel}
                  </Col>
                </Row>
              </ListGroupItem>
            );
          });
        };
        listItems.push(
          <MyAccordian accHeader={key} accBody={accBody} key={key} />
        );
      }
    }
    return listItems;
  };

  const uploadFunctionality = (files, setFiles, setError) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    mutation.mutate(
      { roleId, files: formData },
      {
        onSuccess: (response) => {
          const { data } = response;
          if (!data.success) {
            setError(data.msg);
            return;
          }
          setShowUploadModal(false);
          setFiles([]);
        },
      }
    );
  };

  return (
    <Card className="mt--2 pt-3">
      <Row className="text-center">
        <Col sm="3" xs="2" style={{ fontSize: "28px", paddingLeft: "30px" }} className="text-muted">
          <FontAwesomeIcon icon={faGlasses} />
        </Col>
        <Col sm="9" xs="10" className="h3 text-muted pl-4" style={{ textAlign: "start" }} >
          Widgets
        </Col>
      </Row>
      <ListGroup className="mt-3">
        {isSuccess && data.success && renderList()}
      </ListGroup>
      <AlertModal setTitle={title} show={showModal} setShow={setShowModal} />
      <UploadModal
        uploadFunctionality={uploadFunctionality}
        show={showUploadModal}
        setShow={setShowUploadModal}
      />
      <DataExportModal
        show={showDataExportModal}
        setShow={setShowDataExportModal}
      />
    </Card>
  );
};

export default FunctionalityBar;
