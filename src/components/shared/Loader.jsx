import React from "react";

const Loader = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <h1 className="text-5xl font-extrabold text-[#ff5a29] animate-apple-logo">
        MaxReword
      </h1>
      <div className="mt-6 w-4 h-4 rounded-full bg-[#ff5a29] animate-ping opacity-70"></div>
    </div>
  );
};

export default Loader;
