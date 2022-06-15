import React from "react";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";

const DbTable = (props) => {
  const handleCheckboxes = (dbName, tableName, col, type) => {
    props.setDbs((prevState) => {
      return {
        ...prevState,
        [dbName]: {
          ...prevState[dbName],
          [tableName]: {
            ...prevState[dbName][tableName],
            columns: {
              ...prevState[dbName][tableName].columns,
              [col]: {
                ...prevState[dbName][tableName].columns[col],
                [type]: !prevState[dbName][tableName].columns[col][type],
              },
            },
          },
        },
      };
    });
  };

  const handleTableChecks = (dbName, tableName, type) => {
    props.setDbs((prevState) => {
      return {
        ...prevState,
        [dbName]: {
          ...prevState[dbName],
          [tableName]: {
            ...prevState[dbName][tableName],
            ops: {
              ...prevState[dbName][tableName].ops,
              [type]: !prevState[dbName][tableName].ops[type],
            },
          },
        },
      };
    });
  };

  const renderRows = (dbName, tableName, cols) => {
    let arr = [];
    for (let col in cols) {
      if (cols.hasOwnProperty(col)) {
        arr.push(
          <tr key={col}>
            <th scope="row">{col}</th>
            <td>
              <FormGroup check inline>
                <Input
                  type="checkbox"
                  value={cols[col].SELECT}
                  checked={cols[col].SELECT}
                  onChange={() =>
                    handleCheckboxes(dbName, tableName, col, "SELECT")
                  }
                />
              </FormGroup>
            </td>
            <td>
              <FormGroup check inline>
                <Input
                  type="checkbox"
                  value={cols[col].UPDATE}
                  checked={cols[col].UPDATE}
                  onChange={() =>
                    handleCheckboxes(dbName, tableName, col, "UPDATE")
                  }
                />
              </FormGroup>
            </td>
          </tr>
        );
      }
    }
    return arr;
  };

  const renderTableOps = (operations) => {
    if (operations) {
      return (
        <>
          <Col lg="3" md="3" sm="3" xs="3">
            <FormGroup check>
              <Input
                type="checkbox"
                value={operations.INSERT}
                checked={operations.INSERT}
                onChange={() =>
                  handleTableChecks(props.dbName, props.tableName, "INSERT")
                }
              />
              <Label check>Insert</Label>
            </FormGroup>
          </Col>
          <Col lg="3" md="3" sm="3" xs="3">
            <FormGroup check>
              <Input
                type="checkbox"
                value={operations.DELETE}
                checked={operations.DELETE}
                onChange={() =>
                  handleTableChecks(props.dbName, props.tableName, "DELETE")
                }
              />
              <Label check>Delete</Label>
            </FormGroup>
          </Col>
        </>
      );
    }
  };

  return (
    <div>
      <Card className="shadow" style={{ maxHeight: "100vh" }}>
        <CardHeader
          className="border-0"
          style={{ overflowX: "auto", overflowY: "auto", height: "100px" }}
        >
          <Row>
            <Col lg="6" md="6" sm="6" xs="6">
              <h3 className="mb-0">{props.tableName}</h3>
            </Col>
            {props.dbs[props.dbName][props.tableName] &&
              renderTableOps(props.dbs[props.dbName][props.tableName].ops)}
          </Row>
        </CardHeader>
        <Table responsive className="align-items-center table-flush">
          <thead className="thead-light">
            <tr>
              <th scope="col">Column Name</th>
              <th scope="col">Select</th>
              <th scope="col">Update</th>
            </tr>
          </thead>
          <tbody>
            {props.dbs &&
              props.dbs[props.dbName] &&
              renderRows(
                props.dbName,
                props.tableName,
                props.dbs[props.dbName][props.tableName]?.columns
              )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
export default DbTable;
