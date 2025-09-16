import React from "react";
import { logo, resetPassBgLeft, resetPassBgRight } from "../../assets/assets";
import { Link } from "react-router";

const ResetSuccess = () => {
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
            <h2 className="text-center w-full text-2xl sm:text-3xl font-bold text-gray-600 mt-10">
              Password Changed
            </h2>
            <p className="text-center mt-4">
              Your Password was changed successfully
            </p>
          </div>
          <Link
            to={"/"}
            className="block max-w-[252px] mx-auto rounded-md
            bg-[#FF5A29] mt-12 px-4 py-2 text-sm sm:text-base font-semibold
            text-white shadow hover:bg-[#FF5A29]/80 text-center"
          >
            Back to Log In
          </Link>
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

export default ResetSuccess;
