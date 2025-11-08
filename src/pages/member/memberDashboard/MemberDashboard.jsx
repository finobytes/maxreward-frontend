import React from "react";
import {
  card,
  dollar,
  hand,
  purchase,
  star,
  userCardCenterLogo,
  userCommunity,
  users,
} from "../../../assets/assets";
import DashboardCard from "./components/DashboardCard";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { Star } from "lucide-react";
import MemberDashboardSkeleton from "../../../components/skeleton/MemberDashboardSkeleton";

const MemberDashboard = () => {
  const { data, isLoading, isFetching, isError } = useVerifyMeQuery();

  // Show skeleton while loading
  if (isLoading || isFetching) return <MemberDashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Failed to load dashboard data.
      </div>
    );
  }
  console.log("data", data);
  const wallet = data?.wallet || {};
  const unlockedLevel = wallet.unlocked_level || 0;

  // Limit stars between 0–5
  const starCount = Math.min(unlockedLevel, 5);

  // Text label (1 Star / 2 Stars / etc.)
  const starLabel = starCount === 1 ? "1 Star" : `${starCount} Stars`;

  // Star icons display
  const starDisplay = (
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

  // Dashboard cards
  const cardsData = [
    {
      icon: dollar,
      title: "Available Points",
      value: wallet.available_points ?? "12,432",
      subtitle: "Increased",
      chartColor: "#8B5CF6",
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: hand,
      title: "On Hold Points",
      value: wallet.onhold_points ?? "8,221",
      subtitle: "Increased",
      chartColor: "#10B981",
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: users,
      title: "Referral Points",
      value: wallet.total_rp ?? "4,876",
      subtitle: "Increased",
      chartColor: "#F59E0B",
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: userCommunity,
      title: "Community Members",
      value: wallet.total_referrals ?? "45",
      subtitle: "Increased",
      chartColor: "#3B82F6",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: purchase,
      title: "Lifetime Purchase",
      value: wallet.total_pp ?? "2,341",
      subtitle: "Increased",
      chartColor: "#EC4899",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: star,
      title: "Star Level",
      value: starLabel, // "1 Star" / "2 Stars" / etc.
      subtitle: starDisplay, // Star icons
      chartColor: "#FFD700",
      chartData: [1, 2, 3, 4, 5, starCount],
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-600 pb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* <img
            src={card}
            alt="Membership Card"
            className="rounded-xl w-full shadow-lg"
          /> */}
          <div className="w-full aspect-[16/9] bg-[#735DFFB2] rounded-xl shadow-lg flex flex-col justify-between py-6 xl:max-w-max">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-center text-white leading-tight px-3">
              SEVEN ELEVEN <span className="text-brand-500">MAX REWARD</span>
            </h2>
            <div className="flex flex-col justify-center items-center py-3">
              <img src={userCardCenterLogo} />
            </div>
            <div className="bg-white flex justify-between items-center px-4 py-2 text-brand-500 font-bold text-lg sm:text-xl md:text-2xl">
              <span className="truncate max-w-[50%]">{data?.phone}</span>
              <span className="truncate text-right max-w-[45%]">
                {data?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
