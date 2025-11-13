import React from "react";
import {
  locationIcon,
  profile,
  profileCover,
  userProfile,
} from "../../../../assets/assets";

const MerchantProfileCard = ({ merchant }) => {
  return (
    <section className="w-full overflow-hidden">
      <div className="w-full relative">
        {/* User Cover IMAGE */}
        <img
          src={profileCover}
          className="w-full xl:h-[9rem] lg:h-[9rem] md:h-[7rem] sm:h-[7rem] h-[5rem] rounded-sm"
          alt="Profile cover"
        />

        {/* User Profile Image */}
        <div className="w-full">
          <img
            src={merchant?.business_logo || userProfile}
            className="rounded-full object-cover w-24 h-24 relative -top-12 left-6"
            alt="user profile"
          />

          <div className="absolute top-3 right-3">
            <div className="bg-white border-2 border-gray-300 flex items-center gap-2 px-2 py-0.5 rounded-xl">
              <img className="w-10 h-10" src={profile} alt="icon" />
              <span className="text-gray-700">
                {merchant?.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" block 2xl:flex gap-4 2xl:justify-between relative -top-8">
        <div className="ml-2">
          <h3 className="text-xl font-semibold">{merchant?.business_name}</h3>
          <p className="text-sm mt-2 text-gray-400 font-medium">
            Unique Number: {merchant?.unique_number}
          </p>
          {/* <div className="flex gap-4 mt-1">
            <div className="flex gap-1">
              <img src={locationIcon} alt="icon" />
              <span className="text-sm text-gray-400">{merchant?.address}</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MerchantProfileCard;
