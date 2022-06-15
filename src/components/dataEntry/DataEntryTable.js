import { faEdit, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectQuery } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import Table from "reactstrap/lib/Table";

const DataEntryTable = (props) => {
  const roleId = localStorage.getItem("role_id");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const runAsync = async () => {
      const res = await selectQuery(roleId, props.dbName, props.tableName);
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.rows) {
              setRows(res.data.rows);
            }
          }
        }
      }
    };
    runAsync();
    return () => {
      setRows([]);
    };
  }, [props.tableName]);

  const renderHead = () => {
    if (props.cols) {
      return Object.keys(props.cols).map((col) => {
        return (
          <th scope="col" key={col}>
            {col}
            {props.cols[col].UPDATE ? (
              <FontAwesomeIcon icon={faEdit} style={{ marginLeft: "5px" }} />
            ) : null}
          </th>
        );
      });
    }
  };

  const renderCols = (row) => {
    if (props.cols) {
      return Object.keys(props.cols).map((col) => {
        return (
          <td scope="col" key={col}>
            {row[col]}
          </td>
        );
      });
    }
  };

  const renderRows = () => {
    if (rows.length > 0) {
      return rows.map((row, i) => {
        return (
          <tr key={row.id}>
            <th scope="row">{i + 1}</th>
            {renderCols(row)}
            <td scope="col">
              <Button color="primary" className="rounded-circle" size="sm">
                <FontAwesomeIcon icon={faPencilAlt} />
              </Button>
              <Button
                color="primary"
                className="rounded-circle"
                size="sm"
                disabled={!props?.tableOps?.DELETE}
              >
                <i className="fas fa-trash"></i>
              </Button>
            </td>
          </tr>
        );
      });
    }
  };

  return (
    <div>
      <Card
        className="shadow"
        style={{ maxHeight: "70vh", marginRight: "20px" }}
      >
        <CardHeader className="border-0">
          <h3 className="mb-0">{props.tableName}</h3>
        </CardHeader>
        <Table responsive className="align-items-center table-flush">
          <thead className="thead-light">
            <tr>
              <th scope="col">S.No</th>
              {renderHead()}
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </Table>
      </Card>
    </div>
  );
};

export default DataEntryTable;
