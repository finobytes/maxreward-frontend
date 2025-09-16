import React from "react";
import { useForm } from "react-hook-form";
import { logo, resetPassBgLeft, resetPassBgRight } from "../../assets/assets";
import ErrorMsg from "../../components/errorMsg/ErrorMsg";
import { Link } from "react-router";
import OTPInput from "../../components/formComponents/OTPInput";

const OTP = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log("Form Data:", data);
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
              Get Code From Your Email
            </h2>
            <p className="w-full text-gray-600 mt-2 text-sm">
              We’ve sent a password reset code to your registered email address.
              Please check your inbox (and spam folder) and enter the code to
              continue.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5 w-full"
          >
            <div className="mt-2 flex justify-center">
              <OTPInput />
            </div>

            <Link
              to="#"
              className="block mt-8 text-indigo-500 text-center font-semibold"
            >
              Resend Code
            </Link>
            <div>
              <Link
                to="/new-password"
                className="w-full block text-center rounded-md bg-[#FF5A29] mt-8 px-4 py-2 text-sm sm:text-base font-semibold text-white shadow hover:bg-[#FF5A29]/80"
              >
                Continue
              </Link>
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

export default OTP;
