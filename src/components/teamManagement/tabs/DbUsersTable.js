import React from "react";
import {
  confirmRegister,
  getDbUsersWithRoleByClient,
} from "../../../network/ApiAxios";
import { useQuery } from "react-query";
import { useMutation, useQueryClient } from "react-query";
import UsersTable from "components/commonComps/UsersTable";

const DbUsersTable = () => {
  const clientId = localStorage.getItem("client_id");
  const queryClient = useQueryClient();
  const { data } = useQuery(
    ["getDbUsersWithRoleByClient"],
    () => getDbUsersWithRoleByClient(clientId),
    {
      select: (getDbUsersWithRoleByClient) => getDbUsersWithRoleByClient.data,
    }
  );
  const mutation = useMutation(confirmRegister, {
    onSuccess: () => {
      queryClient.invalidateQueries("getDbUsersWithRoleByClient");
    },
  });

  const handleApproval = (id) => {
    mutation.mutate(id);
  };

  return (
    <>
      <UsersTable
        data={data}
        usersType="db"
        handleApproval={handleApproval}
        qryStr="getDbUsersWithRoleByClient"
      />
    </>
  );
};

export default DbUsersTable;
