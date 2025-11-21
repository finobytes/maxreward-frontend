import React from "react";
import {
  dollar,
  hand,
  purchase,
  star,
  userCommunity,
  users,
} from "../../../assets/assets";
import {
  Wallet,
  HandCoins,
  UsersRound,
  Users,
  ShoppingCart,
  Award,
  Star,
} from "lucide-react";

import DashboardCard from "./components/DashboardCard";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import MemberDashboardSkeleton from "../../../components/skeleton/MemberDashboardSkeleton";
import MembershipCard from "../../../components/common/MembershipCard";

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
  const totalReferrals = wallet.total_referrals || 0;

  // Limit stars between 0–5
  const starCount = Math.min(totalReferrals, 5);

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
      icon: <Wallet size={22} />,
      title: "Available Points",
      value: wallet.available_points ?? "0",
      subtitle: "Increased",
      chartColor: "#8B5CF6",
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: <HandCoins size={22} />,
      title: "On Hold Points",
      value: wallet.onhold_points ?? "0",
      subtitle: "Increased",
      chartColor: "#10B981",
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: <UsersRound size={22} />,
      title: "Referral Points",
      value: wallet.total_rp ?? "0",
      subtitle: "Increased",
      chartColor: "#F59E0B",
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: <Users size={22} />,
      title: "Community Members",
      value: data.community_members ?? "0",
      subtitle: "Increased",
      chartColor: "#3B82F6",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: <ShoppingCart size={22} />,
      title: "Lifetime Purchase",
      value: data.lifetime_purchase ?? "0",
      subtitle: "Increased",
      chartColor: "#EC4899",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: <Award size={22} />,
      title: "Community Points",
      value: wallet.total_cp ?? "0",
      subtitle: "Increased",
      chartColor: "#8B5CF6",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: <Star className="text-yellow-400" size={22} />,
      title: "Star Level",
      value: starLabel,
      subtitle: starDisplay,
      chartColor: "#FFD700",
      chartData: [1, 2, 3, 4, 5, starCount],
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-600 pb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <MembershipCard data={data} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {cardsData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
