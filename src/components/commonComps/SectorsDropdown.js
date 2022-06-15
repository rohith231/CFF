import React, { useState } from "react";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import FormGroup from "reactstrap/lib/FormGroup";
import { useQuery } from "react-query";
import { getAllSectors } from "network/ApiAxios";

const SectorsDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery(
    ["allSectors"],
    getAllSectors,
    {
      select: (allSectors) => allSectors.data,
    }
  );
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <>
      <FormGroup>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>{props.selectedSector}</DropdownToggle>
          {isSuccess && data.success && (
            <DropdownMenu>
              {data.sectors.map((sector) => {
                return (
                  <DropdownItem
                    key={sector.id}
                    onClick={() => {
                      props.setSectorId(sector.id);
                      props.setSelectedSector(sector.sector_name);
                    }}
                  >
                    {sector.sector_name}
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

export default SectorsDropdown;
