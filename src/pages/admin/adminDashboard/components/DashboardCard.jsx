import React from "react";

const DashboardCard = ({
  icon,
  title,
  value,
  changeText,
  changeColor,
  chart,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
      <div>
        <img className="w-10 h-10" src={icon} alt={title} />
        <h2 className="text-2xl font-semibold py-3">{value}</h2>
        <p className="text-xs">
          <span className={changeColor}>{changeText}</span>
        </p>
      </div>
      <div className="relative">
        <p className="text-sm text-gray-500">{title}</p>
        <img
          className="absolute bottom-0 left-0 w-full"
          src={chart}
          alt="chart"
        />
      </div>
    </div>
  );
};

export default DashboardCard;
