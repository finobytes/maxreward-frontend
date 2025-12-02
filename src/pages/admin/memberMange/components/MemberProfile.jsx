import React from "react";
import {
  bag2,
  cityIcon,
  locationIcon,
  profile,
  profileCover,
  userImage,
  userProfile,
  users2,
} from "../../../../assets/assets";

const MemberProfile = ({ member }) => {
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
            src={member?.image || userImage}
            className="rounded-full object-cover w-24 h-24 relative -top-12 left-6"
            alt="user profile"
          />

          <div className="absolute top-3 right-3">
            <div className="bg-white border-2 border-gray-300 flex items-center gap-2 px-2 py-0.5 rounded-xl">
              <img className="w-10 h-10" src={profile} alt="icon" />
              <span className="text-gray-700">
                {member?.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" block 2xl:flex gap-4 2xl:justify-between relative -top-8">
        <div className="ml-2">
          <h3 className="text-2xl font-semibold">{member.name}</h3>
          <p className="mt-4 text-gray-400">
            Member Type: {member.member_type}
          </p>
          {member.status === "blocked" ? (
            <>
              <p className="mt-2 text-red-500 font-medium">
                Blocked By: {member?.blocked_by?.name}
              </p>{" "}
              <p>Reason: {member?.block_reason}</p>
            </>
          ) : null}
          {member.status === "suspended" ? (
            <>
              <p className="mt-2 text-red-500 font-medium">
                Suspended By: {member?.suspended_by?.name}
              </p>{" "}
              <p>Reason: {member?.suspended_reason}</p>
            </>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-start items-center gap-4 mt-4 2xl:mt-0">
          <div className="border-2 border-gray-300 flex items-center gap-4 px-2 py-0.5 rounded-full">
            <img className="w-10 h-10" src={users2} alt="icon" />
            <div className="pr-3">
              <p>{member?.wallet?.total_referrals || 0}</p>
              <span className="text-sm text-gray-600">Referrals</span>
            </div>
          </div>
          <div className="border-2 border-gray-300 flex items-center gap-4 px-2 py-0.5 rounded-full">
            <img className="w-10 h-10" src={profile} alt="icon" />
            <div className="pr-3">
              <p>RM {member?.lifetime_purchase || 0}</p>
              <span className="text-sm text-gray-600">Purchased</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberProfile;
