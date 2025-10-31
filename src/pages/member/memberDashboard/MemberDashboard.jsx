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

const MemberDashboard = () => {
  const cardsData = [
    {
      icon: dollar,
      title: "Available Points",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#8B5CF6", //  green
      chartData: [10, 14, 12, 18, 16, 20, 17],
    },
    {
      icon: hand,
      title: "On Hold Points",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#10B981", // orange
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
    {
      icon: users,
      title: "Referral Points",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#8B5CF6", // purple
      chartData: [5, 7, 9, 12, 11, 9, 10],
    },
    {
      icon: userCommunity,
      title: "Community Members",
      value: "45",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#3B82F6", // blue
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: purchase,
      title: "LifeTime purchase",
      value: "45",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#EC4899", // pink
      chartData: [6, 8, 7, 9, 8, 10, 9],
    },
    {
      icon: star,
      title: "Star Level",
      value: "12,432",
      changeText: "+0.892",
      changeColor: "text-green-500",
      subtitle: "Increased",
      chartColor: "#10B981", // orange
      chartData: [8, 10, 9, 13, 11, 15, 14],
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-600 pb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img src={card} />
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
