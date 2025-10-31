import React from "react";
import Chart from "react-apexcharts";

const DashboardCard = ({
  icon,
  title,
  value,
  changeText,
  changeColor,
  subtitle,
  chartColor,
  chartData,
}) => {
  const chartOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: [chartColor],
    tooltip: { enabled: false },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between">
      {/* Left Content */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <img src={icon} alt={title} className="w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-3">{value}</h2>
        <p className="text-sm">
          <span className={`${changeColor} font-medium`}>{changeText}</span>
        </p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* Right Chart */}
      <div className="relative">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="absolute bottom-0 right-0 w-20 h-14">
          <Chart
            options={chartOptions}
            series={[{ data: chartData }]}
            type="line"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
