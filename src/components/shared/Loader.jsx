import React from "react";
import { MaxReward } from "../../assets/assets";

const Loader = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img src={MaxReward} alt="Loading..." className="mx-auto" />
    </div>
  );
};

export default Loader;
