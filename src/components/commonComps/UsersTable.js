import React from "react";
import { Card, CardHeader, Container, Table } from "reactstrap";
import Button from "reactstrap/lib/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { deleteUser } from "network/ApiAxios";
import { useMutation, useQueryClient } from "react-query";

const UsersTable = (props) => {
  const queryClient = useQueryClient();
  const dltMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(props.qryStr);
    },
  });
  const thByUsersType = (type) => {
    if (type === "admin") {
      return "Client";
    } else if (type === "db") {
      return "Role";
    } else {
      return null;
    }
  };

  const tdByUsersType = (type) => {
    if (type === "admin") {
      return "client_name";
    } else if (type === "db") {
      return "role_name";
    } else {
      return null;
    }
  };

  return (
    <>
      <Container fluid>
        <Card className="shadow">
          <CardHeader className="border-0">
            <h3 className="mb-0">Users</h3>
          </CardHeader>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">User Name</th>
                <th scope="col">Email</th>
                <th scope="col">{thByUsersType(props.usersType)}</th>
                <th scope="col">confirmation</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {props.data?.success
                ? props.data.users.map((user) => (
                    <tr key={user.email}>
                      <th scope="row">{user.user_name}</th>
                      <td>{user.email}</td>
                      <td>{user[tdByUsersType(props.usersType)]}</td>
                      <td>
                        {user.account_confirmation ? (
                          <div>
                            <span
                              style={{
                                color: "green",
                                paddingRight: "2px",
                                fontSize: "2em",
                              }}
                            >
                              <i className="far fa-check-square"></i>
                            </span>
                          </div>
                        ) : (
                          <>
                            <Button
                              className="btn btn-primary btn-sm py-2"
                              onClick={() => props.handleApproval(user.id)}
                            >
                              <span
                                style={{
                                  color: "red",
                                  paddingRight: "2px",
                                  fontSize: "1.3em",
                                }}
                              >
                                <i className="fas fa-exclamation-circle"></i>
                              </span>
                              Approve
                            </Button>
                          </>
                        )}
                      </td>
                      <td>
                        <Button
                          color="primary"
                          className="rounded-circle"
                          size="sm"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </Button>
                        <Button
                          color="primary"
                          className="rounded-circle"
                          size="sm"
                          onClick={() => {
                            dltMutation.mutate(user.id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default UsersTable;
