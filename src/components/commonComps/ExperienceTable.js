import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getExpByRole } from "network/ApiAxios";
import { getExperiencesByClient } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Table from "reactstrap/lib/Table";

const ExperienceTable = (props) => {
  const clientId = localStorage.getItem("client_id");
  const [exps, setExps] = useState([]);

  useEffect(() => {
    const runAsync = async () => {
      const res = await getExperiencesByClient(clientId);
      if (res.data) {
        if (res.data.success) {
          setExps(res.data.experiences);
        }
      }
    };
    runAsync();
  }, []);
  useEffect(() => {
    const runAsync = async () => {
      if (props.roleId) {
        const res = await getExpByRole(props.roleId);
        if (res.data) {
          if (res.data.success) {
            if (res.data.exp) {
              const { exp_id } = res.data.exp;
              props.setExistingExpId(exp_id);
              props.setExpId(exp_id);
            }
          }
        }
      }
    };
    runAsync();
    return () => {
      props.setExpId();
    };
  }, [props.roleId]);

  const renderTableBody = () => {
    if (exps) {
      if (exps.length > 0) {
        return exps.map((exp, i) => {
          return (
            <tr
              key={exp.id}
              style={
                props.expId === exp.id
                  ? {
                      backgroundColor: "#e3f2fd",
                      borderBottom: "1.1px #90caf9 solid",
                    }
                  : null
              }
            >
              <td>{i + 1}</td>
              <td>{exp.title}</td>
              <td>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name="permission"
                    value={exp.id}
                    checked={props.expId === exp.id}
                    onChange={() => {
                      props.setExpId(exp.id);
                    }}
                  />
                </FormGroup>
              </td>
            </tr>
          );
        });
      }
    }
  };
  return (
    <>
      <Card className="shadow" style={{ maxHeight: "388px" }}>
        <CardHeader style={{ textAlign: "center" }}>
          <h3 className="text-muted">Experiences</h3>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Experience name</th>
              <th scope="col">
                Permission
                <Button
                  size="sm"
                  className="rounded-circle"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    props.setExpId();
                  }}
                >
                  <span style={{ fontSize: "15px" }}>
                    <FontAwesomeIcon icon={faEraser} />
                  </span>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </Table>
      </Card>
    </>
  );
};

export default ExperienceTable;
