import React, { useState } from "react";
import { Dropdown } from "../../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../../components/ui/dropdown/DropdownItem";
import {
  kebabMenu,
  totalIncome,
  totalProducts,
  totalRevenue,
  totalSales,
  visits,
} from "../../../../assets/assets";

const TransactionActivity = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 ">
          Transaction Activity
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
          </Dropdown>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar border-t border-gray-200">
        <div className=" max-h-[390px]">
          <div className="mt-4 space-y-2">
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <img src={visits} alt="Visits" className="" />
                </div>
                <div>
                  <p className="text-ms text-gray-800">
                    Total Voucher Purchase
                  </p>
                  <p className="text-xs text-gray-600">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">$3,100</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <img src={totalProducts} alt="Total Products" className="" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">Total Points Spent</p>
                  <p className="text-xs text-gray-600">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">5,980</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <img src={totalSales} alt="Total Sales" className="" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">Total Points Earned</p>
                  <p className="text-xs text-gray-600">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">1,850</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <img src={totalRevenue} alt="Total Revenue" className="" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">Total In Hold</p>
                  <p className="text-xs text-gray-600">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">2,670</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <img src={totalIncome} alt="Total Income" className="" />
                </div>
                <div className="">
                  <p className="text-sm text-gray-800">Available Points</p>
                  <p className="text-xs text-gray-600">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">3,760</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionActivity;
