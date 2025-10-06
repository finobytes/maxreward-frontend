import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginBg, logo } from "../../assets/assets";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/auth/authSlice";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character"),
  remember: z.boolean().optional(),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Redirect user if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  // Quick Login Prefill Function
  const handleQuickLogin = (role) => {
    if (role === "admin") {
      setValue("email", "admin@demo.com");
      setValue("password", "Admin@123");
    } else if (role === "member") {
      setValue("email", "member@demo.com");
      setValue("password", "Member@123");
    }
  };

  // Form submit
  const onSubmit = (data) => {
    dispatch(login(data));
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

      {/* 🔹 Login Card */}
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
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={`mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF5A29] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter password"
              className={`mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF5A29] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
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
          {/*  Quick Login Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="px-3 py-1 text-sm border border-[#FF5A29] text-[#FF5A29] rounded-md hover:bg-[#FF5A29] hover:text-white transition"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("member")}
              className="px-3 py-1 text-sm border border-[#FF5A29] text-[#FF5A29] rounded-md hover:bg-[#FF5A29] hover:text-white transition"
            >
              Member
            </button>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className=" w-full bg-[#FF5A29] text-white py-2 rounded-md font-semibold hover:bg-[#FF5A29]/80 transition"
          >
            Log In
          </button>
        </form>
      </div>

      {/* 🔹 Footer */}
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
