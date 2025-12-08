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
    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-sm flex justify-between gap-2">
      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              backgroundColor: `${chartColor}20`, // light tint background
              color: chartColor, // icon color matches chartColor
            }}
          >
            <div className="text-[14px] sm:text-[16px] md:text-[18px]">
              {icon}
            </div>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 md:mt-3">
          {value}
        </h2>
        <p className="text-xs sm:text-sm">
          <span className={`${changeColor} font-medium`}>{changeText}</span>
        </p>
        <p className="text-[10px] sm:text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* Right Chart */}
      <div className="relative flex-shrink-0">
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 text-right">
          {title}
        </p>
        <div className="absolute bottom-0 right-0 w-16 h-12 sm:w-18 sm:h-13 md:w-20 md:h-14">
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
