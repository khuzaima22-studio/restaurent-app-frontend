import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Loader from "../../reusable-components/loader";
import Error from "../../reusable-components/error";
import { timeAgo } from "../../helper/timeAgo";
import NoData from "../../reusable-components/no-data";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  FaArrowDown,
  FaArrowUp,
  FaClock,
  FaConciergeBell,
  FaUser,
  FaCartArrowDown,
  FaUtensils,
} from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";
import SupervisorNotes from "../../reusable-components/supervisor-notes";
import TableBookModal from "../landing-page-components/book-table-modal";
import { TbRefresh } from "react-icons/tb";
import { Toast } from "../../helper/toast";

type StatusForm = {
  orderId: string;
  status: string;
};

export default function Dashboard() {
  const [user] = useState({
    id: localStorage.getItem("id") || "",
    fullName: localStorage.getItem("fullname") || "",
    userName: localStorage.getItem("username") || "",
    role: localStorage.getItem("role") || "",
    branchId: localStorage.getItem("branchId") || "",
  });

  const [isTableBookModal, setIsTableBookModal] = useState(false);
  const onclose = () => {
    setIsTableBookModal(!isTableBookModal);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    prepared: "bg-blue-100 text-blue-800",
    served: "bg-green-100 text-green-800",
  };

  if (user.role === "manager" || user.role === "admin" ||
    user.role === "branch manager") {
    const { data, isPending, isError } = useQuery({
      queryKey: ["fetchBranchesPerUserId"],
      queryFn: async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append(
          "Authorization",
          `Bearer ${localStorage.getItem("token")}`
        );
        const url = `${import.meta.env.VITE_SERVER}/v1/${
          ["manager", "admin"].includes(user.role)
            ? "fetch-branches"
            : `fetch-branches/${user.id}`
        }`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers,
          });
          const result = await response.json();
          if (!result?.success) throw result.message;
          return result;
        } catch (err) {
          console.error("Fetch failed", err);
          throw err;
        }
      },
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b-2 border-[#ff5722] pb-5">
          <h1 className="text-2xl font-bold text-[#ff5722]">Dashboard</h1>
        </div>
        <>
          <h2 className="text-xl font-bold text-[#ff5722]">Branch Data</h2>

          {isPending && <Loader />}
          {isError && <Error />}

          {data?.data?.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {data.data?.map(
                  ({ id, name, totalExpense, totalSale }: any) => (
                    <div
                      key={id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 capitalize mb-4">
                        {name}
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaArrowDown className="text-red-500" />
                            Expenses
                          </div>
                          <div className="text-base font-semibold text-gray-800 ">
                            ${totalExpense}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaArrowUp className="text-green-600" />
                            Sales
                          </div>
                          <div className="text-base font-semibold text-gray-800">
                            ${totalSale}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCartArrowDown className="text-blue-500" />
                            Today Total Orders
                          </div>
                          <div className="text-base font-semibold text-gray-800">
                            {Math.floor(Math.random() * 100) + 10}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <h2 className="text-xl font-bold text-[#ff5722]">Reminders</h2>
              <SupervisorNotes />
            </>
          )}
          {data?.data?.length <= 0 && <NoData />}
        </>
      </div>
    );
  }
  if (user.role === "waiter") {
    const { data, isPending, isError, refetch } = useQuery({
      queryKey: ["fetchOrders"],
      queryFn: async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append(
          "Authorization",
          `Bearer ${localStorage.getItem("token")}`
        );
        const url = `${import.meta.env.VITE_SERVER}/v1/fetch-orders/${user.id}`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers,
          });
          const result = await response.json();
          if (!result?.success) throw result.message;
          return result;
        } catch (err) {
          console.error("Fetch failed", err);
          throw err;
        }
      },
    });

    const queryClient = useQueryClient();
    const changeOrderStatusMutation = useMutation({
      mutationFn: (data: StatusForm) => changeOrderStatusRequest(data),
      onSuccess(response) {
        if (response?.success) {
          queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
        } else {
          Toast(response?.message || "failed", false);
        }
      },
      onError: () => {
        Toast("Something went wrong. Please try again.", false);
      },
    });

    const changeOrderStatusRequest = async (data: StatusForm) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );
        const response = await fetch(
          import.meta.env.VITE_SERVER + "/v1/change-order-status",
          {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(data),
          }
        );
        return await response.json();
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b-2 border-[#ff5722] pb-5">
          <h1 className="text-2xl font-bold text-[#ff5722]">Dashboard</h1>
        </div>
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#ff5722]">Order Data</h2>
            <div className="flex justify-between items-center gap-2">
              <button
                className="bg-[#ff5722] hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md transition h-[48px]"
                onClick={() => {
                  refetch();
                }}
              >
                <TbRefresh />
              </button>
              <button
                className="bg-[#ff5722] hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md transition"
                onClick={() => {
                  setIsTableBookModal(true);
                }}
              >
                Take Order
              </button>
              {isTableBookModal && (
                <TableBookModal
                  waiterId={user.id}
                  branchId={user.branchId}
                  isWaiter={true}
                  isOpen={isTableBookModal}
                  onclose={onclose}
                />
              )}
            </div>
          </div>

          {isPending && <Loader />}
          {isError && <Error />}

          {data?.data?.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {data.data.map(
                  ({
                    id,
                    customerName,
                    waiter,
                    tableNumber,
                    items,
                    status,
                    placedAt,
                    specialInstructions,
                  }: any) => (
                    <div
                      key={id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 relative group capitalize"
                    >
                      <div className="absolute top-4 right-4">
                        {status && (
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]} flex items-center gap-1`}
                          >
                            <HiOutlineClipboardList className="text-sm" />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                        <FaUtensils className="text-orange-500" />
                      </h3>

                      <div className="space-y-1 text-sm text-gray-700 mb-3">
                        <p className="flex items-center gap-2">
                          <FaUser className="text-gray-500" />
                          <strong>Customer:</strong> {customerName}
                        </p>
                        <p className="flex items-center gap-2">
                          <FaConciergeBell className="text-gray-500" />
                          <strong>Waiter:</strong> {waiter.fullname}
                        </p>
                        <p className="flex items-center gap-2">
                          <MdTableRestaurant className="text-gray-500" />
                          <strong>Table No:</strong> {tableNumber}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Items:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {items?.map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.itemName} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {specialInstructions && (
                        <p className="text-sm italic text-orange-600 mb-3 border-l-4 border-orange-500 pl-3">
                          “{specialInstructions}”
                        </p>
                      )}

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock />
                        Placed {placedAt && timeAgo(placedAt)}
                      </p>
                      <div className=" flex justify-end">
                        <button
                          className="bg-[#ff5722] hover:bg-orange-700 text-white font-medium py-1 px-3 rounded-md transition mt-2 text-sm disabled:opacity-50"
                          onClick={() => {
                            changeOrderStatusMutation.mutate({
                              orderId: id,
                              status: "served",
                            });
                          }}
                          disabled={status == "pending" || status == "served"}
                        >
                          Change status
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
          {data?.data?.length <= 0 && <NoData />}
        </>
      </div>
    );
  }
  if (user.role === "chef") {
    const { data, isPending, isError, refetch } = useQuery({
      queryKey: ["fetchOrders"],
      queryFn: async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append(
          "Authorization",
          `Bearer ${localStorage.getItem("token")}`
        );
        const url = `${import.meta.env.VITE_SERVER}/v1/fetch-orders/${user.id}`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers,
          });
          const result = await response.json();
          if (!result?.success) throw result.message;
          return result;
        } catch (err) {
          console.error("Fetch failed", err);
          throw err;
        }
      },
    });

    const queryClient = useQueryClient();
    const changeOrderStatusMutation = useMutation({
      mutationFn: (data: StatusForm) => changeOrderStatusRequest(data),
      onSuccess(response) {
        if (response?.success) {
          queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
        } else {
          Toast(response?.message || "failed", false);
        }
      },
      onError: () => {
        Toast("Something went wrong. Please try again.", false);
      },
    });

    const changeOrderStatusRequest = async (data: StatusForm) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );
        const response = await fetch(
          import.meta.env.VITE_SERVER + "/v1/change-order-status",
          {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(data),
          }
        );
        return await response.json();
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b-2 border-[#ff5722] pb-5">
          <h1 className="text-2xl font-bold text-[#ff5722]">Dashboard</h1>
        </div>
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#ff5722]">Order Data</h2>
            <div className="flex justify-between items-center gap-2">
              <button
                className="bg-[#ff5722] hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md transition h-[48px]"
                onClick={() => {
                  refetch();
                }}
              >
                <TbRefresh />
              </button>
            </div>
          </div>

          {isPending && <Loader />}
          {isError && <Error />}

          {data?.data?.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {data.data.map(
                  ({
                    id,
                    customerName,
                    waiter,
                    tableNumber,
                    items,
                    status,
                    placedAt,
                    specialInstructions,
                  }: any) => (
                    <div
                      key={id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 relative group capitalize"
                    >
                      <div className="absolute top-4 right-4">
                        {status && (
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]} flex items-center gap-1`}
                          >
                            <HiOutlineClipboardList className="text-sm" />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                        <FaUtensils className="text-orange-500" />
                      </h3>

                      <div className="space-y-1 text-sm text-gray-700 mb-3">
                        <p className="flex items-center gap-2">
                          <FaUser className="text-gray-500" />
                          <strong>Customer:</strong> {customerName}
                        </p>
                        <p className="flex items-center gap-2">
                          <FaConciergeBell className="text-gray-500" />
                          <strong>Waiter:</strong> {waiter.fullname}
                        </p>
                        <p className="flex items-center gap-2">
                          <MdTableRestaurant className="text-gray-500" />
                          <strong>Table No:</strong> {tableNumber}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Items:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {items?.map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.itemName} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {specialInstructions && (
                        <p className="text-sm italic text-orange-600 mb-3 border-l-4 border-orange-500 pl-3">
                          “{specialInstructions}”
                        </p>
                      )}

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock />
                        Placed {placedAt && timeAgo(placedAt)}
                      </p>
                      <div className=" flex justify-end">
                        <button
                          className="bg-[#ff5722] hover:bg-orange-700 text-white font-medium py-1 px-3 rounded-md transition mt-2 text-sm disabled:opacity-50"
                          onClick={() => {
                            changeOrderStatusMutation.mutate({
                              orderId: id,
                              status: "prepared",
                            });
                          }}
                          disabled={status == "prepared"}
                        >
                          Change status
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
          {data?.data?.length <= 0 && <NoData />}
        </>
      </div>
    );
  }
  // return (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center border-b-2 border-[#ff5722] pb-5">
  //       <h1 className="text-2xl font-bold text-[#ff5722]">Dashboard</h1>
  //     </div>

  //     {user.role !== "chef" ? (
  //       <>
  //         <h2 className="text-xl font-bold text-[#ff5722]">Branch Data</h2>

  //         {isPending && <Loader />}
  //         {isError && <Error />}

  //         {data?.data?.length > 0 && (
  //           <>
  //             <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
  //               {data.data?.map(
  //                 ({ id, name, totalExpense, totalSale }: any) => (
  //                   <div
  //                     key={id}
  //                     className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
  //                   >
  //                     <h3 className="text-lg font-semibold text-gray-800 capitalize mb-4">
  //                       {name}
  //                     </h3>

  //                     <div className="space-y-4">
  //                       <div className="flex items-center justify-between">
  //                         <div className="flex items-center gap-2 text-sm text-gray-600">
  //                           <FaArrowDown className="text-red-500" />
  //                           Expenses
  //                         </div>
  //                         <div className="text-base font-semibold text-gray-800 ">
  //                           ${totalExpense}
  //                         </div>
  //                       </div>

  //                       <div className="flex items-center justify-between">
  //                         <div className="flex items-center gap-2 text-sm text-gray-600">
  //                           <FaArrowUp className="text-green-600" />
  //                           Sales
  //                         </div>
  //                         <div className="text-base font-semibold text-gray-800">
  //                           ${totalSale}
  //                         </div>
  //                       </div>

  //                       <div className="flex items-center justify-between">
  //                         <div className="flex items-center gap-2 text-sm text-gray-600">
  //                           <FaCartArrowDown className="text-blue-500" />
  //                           Today Total Orders
  //                         </div>
  //                         <div className="text-base font-semibold text-gray-800">
  //                           {Math.floor(Math.random() * 100) + 10}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 )
  //               )}
  //             </div>
  //             <h2 className="text-xl font-bold text-[#ff5722]">Reminders</h2>
  //             <SupervisorNotes />
  //           </>
  //         )}
  //         {data?.data?.length <= 0 && <NoData />}
  //       </>
  //     ) : (
  //       <>
  //         <h2 className="text-xl font-bold text-[#ff5722]">Order Data</h2>

  //         {isPending && <Loader />}
  //         {isError && <Error />}

  //         {data?.data?.length > 0 && (
  //           <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
  //             {data.data.map(
  //               ({
  //                 orderId,
  //                 customerName,
  //                 waiterName,
  //                 tableNumber,
  //                 items,
  //                 status,
  //                 placedAt,
  //                 specialInstructions,
  //               }: any) => (
  //                 <div
  //                   key={orderId}
  //                   className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 relative group"
  //                 >
  //                   <div className="absolute top-4 right-4">
  //                     {status && (
  //                       <span
  //                         className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]} flex items-center gap-1`}
  //                       >
  //                         <HiOutlineClipboardList className="text-sm" />
  //                         {status.charAt(0).toUpperCase() + status.slice(1)}
  //                       </span>
  //                     )}
  //                   </div>

  //                   <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
  //                     <FaUtensils className="text-orange-500" />
  //                     {orderId}
  //                   </h3>

  //                   <div className="space-y-1 text-sm text-gray-700 mb-3">
  //                     <p className="flex items-center gap-2">
  //                       <FaUser className="text-gray-500" />
  //                       <strong>Customer:</strong> {customerName}
  //                     </p>
  //                     <p className="flex items-center gap-2">
  //                       <FaConciergeBell className="text-gray-500" />
  //                       <strong>Waiter:</strong> {waiterName}
  //                     </p>
  //                     <p className="flex items-center gap-2">
  //                       <MdTableRestaurant className="text-gray-500" />
  //                       <strong>Table No:</strong> {tableNumber}
  //                     </p>
  //                   </div>

  //                   <div className="mb-3">
  //                     <p className="text-sm font-medium text-gray-700 mb-1">
  //                       Items:
  //                     </p>
  //                     <ul className="list-disc list-inside text-sm text-gray-700">
  //                       {items?.map((item: any, idx: number) => (
  //                         <li key={idx}>
  //                           {item.itemName} × {item.quantity}
  //                         </li>
  //                       ))}
  //                     </ul>
  //                   </div>

  //                   {specialInstructions && (
  //                     <p className="text-sm italic text-orange-600 mb-3 border-l-4 border-orange-500 pl-3">
  //                       “{specialInstructions}”
  //                     </p>
  //                   )}

  //                   <p className="text-xs text-gray-500 flex items-center gap-1">
  //                     <FaClock />
  //                     Placed {placedAt && timeAgo(placedAt)}
  //                   </p>
  //                 </div>
  //               )
  //             )}
  //           </div>
  //         )}
  //         {data?.data?.length <= 0 && <NoData />}
  //       </>
  //     )}
  //   </div>
  // );
}
