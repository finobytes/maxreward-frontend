import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { logo, resetPassBgLeft, resetPassBgRight } from "../../assets/assets";
import ErrorMsg from "../../components/errorMsg/ErrorMsg";
import { useNavigate, useLocation } from "react-router";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const NewPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { userId, code } = location.state || {};

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!userId || !code) {
      navigate("/reset-password");
    }
  }, [userId, code, navigate]);

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        user_id: userId,
        code: code,
        new_password: data.newPassword,
        confirmation_password: data.confirmPassword,
      }).unwrap();
      toast.success(
        "Password reset successfully. Please login with your new password.",
      );
      navigate("/reset-success");
    } catch (err) {
      const errorMsg = err?.data?.message || "Failed to reset password";
      toast.error(errorMsg);
      setError("newPassword", {
        type: "manual",
        message: errorMsg,
      });
    }
  };

  if (!userId || !code) return null;

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Background Images (responsive scaling based on Figma ratio) */}
      <img
        className="absolute top-0 left-0 w-28 sm:w-40 md:w-56 2xl:w-80 h-auto"
        src={resetPassBgLeft}
        alt=""
      />
      <img
        className="absolute -top-1 right-0 w-20 sm:w-28 md:w-40 2xl:w-60 h-auto"
        src={resetPassBgRight}
        alt=""
      />

      {/* Centered Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 relative">
        <div className="w-full max-w-xl lg:max-w-3xl bg-white rounded-2xl shadow-md p-6 sm:p-8 md:p-10 relative z-10">
          <div className="flex flex-col items-center">
            <img
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain absolute -top-16 sm:-top-20 md:-top-20 lg:-top-20"
              src={logo}
              alt="Logo"
            />
          </div>
          <div className="mt-10">
            <h2 className="w-full text-2xl sm:text-3xl font-bold text-gray-600 mt-10">
              Reset Your Password
            </h2>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5 w-full"
          >
            <div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword")}
                    autoComplete="new-password"
                    className={`block w-full rounded-md px-3 py-2 pr-10 text-base text-gray-900 border ${
                      errors.newPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#FF5A29] focus:ring-[#FF5A29]"
                    } placeholder:text-gray-400 focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.newPassword && (
                    <ErrorMsg message={errors.newPassword.message} />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    autoComplete="new-password"
                    className={`block w-full rounded-md px-3 py-2 pr-10 text-base text-gray-900 border ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#FF5A29] focus:ring-[#FF5A29]"
                    } placeholder:text-gray-400 focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <ErrorMsg message={errors.confirmPassword.message} />
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#FF5A29] mt-8 px-4 py-2 text-sm sm:text-base font-semibold text-white shadow hover:bg-[#FF5A29]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A29] disabled:opacity-50"
              >
                {isLoading ? "Setting Password..." : "Set Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 p-4 text-center sm:text-left">
        <p className="text-gray-400 text-xs sm:text-sm">
          Copyright © 2025 <span className="text-[#FF5A29]">MaxReward</span>
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">
          Develop with ❤️ by <span className="text-blue-500">FinoBytes</span>
        </p>
      </footer>
    </div>
  );
};

export default NewPassword;
