import React from "react";
import { userCardCenterLogo } from "../../assets/assets";

const MembershipCard = ({ data }) => {
  return (
    <div className="w-full aspect-[16/9] bg-[#735DFFB2] rounded-xl shadow-lg flex flex-col justify-between py-6 xl:max-w-max">
      <h2
        className="font-bold text-center text-white leading-tight px-3 whitespace-nowrap"
        style={{
          fontSize: "clamp(1.5rem, 2vw + 0.5rem, 2rem)", // scales smoothly
        }}
      >
        SEVEN ELEVEN <span className="text-brand-500">MAX REWARD</span>
      </h2>
      <div className="flex flex-col justify-center items-center py-3">
        <img src={userCardCenterLogo} />
      </div>
      <div className="bg-white flex justify-between items-center px-4 py-2 text-brand-500 font-bold text-lg sm:text-xl md:text-2xl">
        <span className="truncate max-w-[50%]">{data?.phone}</span>
        <span className="truncate text-right max-w-[45%]">{data?.name}</span>
      </div>
    </div>
  );
};

export default MembershipCard;
