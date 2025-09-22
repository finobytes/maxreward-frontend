import React from "react";
import Chart from "react-apexcharts";
import { ArrowUpRight } from "lucide-react";
import { audienceReport } from "../../../../assets/assets";

const AudienceReport = () => {
  const chartOptions = {
    series: [
      {
        name: "Layer 1",
        data: [10, 20, 15, 25, 20, 30, 20, 25, 15, 30],
      },
      {
        name: "Layer 2",
        data: [20, 30, 25, 35, 30, 40, 30, 35, 25, 40],
      },
      {
        name: "Layer 3",
        data: [30, 40, 35, 45, 40, 50, 40, 45, 35, 50],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        stacked: true,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      colors: ["#ff5a29", "#FF7043", "#FFAB91"],
      dataLabels: { enabled: false },
      stroke: { curve: "straight", width: 0 },
      fill: { opacity: 1 },
      legend: { show: false },
      grid: { show: false },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { show: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="p-4 rounded-xl shadow-md bg-white w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Audience Report</h2>
        <div className="">
          <img src={audienceReport} alt="" />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-2">
        <div>
          <p className="text-3xl text-gray-900">
            12,890
            <span className=" inline-block text-green-500 text-sm ml-2">
              ↑ 10.5%
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2"></div>
        <div className="text-sm text-gray-400 mt-1">Currently active now</div>
      </div>

      {/* Chart */}
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="area"
        height={300}
      />
    </div>
  );
};

export default AudienceReport;
