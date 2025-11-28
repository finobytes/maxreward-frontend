import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginBg, logo } from "../../assets/assets";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { loginSchema } from "../../schemas/auth/loginSchema";
import { Spinner } from "@/components/ui/spinner.jsx";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loginApi, { data, isSuccess, isError, error, isLoading }] =
    useLoginMutation();
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Form submit
  const onSubmit = async (formData) => {
    try {
      const res = await loginApi(formData).unwrap();
      console.log("Login success:", res);
      toast.success("Login successful");

      dispatch(
        setCredentials({
          user: {
            role: formData.userName.startsWith("A")
              ? "admin"
              : formData.userName.startsWith("M")
              ? "merchant"
              : "member",
          },
          token: res.access_token,
        })
      );

      // Redirect role
      navigate(
        formData.userName.startsWith("A")
          ? "/admin"
          : formData.userName.startsWith("M")
          ? "/merchant"
          : "/member"
      );
    } catch (err) {
      console.error("Login failed:", err);

      // error handling
      if (
        err?.status === "FETCH_ERROR" ||
        err?.error?.includes("Failed to fetch")
      ) {
        toast.error(
          "Unable to connect to server. Please check your internet or try again later."
        );
      } else if (err?.status === 401 || err?.status === 400) {
        toast.error("Invalid username or password.");
      } else if (err?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image */}
      <img
        src={loginBg}
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
      />

      {/* Login Card */}
      <div className="relative bg-white shadow-md rounded-2xl px-10 py-8 w-[400px] max-w-full z-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#FF5A29]/10 flex items-center justify-center">
            <img src={logo} alt="logo" />
          </div>
          <h1 className="text-[#FF5A29] text-2xl font-bold">MaxReward</h1>
        </div>

        <p className="text-[#FF5A29] text-sm mt-4 mb-1">Welcome Back!</p>
        <p className="text-gray-500 text-sm mb-4">
          Sign in to continue to Max Reward
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              {...register("userName")}
              placeholder="Enter your user ID"
              className={`mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF5A29] ${
                errors.userName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.userName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter password"
              className={`mt-1 w-full border rounded-md px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#FF5A29] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[34px] right-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("remember")}
                className="accent-[#FF5A29] w-4 h-4"
              />
              Remember me
            </label>
            <Link
              to="/reset-password"
              className="text-[#FF5A29] hover:text-[#FF5A29]/70 font-medium"
            >
              Forgot password?
            </Link>
          </div>{" "}
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center gap-2 w-full bg-[#FF5A29] text-white py-2 rounded-md font-semibold hover:bg-[#FF5A29]/80 transition disabled:opacity-70"
          >
            {isLoading && <Spinner />} {/* Spinner when loading */}
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-white py-3 px-6 flex justify-between text-xs text-gray-500">
        <p>
          Copyright © 2025{" "}
          <span className="text-[#FF5A29] font-medium">MaxRewards</span>
        </p>
        <p>
          Develop with ❤️ by{" "}
          <span className="text-blue-500 font-medium">FinoBytes</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
