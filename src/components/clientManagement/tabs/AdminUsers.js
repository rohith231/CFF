import React from "react";
import { confirmRegister, getAllByRole } from "../../../network/ApiAxios";
import { useQuery } from "react-query";
import { useMutation, useQueryClient } from "react-query";
import UsersTable from "components/commonComps/UsersTable";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery(["getAllUsersByRole"], () => getAllByRole(2), {
    select: (getAllUsersByRole) => getAllUsersByRole.data,
  });
  const mutation = useMutation(confirmRegister, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllUsersByRole");
    },
  });

  const handleApproval = (id) => {
    mutation.mutate(id);
  };

  return (
    <>
      <UsersTable
        data={data}
        usersType="admin"
        handleApproval={handleApproval}
        qryStr="getAllUsersByRole"
      />
    </>
  );
};

export default AdminUsers;
