import React from "react";
import { bag, clock, dollar, users } from "../../../assets/assets";
import DashboardCard from "./components/DashboardCard";
import RealTimeTransactions from "./components/RealTimeTransactions";
import MemberActivity from "./components/MemberActivity";
import PointsIssuedRedeemed from "./components/PointsIssuedRedeemed";
import PointsRedeemed from "./components/PointsRedeemed";
import PointsPurchased from "./components/PointsPurchased";
import {
  useGetDashboardStatsQuery,
  useGetRealTimeTransactionsQuery,
} from "../../../redux/features/admin/dashboard/dashboardApi";
import AdminDashboardSkeleton from "../../../components/skeleton/AdminDashboardSkeleton";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const {
    data: realTimeTransactions,
    isLoading: isRealTimeLoading,
    isError: isRealTimeError,
  } = useGetRealTimeTransactionsQuery();
  const dashboard = data ?? {};
  const stats = {
    total_members: dashboard?.total_members ?? 0,
    total_active_members: dashboard?.total_active_members ?? 0,
    new_members_last_7_days: dashboard?.new_members_last_7_days ?? 0,
    total_merchants: dashboard?.approved_merchants ?? 0,
    total_transactions: dashboard?.total_transactions ?? 0,
    pending_merchants: dashboard?.pending_merchants ?? 0,
    total_points_earned: dashboard?.total_points_earned ?? 0,
    total_pending_vouchers: dashboard?.total_pending_vouchers ?? 0,
  };
  const pointsRedeemedStats = dashboard?.points_redeemed_statistics ?? {};
  const pointsIssuedVsRedeemed = dashboard?.points_issued_vs_redeemed ?? {};
  const voucherStats = dashboard?.voucher_statistics ?? {};

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
      title: "Pending Merchant",
      value: stats.pending_merchants.toLocaleString(),
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#3B82F6",
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: clock,
      title: "Pending Voucher",
      value: stats.total_pending_vouchers.toLocaleString(),
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#FFD700",
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
      <h1 className="text-base md:text-lg lg:text-xl font-semibold text-gray-600 pb-4">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cardsData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <RealTimeTransactions
            labels={realTimeTransactions?.labels}
            purchased={realTimeTransactions?.purchased}
            redeemed={realTimeTransactions?.redeemed}
            isLoading={isRealTimeLoading}
            isError={isRealTimeError}
          />
        </div>
        <div className="lg:col-span-1">
          <MemberActivity stats={stats} />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PointsIssuedRedeemed
          issued={pointsIssuedVsRedeemed?.points_issued}
          redeemed={pointsIssuedVsRedeemed?.points_redeemed}
          liability={pointsIssuedVsRedeemed?.points_liability}
        />
        <PointsRedeemed
          shopping={pointsRedeemedStats?.shopping_points_redeemed}
          newRegistration={pointsRedeemedStats?.new_registration_points_redeemed}
          total={pointsRedeemedStats?.total_points_redeemed}
        />
        <PointsPurchased
          max={voucherStats?.max_vouchers_purchased}
          refer={voucherStats?.refer_vouchers_purchased}
          total={voucherStats?.total_vouchers_purchased}
        />
      </div>
      {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AudienceReport />
        <MemberOnboard />
        <VisitorsByGender />
      </div> */}
    </div>
  );
};

export default AdminDashboard;
