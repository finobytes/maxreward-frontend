import React, { useState } from "react";
import { Dropdown } from "../../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../../components/ui/dropdown/DropdownItem";
import {
  kebabMenu,
  totalIncome,
  totalProducts,
  totalProfit,
  totalRevenue,
  totalSales,
  visits,
} from "../../../../assets/assets";

const MemberActivity = ({ stats = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const formatValue = (value) =>
    Number.isFinite(Number(value)) ? Number(value).toLocaleString() : "0";

  const activityItems = [
    {
      icon: visits,
      label: "Total Active Members",
      value: stats.total_active_members,
    },
    {
      icon: totalIncome,
      label: "Total Points Earned",
      value: stats.total_points_earned,
    },
    {
      icon: totalSales,
      label: "Total Transactions",
      value: stats.total_transactions,
    },
    {
      icon: totalRevenue,
      label: "New Members (Last 7 Days)",
      value: stats.new_members_last_7_days,
    },
    {
      icon: totalProfit,
      label: "Total Members",
      value: stats.total_members,
    },
    {
      icon: totalProducts,
      label: "Approved Merchants",
      value: stats.total_merchants,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-4 sm:pt-6 2xl:px-6 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 ">
          Member Activity
        </h3>
        <div className="relative inline-block">
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
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className=" max-h-[390px]">
          <div className="mt-4 space-y-2">
            {activityItems.map((item) => (
              <div key={item.label} className=" flex justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <img src={item.icon} alt={item.label} className="" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">
                      Trend data unavailable
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {formatValue(item.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberActivity;
