import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { logo, resetPassBgLeft, resetPassBgRight } from "../../assets/assets";
import ErrorMsg from "../../components/errorMsg/ErrorMsg";
import { Link, useLocation, useNavigate } from "react-router";
import OTPInput from "../../components/form/form-elements/OTPInput";
import { toast } from "sonner";
import {
  useVerifyResetCodeMutation,
  useRequestResetCodeMutation,
} from "../../redux/features/auth/authApi";

const schema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

const OTP = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [verifyResetCode, { isLoading }] = useVerifyResetCodeMutation();
  const [requestResetCode] = useRequestResetCodeMutation();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!userId) {
      // Redirect to start if no user ID provided
      navigate("/reset-password");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const onSubmit = async (data) => {
    try {
      await verifyResetCode({ user_id: userId, code: data.code }).unwrap();
      toast.success("Code verified successfully");
      navigate("/new-password", { state: { userId, code: data.code } });
    } catch (err) {
      const errorMsg = err?.data?.message || "Invalid or expired code";
      toast.error(errorMsg);
      setError("code", {
        type: "manual",
        message: errorMsg,
      });
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (timeLeft > 0) return;

    try {
      await requestResetCode({ user_id: userId }).unwrap();
      setTimeLeft(60);
      toast.success("Reset code resent successfully");
    } catch (err) {
      console.error("Failed to resend code", err);
      toast.error(err?.data?.message || "Failed to resend code");
    }
  };

  if (!userId) return null; // Avoid rendering if redirecting

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
            <div className="mt-2 flex flex-col items-center justify-center">
              <Controller
                name="code"
                control={control}
                render={({ field: { onChange } }) => (
                  <OTPInput length={6} onChange={onChange} />
                )}
              />
              {errors.code && (
                <div className="mt-2 w-full text-center">
                  <ErrorMsg message={errors.code.message} />
                </div>
              )}
            </div>

            <button
              onClick={handleResend}
              type="button"
              disabled={timeLeft > 0}
              className={`block w-full mt-8 text-center font-semibold ${
                timeLeft > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-500 hover:text-indigo-600"
              }`}
            >
              {timeLeft > 0 ? `Resend Code in ${timeLeft}s` : "Resend Code"}
            </button>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full block text-center rounded-md bg-[#FF5A29] mt-8 px-4 py-2 text-sm sm:text-base font-semibold text-white shadow hover:bg-[#FF5A29]/80 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Continue"}
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

export default OTP;
