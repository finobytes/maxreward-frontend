import React from "react";
import {
  card,
  dollar,
  hand,
  purchase,
  star,
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
      subtitle: "Current Balance",
      chartColor: "#8B5CF6",
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: hand,
      title: "On Hold Points",
      value: wallet.onhold_points ?? "8,221",
      subtitle: "Pending Rewards",
      chartColor: "#10B981",
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: users,
      title: "Referral Points",
      value: wallet.total_rp ?? "4,876",
      subtitle: "Earned from Referrals",
      chartColor: "#F59E0B",
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: userCommunity,
      title: "Community Members",
      value: wallet.total_referrals ?? "45",
      subtitle: "Your Active Members",
      chartColor: "#3B82F6",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: purchase,
      title: "Lifetime Purchase",
      value: wallet.total_pp ?? "2,341",
      subtitle: "All-time Purchase Points",
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
          <img
            src={card}
            alt="Membership Card"
            className="rounded-xl w-full shadow-lg"
          />
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
