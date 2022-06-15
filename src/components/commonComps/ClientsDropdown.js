import React, { useState } from "react";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import FormGroup from "reactstrap/lib/FormGroup";
import { useQuery } from "react-query";
import { getAllClients } from "network/ApiAxios";

const ClientsDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery(
    ["allClients"],
    getAllClients,
    {
      select: (allClients) => allClients.data,
    }
  );
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <>
      <FormGroup>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>{props.selectedClient}</DropdownToggle>
          {isSuccess && data.success && (
            <DropdownMenu>
              {data.clients.map((client) => {
                return (
                  <DropdownItem
                    key={client.id}
                    onClick={() => {
                      props.setClientId(client.id);
                      props.setSelectedClient(client.client_name);
                    }}
                  >
                    {client.client_name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          )}
          {isLoading && (
            <DropdownMenu>
              <DropdownItem>Loading..</DropdownItem>
            </DropdownMenu>
          )}
          {isError && (
            <DropdownMenu>
              <DropdownItem>Error fetching data..</DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </FormGroup>
    </>
  );
};

export default ClientsDropdown;
