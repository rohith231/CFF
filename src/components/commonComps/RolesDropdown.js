import React, { useState } from "react";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import FormGroup from "reactstrap/lib/FormGroup";
import { useQuery } from "react-query";
import { getDbRolesByClient } from "network/ApiAxios";

const RolesDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const clientId = localStorage.getItem("client_id");
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["dbRolesByClient"],
    () => getDbRolesByClient(clientId),
    {
      select: (dbRolesByClient) => dbRolesByClient.data,
    }
  );
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <>
      <FormGroup>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>{props.selectedRole}</DropdownToggle>
          {isSuccess && data.success && (
            <DropdownMenu>
              {data.roles.map((role) => {
                return (
                  <DropdownItem
                    key={role.id}
                    onClick={() => {
                      
                      console.log(role.id, "...role.id");
                      props.setRoleId(role.id);
                      props.setSelectedRole(role.role_name);
                    }}
                  >
                    {role.role_name}
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

export default RolesDropdown;
