import React from "react";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";

const TableNamesList = (props) => {
  const renderTablesList = () => {
    if (props.tableNames.length > 0) {
      return props.tableNames.map((table) => {
        return (
          <ListGroupItem
            key={table.table_name}
            action
            tag="button"
            value={table.table_name}
            style={
              table.table_name === props.tableName
                ? {
                    borderLeft: "3px solid #80d8ff",
                  }
                : null
            }
            active={
              props.getActiveItem
                ? props.getActiveItem(props.dbName, table.table_name)
                : false
            }
            onClick={() => {
              props.setTableName(table.table_name);
              props.setDbs((prevState) => ({
                ...prevState,
                [props.dbName]: {
                  ...prevState[props.dbName],
                  [table.table_name]: {
                    ...prevState[props.dbName][table.table_name],
                  },
                },
              }));
            }}
          >
            {table.table_name}
          </ListGroupItem>
        );
      });
    }
  };
  return (
    <div>
      <Card
        className="shadow"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <CardHeader className="border-0">
          <h3 className="mb-0">Tables</h3>
        </CardHeader>
        <ListGroup>{renderTablesList()}</ListGroup>
      </Card>
    </div>
  );
};

export default TableNamesList;
