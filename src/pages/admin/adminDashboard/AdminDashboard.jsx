import React from "react";
import { bag, clock, dollar, users } from "../../../assets/assets";
import DashboardCard from "./components/DashboardCard";
import RealTimeTransactions from "./components/RealTimeTransactions";
import MemberActivity from "./components/MemberActivity";
import PointsIssuedRedeemed from "./components/PointsIssuedRedeemed";
import PointsRedeemed from "./components/PointsRedeemed";
import PointsPurchased from "./components/PointsPurchased";
import AudienceReport from "./components/AudienceReport";
import MemberOnboard from "./components/MemberOnboard";
import VisitorsByGender from "./components/VisitorsByGender";
import { useGetDashboardStatsQuery } from "../../../redux/features/admin/dashboard/dashboardApi";
import AdminDashboardSkeleton from "../../../components/skeleton/AdminDashboardSkeleton";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const stats = {
    total_members: data?.total_members ?? 0,
    total_merchants: data?.total_merchants ?? 0,
    total_transactions: data?.total_transactions ?? 0,
    total_merchant_approvals: data?.total_merchant_approvals ?? 0,
  };

  const cardsData = [
    {
      icon: users,
      title: "Total Members",
      value: stats.total_members.toLocaleString(),
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#8B5CF6",
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: bag,
      title: "Total Merchants",
      value: stats.total_merchants.toLocaleString(),
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#F97316",
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: dollar,
      title: "Total Transactions",
      value: stats.total_transactions.toLocaleString(),
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#10B981",
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: clock,
      title: "Merchant Approvals",
      value: stats.total_merchant_approvals.toLocaleString(),
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#3B82F6",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
  ];

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-600 pb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <RealTimeTransactions />
        </div>
        <div className="lg:col-span-1">
          <MemberActivity />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PointsIssuedRedeemed />
        <PointsRedeemed />
        <PointsPurchased />
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AudienceReport />
        <MemberOnboard />
        <VisitorsByGender />
      </div>
    </div>
  );
};

export default AdminDashboard;
