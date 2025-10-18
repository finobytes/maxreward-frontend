import React from "react";
import {
  cityIcon,
  locationIcon,
  profile,
  profileCover,
  userProfile,
} from "../../../../assets/assets";

const StaffProfile = ({ member }) => {
  return (
    <section className="w-full overflow-hidden">
      <div className="w-full">
        {/* User Cover IMAGE */}
        <img
          src={profileCover}
          className="w-full xl:h-[9rem] lg:h-[9rem] md:h-[7rem] sm:h-[7rem] h-[5rem] rounded-sm"
          alt="Profile cover"
        />

        {/* User Profile Image */}
        <div className="w-full">
          <img
            src={userProfile}
            className="rounded-full object-cover w-24 h-24 relative -top-12 left-6"
            alt="user profile"
          />
        </div>
      </div>
      <div className=" block 2xl:flex gap-4 2xl:justify-between relative -top-8">
        <div className="ml-2">
          <h3 className="text-2xl font-semibold">{member.name}</h3>
          <p className="mt-4 text-gray-400">Chief Executive Officer</p>
          <div className="flex gap-4 mt-1">
            <div className="flex gap-1">
              <img src={cityIcon} alt="icon" />
              <span className="text-sm text-gray-400">Georgia</span>
            </div>
            <div className="flex gap-1">
              <img src={locationIcon} alt="icon" />
              <span className="text-sm text-gray-400">Washington D.C</span>
            </div>
          </div>
        </div>
        <div className="mt-4 2xl:mt-0">
          <div className="border-2 border-gray-300 flex items-center gap-4 px-2 py-0.5 rounded-full">
            <img className="w-10 h-10" src={profile} alt="icon" />
            <div className="">
              <span className="text-sm text-gray-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffProfile;
