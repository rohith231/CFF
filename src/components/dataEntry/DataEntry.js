import DatabasesList from "components/commonComps/DatabasesList";
import TableNamesList from "components/commonComps/TableNamesList";
import { getApprovalByRoleId } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import DataEntryTable from "./DataEntryTable";

const DataEntry = () => {
  const [tableNames, setTableNames] = useState([]);
  const [dbs, setDbs] = useState({});
  const [dbNames, setDbNames] = useState([]);
  const [tableName, setTableName] = useState("");
  const roleId = localStorage.getItem("role_id");
  const [dbName, setDbName] = useState("");

  useEffect(() => {
    const runAsync = async () => {
      const res = await getApprovalByRoleId(roleId);
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.approval) {
              const { allowed_operations } = res.data.approval;
              const dbNms = Object.keys(allowed_operations);
              setDbs(allowed_operations);
              setDbNames(dbNms.map((name) => ({ datname: name })));
              setDbName(dbNms[0]);
              const tableNms = Object.keys(allowed_operations[dbNms[0]]);
              setTableNames(tableNms.map((name) => ({ table_name: name })));
              setTableName(tableNms[0]);
            }
          }
        }
      }
    };
    runAsync();
  }, []);

  useEffect(() => {
    if (dbs[dbName]) {
      const tableNms = Object.keys(dbs[dbName]);
      setTableNames(tableNms.map((name) => ({ table_name: name })));
      setTableName(tableNms[0]);
    }
  }, [dbName]);

  return (
    <div>
      <Row>
        <Col lg="3" md="3" sm="3" xs="3">
          <DatabasesList
            dbNames={dbNames}
            setDbName={setDbName}
            setDbs={setDbs}
            dbName={dbName}
            // getActiveItem={getActiveDbName}
            // setShowModal={setShowModal}
          />
        </Col>
        <Col lg="3" md="3" sm="3" xs="3">
          <TableNamesList
            setTableName={setTableName}
            tableNames={tableNames}
            setDbs={setDbs}
            dbName={dbName}
            tableName={tableName}
          />
        </Col>
        <Col lg="6" md="6" sm="6" xs="6">
          {tableName
            ? dbs[dbName][tableName] && (
                <DataEntryTable
                  tableName={tableName}
                  dbName={dbName}
                  tableOps={dbs[dbName][tableName].ops}
                  cols={dbs[dbName][tableName].columns}
                />
              )
            : null}
        </Col>
      </Row>
    </div>
  );
};

export default DataEntry;
