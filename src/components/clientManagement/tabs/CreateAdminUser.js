import ClientsDropdown from "components/commonComps/ClientsDropdown";
import React, { useState } from "react";
import Container from "reactstrap/lib/Container";
import Register from "views/pages/Register";

const CreateAdminUser = () => {
  const [clientId, setClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState("Select a client");
  const renderClients = () => {
    return (
      <ClientsDropdown
        setClientId={setClientId}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
    );
  };
  return (
    <div>
      <Container fluid>
        <Register
          renderDropdown={renderClients}
          roleId={2}
          clientId={clientId}
        />
      </Container>
    </div>
  );
};

export default CreateAdminUser;
