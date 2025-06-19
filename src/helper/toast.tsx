import toast from "react-hot-toast";

export function Toast(message: string, isSuccess: boolean) {
  toast.custom(
    <div
      className={`max-w-sm w-full p-4 rounded shadow-md border-l-4 ${
        isSuccess
          ? "bg-green-50 border-green-500 text-green-800"
          : "bg-red-50 border-red-500 text-red-800"
      }`}
    >
      <h3 className="text-sm font-semibold mb-1">
        {isSuccess ? "Success" : "Error"}
      </h3>
      <p className="text-sm">{message}</p>
    </div>,
    { duration: 4000 }
  );
}
