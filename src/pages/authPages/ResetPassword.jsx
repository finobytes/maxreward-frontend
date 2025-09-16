import React from "react";
import { useForm } from "react-hook-form";
import { logo, resetPassBgLeft, resetPassBgRight } from "../../assets/assets";
import ErrorMsg from "../../components/errorMsg/ErrorMsg";
import { useNavigate } from "react-router";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    navigate("/otp");
  };

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
              Forgot Password
            </h2>
            <p className="w-full text-gray-600 mt-2">
              Please enter email address / user ID you’d like the password reset
              information sent to
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5 w-full"
          >
            <div>
              <label
                htmlFor="userId"
                className="block text-lg font-medium text-gray-900"
              >
                User Id / Email Address
              </label>
              <div className="mt-2">
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  {...register("userId", {
                    required: "User Id / Email Address is required",
                  })}
                  autoComplete="username"
                  className={`block w-full rounded-md px-3 py-2 text-base text-gray-900 border ${
                    errors.userId
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#FF5A29] focus:ring-[#FF5A29]"
                  } placeholder:text-gray-400 focus:ring-2`}
                />
                {errors.userId && <ErrorMsg message={errors.userId.message} />}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                If an account exists for that email, you’ll receive a password
                reset code shortly.
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#FF5A29] mt-8 px-4 py-2 text-sm sm:text-base font-semibold text-white shadow hover:bg-[#FF5A29]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A29]"
              >
                Send Reset Link
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

export default ResetPassword;
