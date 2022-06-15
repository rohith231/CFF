import RolesDropdown from "components/commonComps/RolesDropdown";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import DbTable from "./DbTable";
import { getAllCols } from "network/ApiAxios";
import { getApprovalByRoleId } from "network/ApiAxios";
import { InsertOrUpdateApproval } from "network/ApiAxios";
import TableNamesList from "components/commonComps/TableNamesList";
import { getAllTables } from "network/ApiAxios";
import DatabasesList from "components/commonComps/DatabasesList";
import { getAlldbs } from "network/ApiAxios";
// import DbPsswdModal from "./DbPsswdModal";

const DataTableApproval = () => {
  const [roleId, setRoleId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Select a role");
  const [tableName, setTableName] = useState("");
  const [dbs, setDbs] = useState({});
  const [error, setError] = useState("");
  const mutation = useMutation(InsertOrUpdateApproval);
  const [tableNames, setTableNames] = useState([]);
  const [tableOps, setTableOps] = useState({});
  const [dbNames, setDbNames] = useState([]);
  const [dbName, setDbName] = useState("");
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const runAsync = async () => {
      const res = await getAlldbs();
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.dbs) {
              if (res.data.dbs.length > 0) {
                const temp = res.data.dbs.map((db) => ({
                  datname: db.datname,
                  psswd: "",
                }));
                setDbNames(temp);
                setDbName(res.data.dbs[0].datname);
                setDbs((prevState) => ({
                  ...prevState,
                  [res.data.dbs[0].datname]: {},
                }));
              }
            }
          }
        }
      }
    };
    runAsync();
  }, []);

  useEffect(() => {
    const runAsync = async () => {
      // const psswd = dbNames.find((db) => db.datname === dbName)?.psswd;
      const res = await getAllTables(dbName);
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.tables) {
              setTableNames(res.data.tables);
              if (res.data.tables.length > 0) {
                let tableNme = res.data.tables[0].table_name;
                setDbs((prevState) => ({
                  ...prevState,
                  [dbName]: {
                    ...prevState[dbName],
                    [tableNme]: {
                      ...prevState[dbName][tableNme],
                    },
                  },
                }));
                setTableName(res.data.tables[0].table_name);
              }
            }
          }
        }
      }
    };
    runAsync();
  }, [dbName]);

  const asyncSetCol = async () => {
    const res = await getAllCols(dbName, tableName);
    if (res) {
      if (res.data) {
        if (res.data.success) {
          if (res.data.cols) {
            const tempCols = {};

            res.data.cols.forEach((col) => {
              tempCols[col.column_name] = {
                SELECT: false,
                UPDATE: false,
              };
            });
            var tempDbs = JSON.parse(JSON.stringify(dbs));
            tempDbs = {
              ...tempDbs,
              [dbName]: {
                ...tempDbs[dbName],
                [tableName]: {
                  ...tempDbs[dbName][tableName],
                  columns: {
                    ...tempDbs[dbName][tableName].columns,
                    ...tempCols,
                  },
                  ops: {
                    ...tempDbs[dbName][tableName].ops,
                  },
                },
              },
            };
            setDbs(tempDbs);
          }
        }
      }
    }
  };

  // const setOps = () => {
  //   setDbs((prevState) => ({
  //     ...prevState,
  //     [dbName]: {
  //       ...prevState[dbName],
  //       [tableName]: {
  //         ...prevState[dbName][tableName],
  //         columns: { ...prevState[dbName][tableName].columns },
  //         ops: {
  //           ...prevState[dbName][tableName].ops,
  //           INSERT: false,
  //           DELETE: false,
  //         },
  //       },
  //     },
  //   }));
  // };

  useEffect(() => {
    const runAsync = async () => {
      if (dbs[dbName]) {
        if (dbs[dbName][tableName]) {
          if (!("columns" in dbs[dbName][tableName])) {
            await asyncSetCol();
          } else if ("columns" in dbs[dbName][tableName]) {
            if (Object.keys(dbs[dbName][tableName].columns).length === 0) {
              await asyncSetCol();
            }
          }
          // if (!("ops" in dbs[dbName][tableName])) {
          //   setOps();
          // } else if ("ops" in dbs[dbName][tableName]) {
          //   if (Object.keys(dbs[dbName][tableName].ops).length === 0) {
          //     setOps();
          //   }
          // }
        }
      }
    };
    runAsync();
  }, [tableName]);

  useEffect(() => {
    var tempDbs = JSON.parse(JSON.stringify(dbs));
    for (let dbKey in tempDbs) {
      let db = tempDbs[dbKey];
      for (let tableKey in db) {
        let table = db[tableKey];
        for (let colKey in table.columns) {
          let col = table.columns[colKey];
          for (let opKey in col) {
            let op = col[opKey];
            if (op === true) {
              tempDbs[dbKey][tableKey].columns[colKey][opKey] = false;
            }
          }
        }
        for (let tOpKey in table.ops) {
          let tOp = table.ops[tOpKey];
          if (tOp === true) {
            tempDbs[dbKey][tableKey].ops[tOpKey] = false;
          }
        }
      }
    }
    setDbs(tempDbs);
  }, [roleId]);

  useEffect(() => {
    const runAsync = async () => {
      const res = await getApprovalByRoleId(roleId);
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.approval) {
              if (res.data.approval) {
                var tempDbs = JSON.parse(JSON.stringify(dbs));
                tempDbs = _.merge(
                  tempDbs,
                  res.data.approval.allowed_operations
                );
                for (let dbKey in tempDbs) {
                  let db = tempDbs[dbKey];
                  for (let tableKey in db) {
                    let table = db[tableKey];
                    let colNames = [];
                    for (let colKey in table.columns) {
                      colNames.push(colKey);
                    }
                    const res1 = await getAllCols(dbKey, tableKey);
                    if (res1.data) {
                      if (res1.data.success) {
                        if (res1.data.cols) {
                          const tempCols = {};
                          res1.data.cols.forEach((col) => {
                            if (!colNames.includes(col.column_name)) {
                              tempCols[col.column_name] = {
                                SELECT: false,
                                UPDATE: false,
                              };
                            }
                          });
                          tempDbs = {
                            ...tempDbs,
                            [dbKey]: {
                              ...tempDbs[dbKey],
                              [tableKey]: {
                                ...tempDbs[dbKey][tableKey],
                                columns: {
                                  ...tempDbs[dbKey][tableKey].columns,
                                  ...tempCols,
                                },
                                ops: { ...tempDbs[dbKey][tableKey].ops },
                              },
                            },
                          };
                        }
                      }
                    }
                  }
                }
                setDbs(tempDbs);
              }
            }
          }
        }
      }
    };
    runAsync();
  }, [roleId]);

  const getActiveTableName = (dbNme, tableNme) => {
    if (dbs) {
      let db = dbs[dbNme];
      if (db) {
        let table = db[tableNme];
        if (table) {
          let active = false;
          for (let op in table.ops) {
            if (table.ops[op]) {
              active = true;
            }
          }
          if (active === false) {
            for (let cols in table.columns) {
              for (let ops in table.columns[cols]) {
                if (table.columns[cols][ops]) {
                  active = true;
                }
              }
            }
          }
          return active;
        }
      }
    }
  };

  const getActiveDbName = (dbNme) => {
    if (dbs) {
      let db = dbs[dbNme];
      if (db) {
        for (let tableKey in db) {
          if (getActiveTableName(dbNme, tableKey)) {
            return true;
          }
        }
      }
    }
  };

  const onConfirmClick = () => {
    if (roleId) {
      var temDbs = JSON.parse(JSON.stringify(dbs));

      for (let dbKey in temDbs) {
        for (let tableKey in temDbs[dbKey]) {
          for (let colKey in temDbs[dbKey][tableKey].columns) {
            let colExist = false;
            for (let opKey in temDbs[dbKey][tableKey].columns[colKey]) {
              let op = temDbs[dbKey][tableKey].columns[colKey][opKey];
              if (op) {
                colExist = true;
                break;
              }
            }
            if (!colExist) {
              temDbs[dbKey][tableKey].columns = _.omit(
                temDbs[dbKey][tableKey].columns,
                colKey
              );
            }
          }
          if (temDbs[dbKey][tableKey].columns) {
            if (Object.keys(temDbs[dbKey][tableKey]?.columns).length === 0) {
              temDbs[dbKey][tableKey] = _.omit(
                temDbs[dbKey][tableKey],
                "columns"
              );
            }
          }
          if (temDbs[dbKey][tableKey]?.ops) {
            if (Object.keys(temDbs[dbKey][tableKey]?.ops).length === 0) {
              temDbs[dbKey][tableKey] = _.omit(temDbs[dbKey][tableKey], "ops");
            }
          }
          if (Object.keys(temDbs[dbKey][tableKey]).length === 0) {
            temDbs[dbKey] = _.omit(temDbs[dbKey], [tableKey]);
          }
          if (Object.keys(temDbs[dbKey]).length === 0) {
            temDbs = _.omit(temDbs, [dbKey]);
          }
        }
      }
      if (Object.keys(temDbs).length !== 0) {
        mutation.mutate(
          { roleId, dbs: temDbs },
          {
            onSuccess: (response) => {
              setError("");
            },
          }
        );
      } else {
        setError("No column selected");
      }
    } else {
      setError("Please select a role");
    }
  };

  return (
    <div>
      <Row>
        <Col lg="6" md="6" sm="4">
          <RolesDropdown
            setRoleId={setRoleId}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        </Col>
      </Row>
      <Row>
        <Col lg="3" md="3" sm="3" xs="3">
          <DatabasesList
            dbNames={dbNames}
            setDbName={setDbName}
            setDbs={setDbs}
            dbName={dbName}
            getActiveItem={getActiveDbName}
            // setShowModal={setShowModal}
          />
        </Col>
        <Col lg="3" md="3" sm="3" xs="3">
          <TableNamesList
            tableNames={tableNames}
            setTableName={setTableName}
            tableName={tableName}
            getActiveItem={getActiveTableName}
            setDbs={setDbs}
            dbName={dbName}
          />
        </Col>
        <Col lg="6" md="6" sm="6" xs="6">
          {tableName ? (
            <DbTable
              tableName={tableName}
              dbs={dbs}
              setDbs={setDbs}
              dbName={dbName}
              tableOps={tableOps}
              setTableOps={setTableOps}
            />
          ) : null}
        </Col>
      </Row>

      {error ? (
        <div className="text-muted font-italic">
          <small>
            error: <span className="text-red font-weight-700">{error}</span>
          </small>
        </div>
      ) : null}
      <Row>
        <Col className="text-center">
          <Button color="primary" type="button" onClick={onConfirmClick}>
            Confirm
          </Button>
        </Col>
      </Row>
      {/* {dbNames.length > 0 && dbName && (
        <DbPsswdModal
          show={showModal}
          setShow={setShowModal}
          dbNames={dbNames}
          setDbNames={setDbNames}
          dbName={dbName}
        />
      )} */}
    </div>
  );
};

export default DataTableApproval;
