import { useQuery } from "@tanstack/react-query";
import { Toast } from "../../helper/toast";
import NoData from "../../reusable-components/no-data";
import Error from "../../reusable-components/error";
import Loader from "../../reusable-components/loader";

export default function BranchTable() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["fetchBranches"],
    queryFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      try {
        const response = await fetch(
          import.meta.env.VITE_SERVER + "/v1/fetch-branches",
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const result = await response.json();
        if (result?.success) {
        } else {
          Toast(result.message, false);
          throw result.message;
        }
        return result;
      } catch (err) {
        console.error("Fetch failed", err);
        throw err;
      }
    },
  });

  const hasData = Array.isArray(data?.data) && data.data.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#ff5722] pb-4">
        <h1 className="text-2xl font-bold text-[#ff5722]">Branches</h1>
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
          <p className="text-lg font-medium text-[#ff5722]">
            <NoData />
          </p>
        </div>
      )}

      {hasData && (
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto border border-[#ff5722] rounded-md shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-[#fff2eb] text-[#ff5722] sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">#</th>
                  <th className="text-left px-6 py-3 font-semibold">
                    Branch Name
                  </th>
                  <th className="text-left px-6 py-3 font-semibold">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.data.map((branch: any, index: number) => (
                  <tr
                    key={branch.id}
                    className="hover:bg-[#fff7f3] transition-colors"
                  >
                    <td className="px-6 py-4 capitalize text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-800">
                      {branch.name}
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-800">
                      {branch.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
