import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "../../helper/toast";

const schema = z.object({
  name: z.string().min(1, "Required"),
  phone: z.string().min(10, "Required"),
  persons: z.coerce.number().min(1, "At least 1 person"),
});

type TableBookForm = z.infer<typeof schema>;
type TableBookProps = {
  isOpen: boolean;
  onclose: () => void;
};
export default function TableBookModal({ isOpen, onclose }: TableBookProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableBookForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      persons: 0,
    },
    mode: "onChange",
  });

  const onSubmit = (data: TableBookForm) => {
    console.log("Reservation Data:", data);
    reset();
    Toast(
      `Reservation for ${data.name} (${data.persons} person(s)) received!`,
      true
    );

    onclose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onclose}
          className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-[#ff5722] focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#ff5722] mb-4 text-center">
          Quick Reservation
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              {...register("name")}
              placeholder="Your Full Name"
              className="w-full border border-[#ff5722]/40 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              {...register("phone")}
              placeholder="Your Phone Number"
              className="w-full border border-[#ff5722]/40 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Number of Persons
            </label>
            <input
              type="number"
              {...register("persons")}
              min={1}
              className="w-full border border-[#ff5722]/40 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
            />
            {errors.persons && (
              <p className="text-sm text-red-600 mt-1">
                {errors.persons.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-semibold py-2 rounded transition"
          >
            Submit Reservation
          </button>
        </form>
      </div>
    </div>
  );
}
