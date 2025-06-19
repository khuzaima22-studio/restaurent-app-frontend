import { useState } from "react";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import UserFormModal from "../../reusable-components/user-form-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toast } from "../../helper/toast";
import Loader from "../../reusable-components/loader";
import Error from "../../reusable-components/error";
import NoData from "../../reusable-components/no-data";

type User = {
  fullname: string;
  username: string;
  role: string;
  password?: string;
  branchId?: string;
};

export default function UserTable() {
  const [openModal, setOpenModal] = useState(false);
  const [updateData, setUpdateData] = useState<User | null>(null);
  const role = localStorage.getItem("role");
  const isSupervisor = role === "manager";
  const isModerator = role === "admin";

  const toggleModal = (data?: User) => {
    setOpenModal(!openModal);
    setUpdateData(data || null);
  };

  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["fetchUsers"],
    queryFn: async () => {
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      });

      try {
        const res = await fetch(
          import.meta.env.VITE_SERVER + "/v1/fetch-users",
          { method: "GET", headers }
        );
        const result = await res.json();
        if (result?.status) {
          // Toast(result.message, true)
        }
        else throw result.message;
        return result;
      } catch (err) {
        console.error("Fetch failed", err);
        throw err;
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      });

      const res = await fetch(
        import.meta.env.VITE_SERVER + `/v1/delete-user/${id}`,
        { method: "DELETE", headers }
      );
      return await res.json();
    },
    onSuccess: (data) => {
      if (data?.success) {
        // Toast(data.message, true);
        queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
      } else {
        Toast(data.message, false);
      }
    },
  });

  const hasData = Array.isArray(data?.detail) && data.detail.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#ff5722] pb-4">
        <h1 className="text-2xl font-bold text-[#ff5722]">Users</h1>
        <button
          onClick={() => toggleModal()}
          disabled={!isSupervisor && !isModerator}
          className="flex items-center bg-[#ff5722] hover:bg-orange-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
        >
          <FaPlusCircle className="mr-2" />
          Create User
        </button>
      </div>

      {isPending && (
        <div className="flex justify-center mt-10">
          <Loader />
        </div>
      )}

      {isError && (
        <div className="flex justify-center mt-10">
          <Error />
        </div>
      )}

      {!isPending && !isError && !hasData && (
        <div className="flex justify-center mt-10">
          <NoData />
        </div>
      )}

      {hasData  && (
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto border border-[#ff5722] rounded shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-[#fff2eb] text-[#ff5722] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">#</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Role</th>
                  {(isSupervisor || isModerator) && (
                    <th className="px-6 py-3 text-left font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.detail.map((user: any, index: number) => (
                  <tr key={user.id} className="hover:bg-[#fff8f5]">
                    <td className="px-6 py-4 text-gray-800 ">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-800 capitalize">
                      {user.fullname}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 text-gray-800 capitalize">
                      {user.role}
                    </td>
                    {(isSupervisor || isModerator) && (
                      <td className="px-6 py-4">
                        <div className="flex space-x-4 text-[#ff5722]">
                          {(isSupervisor ||
                            (isModerator &&
                              user.role !== "manager" &&
                              user.role !== "admin")) && (
                            <button
                              onClick={() => toggleModal(user)}
                              className="hover:text-orange-700"
                            >
                              <FaEdit size={16} />
                            </button>
                          )}
                          {isSupervisor && (
                            <button
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              className="hover:text-orange-700"
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {openModal && (
        <UserFormModal
          userRole={role || "manager"}
          isOpen={openModal}
          onClose={toggleModal}
          updateData={updateData ? { ...updateData,userName:updateData.username } : null}
        />
      )}
    </div>
  );
}
