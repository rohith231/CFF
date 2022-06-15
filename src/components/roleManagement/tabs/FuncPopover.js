import { getFuncWithRoleId } from "network/ApiAxios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import Popover from "reactstrap/lib/Popover";
import PopoverBody from "reactstrap/lib/PopoverBody";
import PopoverHeader from "reactstrap/lib/PopoverHeader";

const FuncPopover = (props) => {
  const [showPopover, setShowPopover] = useState(false);
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["funcWithRoleId"],
    getFuncWithRoleId,
    {
      select: (allFunctionalities) => allFunctionalities.data,
    }
  );
  const funcsList = () => {
    if (isSuccess && data.success) {
      const filteredFuncs = data.funcwithRoleId.filter((func) => {
        return func.role_id === props.id;
      });
      if (filteredFuncs.length > 0) {
        return (
          <>
            {filteredFuncs.map((func) => {
              return <li key={func.id}>{func.functionality_label}</li>;
            })}
          </>
        );
      } else {
        return <p>No functionalities assigned</p>;
      }
    }
  };
  return (
    <Popover
      flip
      target={`Popover${props.id}`}
      // placement="bottom"
      isOpen={showPopover}
      toggle={() => {
        setShowPopover((prevState) => !prevState);
      }}
    >
      <PopoverHeader>Functionalities</PopoverHeader>
      <PopoverBody>{funcsList()}</PopoverBody>
    </Popover>
  );
};

export default FuncPopover;
