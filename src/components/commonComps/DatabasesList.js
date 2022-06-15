import React from "react";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";

const DatabasesList = (props) => {
  const renderDbsList = () => {
    if (props.dbNames.length > 0) {
      return props.dbNames.map((db) => {
        return (
          <ListGroupItem
            key={db.datname}
            action
            tag="button"
            style={
              db.datname === props.dbName
                ? {
                    borderLeft: "3px solid #80d8ff",
                  }
                : null
            }
            value={db.datname}
            active={
              props.getActiveItem ? props.getActiveItem(db.datname) : false
            }
            onClick={() => {
              props.setDbName(db.datname);
              props.setDbs((prevState) => ({
                ...prevState,
                [db.datname]: { ...prevState[db.datname] },
              }));
              // if (!db.psswd) {
              //   props.setShowModal(true);
              // }
            }}
          >
            {db.datname}
          </ListGroupItem>
        );
      });
    }
  };

  return (
    <Card className="shadow" style={{ overflowY: "auto", maxHeight: "100vh" }}>
      <CardHeader className="border-0">
        <h3 className="mb-0">Databases</h3>
      </CardHeader>
      <ListGroup>{renderDbsList()}</ListGroup>
    </Card>
  );
};

export default DatabasesList;
