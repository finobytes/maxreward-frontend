import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Dropdown } from "../../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../../components/ui/dropdown/DropdownItem";
import { kebabMenu } from "../../../../assets/assets";

const PointsRedeemed = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const shopping = 18235;
  const referMember = 12743;
  const total = shopping + referMember;

  const series = [shopping, referMember]; // Shopping, New Registration

  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Shopping", "New Registration"],
    colors: ["#FF5A29", "#1E90FF"], // Orange = Shopping, Blue = New Registration
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
              label: "Total Redeemed",
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 px-5 pt-5 sm:px-6 sm:pt-6">
          Points Redeemed
        </h3>
        <div className="relative inline-block px-4">
          <button
            className="dropdown-toggle cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src={kebabMenu} alt="View Options" className="" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Last week
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Last month
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Last year
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              All time
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      {/* Chart */}
      <div className="flex justify-center">
        <Chart options={options} series={series} type="donut" height={280} />
      </div>
      <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h3 className="text-center text-lg">Total Redeemed</h3>
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
        {/* New Registration */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-gray-700">New Registration</span>
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
