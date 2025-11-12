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
  PenBox,
} from "lucide-react";

const ProfileCard = ({ userInfo, onEditClick = () => {} }) => {
  const walletInfo = userInfo?.wallet || {};

  // Star level logic (min 0, max 5)
  const totalReferrals = walletInfo.total_referrals || 0;
  const starCount = Math.min(totalReferrals, 5);
  const starLabel = starCount === 1 ? "1 Star" : `${starCount} Stars`;

  const renderStars = () => (
    <div className="flex gap-1 mt-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={18}
          className={
            i < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 sm:px-2 sm:pt-6 lg:px-4 shadow-md hover:shadow-lg transition-all duration-300">
      {/* Cover */}
      <div className="w-full relative">
        <img
          src={profileCover}
          className="w-full xl:h-[9rem] lg:h-[9rem] md:h-[7rem] sm:h-[7rem] h-[5rem] object-cover rounded-sm"
          alt="Profile cover"
        />

        {/* Profile Image */}
        <div className="w-full">
          <img
            src={userProfile}
            className="rounded-full object-cover w-24 h-24 relative -top-12 left-6 border-4 border-white shadow-md"
            alt="user profile"
          />

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-white border border-gray-300 flex items-center gap-2 px-2 py-1 rounded-xl shadow-sm">
              <img className="w-8 h-8" src={profile} alt="icon" />
              <span
                className={`text-sm font-medium capitalize ${
                  userInfo?.status === "active"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {userInfo?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="block 2xl:flex gap-4 2xl:justify-between relative -top-8">
        <div className="ml-2">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-xl font-semibold text-gray-800">
                {userInfo?.name}
              </h3>
              <p className="text-sm mt-1 text-gray-500 font-medium">
                {userInfo?.email ?? "Member"}
              </p>

              <div className="flex gap-3 mt-1 items-center">
                <img src={locationIcon} alt="icon" className="w-4 h-4" />
                <span className="text-sm text-gray-400">
                  {userInfo?.address ?? "N/A"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onEditClick}
              className="flex gap-1.5 bg-brand-25 text-white px-4 py-2 rounded-lg"
            >
              <PenBox /> <span>Edit</span>
            </button>
          </div>

          {/* Wallet Info Section */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
            <InfoBox
              icon={<Coins className="w-5 h-5 text-blue-600" />}
              label="Available Points"
              value={walletInfo.available_points ?? 0}
              color="blue"
            />

            <InfoBox
              icon={<Trophy className="w-5 h-5 text-teal-600" />}
              label="Referral Points"
              value={walletInfo.total_rp ?? 0}
              color="teal"
            />

            <InfoBox
              icon={<Lock className="w-5 h-5 text-amber-600" />}
              label="On Hold Points"
              value={walletInfo.onhold_points ?? 0}
              color="amber"
            />

            <InfoBox
              icon={<Award className="w-5 h-5 text-emerald-600" />}
              label="Community Points"
              value={walletInfo.total_cp ?? 0}
              color="emerald"
            />

            <InfoBox
              icon={<Medal className="w-5 h-5 text-purple-600" />}
              label="Personal Points"
              value={walletInfo.total_pp ?? 0}
              color="purple"
            />

            <InfoBox
              icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />}
              label="Total Points"
              value={walletInfo.total_points ?? 0}
              color="indigo"
            />

            <InfoBox
              icon={<Users className="w-5 h-5 text-rose-600" />}
              label="Total Referrals"
              value={walletInfo.total_referrals ?? 0}
              color="rose"
            />

            {/* Star Level Box */}
            <div className="flex flex-col items-start gap-1 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-600" />
                <p className="text-sm font-medium text-gray-700">Star Level</p>
              </div>

              {/* Star Icons */}
              <div className="ml-7">{renderStars()}</div>

              {/* Dynamic Text Label */}
              <p className="ml-7 text-sm font-semibold text-orange-700">
                {starLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable InfoBox Component
const InfoBox = ({ icon, label, value, color }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-${color}-50 border border-${color}-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="p-2 bg-white rounded-full border border-gray-100 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-700 font-medium">{label}</p>
        <p className={`text-lg font-semibold text-${color}-700`}>{value}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
