import React from "react";
import Chart from "react-apexcharts";

const PointsRedeemed = () => {
  const shopping = 18235;
  const referMember = 12743;
  const total = shopping + referMember;

  const series = [shopping, referMember]; // Shopping, Refer Member

  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Shopping", "Refer Member"],
    colors: ["#FF5A29", "#1E90FF"], // Orange = Shopping, Blue = Refer Member
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Visitors",
              fontSize: "14px",
              color: "#6B7280",
              formatter: () => total.toLocaleString(),
            },
            value: {
              show: false,
            },
            name: {
              show: false,
            },
          },
        },
      },
    },
    legend: { show: false }, // We'll build a custom legend
    dataLabels: { enabled: false },
    stroke: {
      width: 0,
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white relative shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 px-5 pt-5 sm:px-6 sm:pt-6">
        Points Redeemed
      </h3>

      {/* Chart */}
      <div className="flex justify-center">
        <Chart options={options} series={series} type="donut" height={280} />
      </div>
      <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h3 className="text-center text-lg">Total Visitors</h3>
        <p className="text-center text-gray-600 text-2xl">
          {total.toLocaleString()}
        </p>
      </div>
      {/* Custom Legend */}
      <div className="border rounded-xl divide-y">
        {/* Male */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-gray-700">Shopping</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-green-500">
              {((shopping / total) * 100).toFixed(2)}%
            </span>
            <span className="text-gray-800 font-semibold">
              {shopping.toLocaleString()}
            </span>
          </div>
        </div>
        {/* Refer Member */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-gray-700">Refer Member</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-red-500">
              {((referMember / total) * 100).toFixed(2)}%
            </span>
            <span className="text-gray-800 font-semibold">
              {referMember.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsRedeemed;
