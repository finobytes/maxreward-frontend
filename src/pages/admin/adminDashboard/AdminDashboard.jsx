import React from "react";
import {
  bag,
  clock,
  dollar,
  lineChart1,
  lineChart2,
  lineChart3,
  lineChart4,
  users,
} from "../../../assets/assets";
import DashboardCard from "./components/DashboardCard";
import RealTimeTransactions from "./components/RealTimeTransactions";
import MemberActivity from "./components/MemberActivity";

const AdminDashboard = () => {
  const cardsData = [
    {
      icon: users,
      title: "Total Users",
      value: "12,432",
      changeText: "+0.892 increased",
      changeColor: "text-green-500",
      chart: lineChart1,
    },
    {
      icon: bag,
      title: "Total Orders",
      value: "8,540",
      changeText: "+1.25 increased",
      changeColor: "text-green-500",
      chart: lineChart2,
    },
    {
      icon: dollar,
      title: "Revenue",
      value: "$25,430",
      changeText: "-0.54 decreased",
      changeColor: "text-red-500",
      chart: lineChart3,
    },
    {
      icon: clock,
      title: "Active Sessions",
      value: "1,230",
      changeText: "+2.14 increased",
      changeColor: "text-green-500",
      chart: lineChart4,
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
    </div>
  );
};

export default AdminDashboard;
