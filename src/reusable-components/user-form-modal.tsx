import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCircleNotch, FaTimes } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toast } from "../helper/toast";

const schema = z.object({
  id: z.string().optional(),
  fullname: z.string().min(1, "Required"),
  userName: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  password: z.string().optional(),
  branchId: z.string().optional(),
});

type User = z.infer<typeof schema>;

type UserProps = {
  isOpen: boolean;
  onClose: () => void;
  updateData?: Partial<User> | null;
  userRole: string;
};

export default function UserFormModal({
  isOpen,
  onClose,
  updateData = null,
  userRole,
}: UserProps) {
  const [showPassword, setShowPassword] = useState(!updateData);
  const queryClient = useQueryClient();

  const predefinedRoles =
    userRole === "manager"
      ? ["manager", "admin", "branch manager", "chef"]
      : ["branch manager", "chef"];

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: "",
      userName: "",
      role: userRole === "manager" ? "manager" : "chef",
      password: "",
      branchId: "",
    },
  });

  const currentRole = watch("role");

  const { data: branchResponse } = useQuery({
    queryKey: ["fetchBranches"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/v1/fetch-branches`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (!result.success || result.data?.length === 0) {
        Toast(result.message || "Branches not found", false);
      }
      return result;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/v1/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(user),
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        Toast(data.message, true);
        reset();
        onClose();
        queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
      } else Toast(data.message, false);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/v1/update-user/${updateData?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(user),
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        Toast(data.message, true);
        reset();
        onClose();
        queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
      } else Toast(data.message, false);
    },
  });

  useEffect(() => {
    if (updateData) {
      reset({
        fullname: updateData.fullname || "",
        userName: updateData.userName || "",
        role: updateData.role || "manager",
        password: "",
        branchId: updateData.branchId || "",
      });
    } else {
      reset();
    }
  }, [updateData, reset]);

  const onSubmit = (user: User) => {
    if (user.role === "branch manager" && !user.branchId) {
      setError("branchId", {
        type: "manual",
        message: "Select a branch for branch manager",
      });
      return;
    }

    if (user.role !== "branch manager") {
      delete user.branchId;
    }

    if (showPassword && !user.password) {
      setError("password", {
        type: "manual",
        message: "Required",
      });
      return;
    }

    if (!user.password) {
      delete user.password;
    }

    updateData
      ? updateUserMutation.mutate(user)
      : createUserMutation.mutate(user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-[#ff5722]">
          {updateData ? "Update User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              {...register("fullname")}
              className="w-full border px-3 py-2 rounded"
              type="text"
              placeholder="Full Name"
            />
            {errors.fullname && (
              <p className="text-sm text-red-600">{errors.fullname.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              {...register("userName")}
              className="w-full border px-3 py-2 rounded"
              type="text"
              placeholder="User Name"
            />
            {errors.userName && (
              <p className="text-sm text-red-600">{errors.userName.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              {...register("role")}
              className="w-full border px-3 py-2 rounded capitalize"
            >
              {predefinedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {currentRole === "branch manager" && (
            <div>
              <label className="block mb-1 font-medium">Branch</label>
              <select
                {...register("branchId")}
                className="w-full border px-3 py-2 rounded capitalize"
              >
                <option value="" disabled={true}>Select Branch</option>
                {branchResponse?.data?.map((branch: any) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <p className="text-sm text-red-600">
                  {errors.branchId.message}
                </p>
              )}
            </div>
          )}

          {updateData && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="togglePassword"
                checked={showPassword}
                onChange={(e) => {
                  setValue("password", "");
                  setShowPassword(e.target.checked);
                }}
                className="w-4 h-4"
              />
              <label htmlFor="togglePassword" className="text-sm">
                Set or Update Password
              </label>
            </div>
          )}

          {showPassword && (
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                {...register("password")}
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-orange-700 text-white rounded transition"
            >
              {updateData ? "Update User" : "Create User"}
              {(createUserMutation.isPending ||
                updateUserMutation.isPending) && (
                <FaCircleNotch className="animate-spin" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
