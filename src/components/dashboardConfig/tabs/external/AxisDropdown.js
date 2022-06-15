import React, { useState } from "react";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownToggle from "reactstrap/lib/DropdownToggle";

const AxisDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAxis, setSelectedAxis] = useState("select");
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  const renderOptions = () => {
    const ops = Object.keys(props.options);
    if (ops) {
      return ops.map((op) => (
        <DropdownItem
          key={op}
          onClick={() => {
            props.setAxis(op);
            setSelectedAxis(op);
          }}
        >
          {op}
        </DropdownItem>
      ));
    }
  };
  return (
    <div className="ml-2">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} color="primary">
        <DropdownToggle caret>{selectedAxis}</DropdownToggle>
        <DropdownMenu>{renderOptions()}</DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AxisDropdown;
