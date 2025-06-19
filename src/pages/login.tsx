import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { IsToken } from "../helper/isToken";
import { FaBackspace, FaCircleNotch } from "react-icons/fa";
import { Toast } from "../helper/toast";

const schema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof schema>;

export default function Login() {
  const router = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const LoginMutation = useMutation({
    mutationFn: (loginData: LoginForm) => loginRequest(loginData),
    onSuccess(response) {
      if (response?.success) {
        Toast(response.message, true);
        const { token, username, role, id, fullname } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        localStorage.setItem("fullname", fullname);
        router("/dashboard");
      } else {
        Toast(response?.message || "Login failed", false);
      }
    },
    onError: () => {
      Toast("Something went wrong. Please try again.",false);
    },
  });

  const loginRequest = async (data: LoginForm) => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER + "/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const submitLoginForm = (data: LoginForm) => {
    LoginMutation.mutate(data);
  };

  useEffect(() => {
    if (IsToken()) {
      router("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#ff5722]">
          Login
        </h2>

        <form onSubmit={handleSubmit(submitLoginForm)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              type="text"
              {...register("username")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={LoginMutation.isPending}
            className="w-full flex justify-center items-center gap-x-2.5 bg-[#ff5722] hover:bg-[#e64a19] text-white py-2 rounded transition"
          >
            Login{" "}
            {LoginMutation.isPending && (
              <FaCircleNotch className="animate-spin" />
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 ">
          <Link to="/" className="text-[#ff5722] flex justify-center items-center gap-x-1.5">
            <FaBackspace size={18}/>
            <span>Home</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
