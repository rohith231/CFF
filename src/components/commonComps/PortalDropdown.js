import React, { useEffect, useState } from "react";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import FormGroup from "reactstrap/lib/FormGroup";

const PortalDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    props.setPiId(props.portalItems[0].piId);
    props.setPiTitle(props.portalItems[0].piTitle);
    props.setType(props.portalItems[0].type);
  }, []);
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  return (
    <>
      <FormGroup>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>{props.piTitle}</DropdownToggle>
          {props.portalItems && (
            <DropdownMenu>
              {props.portalItems.map((portalItem) => {
                return (
                  <DropdownItem
                    key={portalItem.piId}
                    onClick={() => {
                      props.setPiId(portalItem.piId);
                      props.setPiTitle(portalItem.piTitle);
                      props.setType(portalItem.type);
                    }}
                  >
                    {portalItem.piTitle}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          )}
        </Dropdown>
      </FormGroup>
    </>
  );
};

export default PortalDropdown;
