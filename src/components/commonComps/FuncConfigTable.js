import React, { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import CardHeader from "reactstrap/lib/CardHeader";
import { getFuncFuncgroupsBySectorId } from "network/ApiAxios";
import { getFuncsFuncgroupsByRoleId } from "network/ApiAxios";

const FuncConfigTable = (props) => {
  const [functionalities, setFunctionalities] = useState([]);
  const clientId = localStorage.getItem("client_id");
  useEffect(() => {
    const runAsync = async () => {
      const res = await getFuncFuncgroupsBySectorId(clientId);
      if (res.data) {
        if (res.data.success) {
          setFunctionalities(res.data.funcBySectorId);
          // const temp = {};
          // res.data.funcBySectorId.forEach((functionality) => {
          //   temp[functionality.id] = false;
          // });
          // props.setPermittedFunc(temp);
        }
      }
    };
    runAsync();
  }, []);
  useEffect(() => {
    const runAsync = async () => {
      if (props.roleId) {
        const res = await getFuncsFuncgroupsByRoleId(props.roleId);
        if (res.data) {
          if (res.data.success) {
            if (res.data.funcsFuncgroups.length > 0) {
              const temp = {};
              res.data.funcsFuncgroups.forEach((func) => {
                temp[func.id] = true;
              });
              props.setExistingWidgets(temp);
              props.setPermittedFunc(temp);
            }
          }
        }
      }
    };
    runAsync();
    return () => {
      props.setPermittedFunc({});
    };
  }, [props.roleId]);
  const handleCheckboxes = (id) => {
    props.setPermittedFunc((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };

  return (
    <>
      <Card className="shadow" style={{ maxHeight: "388px" }}>
        <CardHeader style={{ textAlign: "center" }}>
          <h3 className="text-muted">Widgets</h3>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Functionality name</th>
              <th scope="col">Group name</th>
              <th scope="col">Permission</th>
            </tr>
          </thead>
          <tbody>
            {functionalities.length > 0 &&
              functionalities.map((functionality, index) => {
                return (
                  <tr
                    key={functionality.id}
                    style={
                      props.permittedFunc[functionality.id]
                        ? {
                            backgroundColor: "#e3f2fd",
                            borderBottom: "1.1px #90caf9 solid",
                          }
                        : null
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{functionality.functionality_label}</td>
                    <td>{functionality.group_name}</td>
                    <td>
                      <FormGroup check inline>
                        <Input
                          type="checkbox"
                          value={functionality.id}
                          checked={!!props.permittedFunc[functionality.id]}
                          onChange={() => handleCheckboxes(functionality.id)}
                        />
                        <Label check>read</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input type="checkbox" />
                        <Label check>write</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input type="checkbox" />
                        <Label check>delete</Label>
                      </FormGroup>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Card>
    </>
  );
};

export default FuncConfigTable;
