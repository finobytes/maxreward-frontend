import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginBg, logo } from "../../assets/assets";
import { Link } from "react-router";

// ✅ Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character"),
  remember: z.boolean().optional(),
});

const Login = () => {
  // ✅ useForm with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("Validated Login Data:", data);
    // ✅ API call / Firebase login logic here
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* ✅ Background Image */}
      <img
        src={loginBg}
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
      />

      {/* ✅ White Login Card */}
      <div className="relative bg-white shadow-md rounded-2xl px-10 py-8 w-[400px] max-w-full z-10">
        <div className="flex flex-col items-center">
          {/* Logo Circle */}
          <div className="w-24 h-24 rounded-full bg-[#FF5A29]/10 flex items-center justify-center">
            <img src={logo} alt="logo" />
          </div>
          <h1 className="text-[#FF5A29] text-2xl font-bold">MaxReward</h1>
        </div>

        <p className="text-[#FF5A29] text-sm mt-4 mb-1">Welcome Back !</p>
        <p className="text-gray-500 text-sm mb-4">
          Sign in to continue to Max Reward
        </p>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              User Name or Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email Address"
              {...register("email")}
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

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              {...register("password")}
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

          {/* Remember Me */}
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-3 w-full bg-[#FF5A29] text-white py-2 rounded-md font-semibold hover:bg-[#FF5A29]/80 transition"
          >
            Log In
          </button>
        </form>
      </div>

      {/* ✅ Footer */}
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
