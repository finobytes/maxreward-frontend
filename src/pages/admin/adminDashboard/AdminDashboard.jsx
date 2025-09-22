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

const AdminDashboard = () => {
  const cardsData = [
    {
      icon: users,
      title: "Total Users",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#8B5CF6", // purple
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: bag,
      title: "Total Merchants",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#F97316", // orange
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: dollar,
      title: "Total Transactions",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#10B981", // green
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: clock,
      title: "Merchant Approvals",
      value: "45",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#3B82F6", // blue
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
  ];

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
