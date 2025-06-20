import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "../../helper/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const reservationSchema = z.object({
  name: z.string().min(1, "Required"),
  phone: z.string().min(10, "Required"),
  persons: z.coerce.number().min(1, "At least 1 person"),
});
type ReservationForm = z.infer<typeof reservationSchema>;

const orderSchema = z.object({
  tableNumber: z.coerce.number().int().min(1, "Table number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  waiterId: z.string().uuid(),
  branchId: z.string().uuid(),
  status: z.string().min(1),
  placedAt: z.string().datetime(),
  specialInstructions: z.string().optional(),
  items: z.array(
    z.object({
      itemName: z.string().min(1, "Item name is required"),
      quantity: z.coerce.number().gte(0),
    })
  ),
});
type OrderForm = z.infer<typeof orderSchema>;

type TableBookProps = {
  isOpen: boolean;
  isWaiter: boolean;
  onclose: () => void;
  waiterId?: string;
  branchId?: string;
};

export default function TableBookModal({
  isOpen,
  isWaiter,
  onclose,
  waiterId,
  branchId,
}: TableBookProps) {
  if (!isOpen) return null;

  if (isWaiter) {
    const menuItems = [
      "Burger",
      "Fries",
      "Pizza",
      "Steak",
      "Grilled Chicken",
      "Pasta",
      "Caesar Salad",
      "Fish and Chips",
      "Tacos",
      "Cheesecake",
    ];
    const {
      register,
      handleSubmit,
      reset,
      setError,
      formState: { errors },
    } = useForm<OrderForm>({
      resolver: zodResolver(orderSchema),
      defaultValues: {
        tableNumber: 0,
        customerName: "",
        waiterId: waiterId || "",
        branchId: branchId || "",
        status: "pending",
        placedAt: new Date().toISOString(),
        specialInstructions: "",
        items: menuItems.map((itemName) => ({ itemName, quantity: 0 })),
      },
      mode: "onChange",
    });

    const queryClient = useQueryClient();
    const createOrderMutation = useMutation({
      mutationFn: (data: OrderForm) => createOrderRequest(data),
      onSuccess(response) {
        if (response?.success) {
          Toast(response.message, true);
          queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
          reset();
          onclose();
        } else {
          Toast(response?.message || "failed", false);
        }
      },
      onError: () => {
        Toast("Something went wrong. Please try again.", false);
      },
    });

    const createOrderRequest = async (data: OrderForm) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );
        const response = await fetch(
          import.meta.env.VITE_SERVER + "/v1/create-order",
          {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
          }
        );
        return await response.json();
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    const onSubmit = (data: OrderForm) => {
      const isQuantity = data.items.every((value) => {
        return value.quantity == 0;
      });

      if (isQuantity) {
        setError("items", {
          type: "manual",
          message: "Select a at least one item",
        });
        return;
      }
      data.items = data.items.filter((val) => val.quantity > 0);
      console.log(data);
      createOrderMutation.mutate(data);
    };

    const onerror = (error: any) => {
      console.log(error);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
          <button
            onClick={onclose}
            className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-[#ff5722]"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-[#ff5722] mb-4 text-center">
            New Table Order
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit, onerror)}
            className="space-y-4"
          >
            {/* Table Number */}
            <div>
              <label className="block font-semibold mb-1">Table Number</label>
              <input
                type="number"
                {...register("tableNumber")}
                className="w-full border rounded px-4 py-2"
              />
              {errors.tableNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.tableNumber.message}
                </p>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <label className="block font-semibold mb-1">Customer Name</label>
              <input
                {...register("customerName")}
                className="w-full border rounded px-4 py-2"
              />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Items Table */}
            <div className="max-h-[200px] overflow-y-auto ">
              <label className="block font-semibold mb-2">Menu Items</label>
              <table className="w-full table-auto border border-gray-300 mb-2 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2 text-left">Item Name</th>
                    <th className="border px-3 py-2 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((itemName, index) => (
                    <tr key={index}>
                      <td className="border px-3 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-3 py-2">{itemName}</td>
                      <td className="border px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          {...register(`items.${index}.quantity`)}
                          className="w-full border rounded px-2 py-1"
                        />
                        {/* Show error for quantity if any */}
                        {errors.items?.[index]?.quantity && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.items[index].quantity?.message}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {errors.items && (
              <p className="text-xs text-red-600 mt-1">
                {errors.items.message}
              </p>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block font-semibold mb-1">
                Special Instructions
              </label>
              <textarea
                {...register("specialInstructions")}
                className="w-full border rounded px-4 py-2"
                rows={3}
                placeholder="Any notes for the kitchen?"
              />
              {errors.specialInstructions && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.specialInstructions.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-semibold py-2 rounded"
            >
              Submit Order
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    // === Reservation Mode ===
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<ReservationForm>({
      resolver: zodResolver(reservationSchema),
      defaultValues: {
        name: "",
        phone: "",
        persons: 0,
      },
      mode: "onChange",
    });

    const onSubmit = (data: ReservationForm) => {
      Toast(`Reservation for ${data.name} (${data.persons}) received!`, true);
      reset();
      onclose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
          <button
            onClick={onclose}
            className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-[#ff5722]"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-[#ff5722] mb-4 text-center">
            Quick Reservation
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                {...register("name")}
                className="w-full border rounded px-4 py-2"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                {...register("phone")}
                className="w-full border rounded px-4 py-2"
                placeholder="Phone Number"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Persons */}
            <div>
              <label className="block font-semibold mb-1">Persons</label>
              <input
                type="number"
                {...register("persons")}
                className="w-full border rounded px-4 py-2"
              />
              {errors.persons && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.persons.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-semibold py-2 rounded"
            >
              Submit Reservation
            </button>
          </form>
        </div>
      </div>
    );
  }
}
