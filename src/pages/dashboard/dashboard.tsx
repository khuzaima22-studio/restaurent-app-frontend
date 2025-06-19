import { useQuery } from "@tanstack/react-query";
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

export default function Dashboard() {
  const [user] = useState({
    id: localStorage.getItem("id") || "",
    fullName: localStorage.getItem("fullname") || "",
    userName: localStorage.getItem("username") || "",
    role: localStorage.getItem("role") || "",
  });

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

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-[#ff5722] pb-5">
        <h1 className="text-2xl font-bold text-[#ff5722]">Dashboard</h1>
      </div>

      {user.role !== "chef" ? (
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
      ) : (
        <>
          <h2 className="text-xl font-bold text-[#ff5722]">Order Data</h2>

          {isPending && <Loader />}
          {isError && <Error />}

          {data?.data?.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {data.data.map(
                ({
                  orderId,
                  customerName,
                  waiterName,
                  tableNumber,
                  items,
                  status,
                  placedAt,
                  specialInstructions,
                }: any) => (
                  <div
                    key={orderId}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 relative group"
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
                      {orderId}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-700 mb-3">
                      <p className="flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        <strong>Customer:</strong> {customerName}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaConciergeBell className="text-gray-500" />
                        <strong>Waiter:</strong> {waiterName}
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
                  </div>
                )
              )}
            </div>
          )}
          {data?.data?.length <= 0 && <NoData />}
        </>
      )}
    </div>
  );
}
