import React from "react";
import { bag, clock, dollar, users } from "../../../assets/assets";
import DashboardCard from "./components/DashboardCard";
import RealTimeTransactions from "./components/RealTimeTransactions";
import PurchasedVsRedeemed from "./components/PurchasedVsRedeemed";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import MembershipCard from "../../../components/common/MembershipCard";
import MemberDashboardSkeleton from "../../../components/skeleton/MemberDashboardSkeleton";

const MerchantDashboard = () => {
  const { data, isLoading, isFetching, isError } = useVerifyMeQuery("merchant");

  // Show skeleton while loading
  if (isLoading || isFetching) return <MemberDashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Failed to load dashboard data.
      </div>
    );
  }
  console.log("data", data?.merchant);
  const wallet = data?.merchant?.corporate_member?.wallet || {};
  const cardsData = [
    {
      icon: bag,
      title: "Available Points",
      value: wallet.available_points || "0",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#8B5CF6", // purple
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: clock,
      title: "On Hold Points",
      value: wallet.onhold_points || "0",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#F97316", // orange
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: dollar,
      title: "Referral Points",
      value: wallet.total_rp || "0",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#10B981", // green
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: clock,
      title: "Pending Purchase",
      value: data.total_pending_purchase || "0",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#3B82F6", // blue
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: users,
      title: "Community Member",
      value: data.community_members || "0",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#3B82F6", // blue
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
  ];

  return (
    <div>
      <h1 className="text-base md:text-lg lg:text-xl font-semibold text-gray-600 pb-4">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="2xl:col-span-1">
          <MembershipCard data={data} role="merchant" />
        </div>
        <div className="2xl:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {cardsData.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
      {/* <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <RealTimeTransactions />
        </div>
        <div className="lg:col-span-1">
          <PurchasedVsRedeemed />
        </div>
      </div> */}
    </div>
  );
};

export default MerchantDashboard;
