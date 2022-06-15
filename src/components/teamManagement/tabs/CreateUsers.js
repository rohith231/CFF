import React, { useState } from "react";
import Container from "reactstrap/lib/Container";
import Register from "views/pages/Register";

import RolesDropdown from "components/commonComps/RolesDropdown";

const CreateUsers = () => {
  const [roleId, setRoleId] = useState("");
  const clientId = localStorage.getItem("client_id");
  const [selectedRole, setSelectedRole] = useState("Select a role");
  const renderRoles = () => {
    return (
      <RolesDropdown
        setRoleId={setRoleId}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
    );
  };
  return (
    <div>
      <Container fluid>
        <Register
          renderDropdown={renderRoles}
          roleId={roleId}
          clientId={clientId}
        />
      </Container>
    </div>
  );
};

export default CreateUsers;
