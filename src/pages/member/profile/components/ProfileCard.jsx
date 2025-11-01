import React from "react";
import {
  locationIcon,
  profile,
  profileCover,
  userProfile,
} from "../../../../assets/assets";
import {
  Coins,
  Lock,
  Award,
  Medal,
  Star,
  Users,
  Trophy,
  ShieldCheck,
} from "lucide-react";

const ProfileCard = ({ userInfo }) => {
  const walletInfo = userInfo?.wallet;
  console.log(walletInfo);
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 sm:px-2 sm:pt-6 lg:px-4 shadow-md">
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
            src={userProfile}
            className="rounded-full object-cover w-24 h-24 relative -top-12 left-6"
            alt="user profile"
          />

          <div className="absolute top-3 right-3">
            <div className="bg-white border-2 border-gray-300 flex items-center gap-2 px-2 py-0.5 rounded-xl">
              <img className="w-10 h-10" src={profile} alt="icon" />
              <span className="text-gray-700">{userInfo?.status}</span>
            </div>
          </div>
        </div>
      </div>
      <div className=" block 2xl:flex gap-4 2xl:justify-between relative -top-8">
        <div className="ml-2">
          <h3 className="text-xl font-semibold">{userInfo?.name}</h3>
          <p className="text-sm mt-2 text-gray-400 font-medium">
            {userInfo?.designation}
          </p>
          <div className="flex gap-4 mt-1">
            <div className="flex gap-1">
              <img src={locationIcon} alt="icon" />
              <span className="text-sm text-gray-400">{userInfo?.address}</span>
            </div>
          </div>
          {/* Wallet Info Section */}
          <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
            {/* Each info box */}
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Coins className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">
                Available:
                <span className="ml-1 text-blue-700 font-semibold">
                  {walletInfo?.available_points ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Lock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-gray-700">
                On Hold:
                <span className="ml-1 text-yellow-700 font-semibold">
                  {walletInfo?.onhold_points ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Award className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-medium text-gray-700">
                Total CP:
                <span className="ml-1 text-emerald-700 font-semibold">
                  {walletInfo?.total_cp ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Medal className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-gray-700">
                Total PP:
                <span className="ml-1 text-purple-700 font-semibold">
                  {walletInfo?.total_pp ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Star className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-medium text-gray-700">
                Total Points:
                <span className="ml-1 text-indigo-700 font-semibold">
                  {walletInfo?.total_points ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Users className="w-5 h-5 text-rose-600" />
              <p className="text-sm font-medium text-gray-700">
                Referrals:
                <span className="ml-1 text-rose-700 font-semibold">
                  {walletInfo?.total_referrals ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Trophy className="w-5 h-5 text-teal-600" />
              <p className="text-sm font-medium text-gray-700">
                Total RP:
                <span className="ml-1 text-teal-700 font-semibold">
                  {walletInfo?.total_rp ?? 0}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-gray-700">
                Level:
                <span className="ml-1 text-orange-700 font-semibold">
                  {walletInfo?.unlocked_level ?? 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
