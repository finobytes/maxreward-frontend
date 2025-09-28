import React from "react";

const ActiveReferrals = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      {/* Referral List */}
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex justify-between items-center">
          <span className="font-medium">Referral Code :</span>
          <span className="text-gray-600">#REF-12345</span>
        </li>

        <li className="flex justify-between items-center">
          <span className="font-medium">Total Referrals :</span>
          <span className="text-gray-600">18</span>
        </li>

        <li className="flex justify-between items-center">
          <span className="font-medium">Active Referrals :</span>
          <span className="text-green-600 font-semibold">12</span>
        </li>

        <li className="flex justify-between items-center">
          <span className="font-medium">Inactive Referrals :</span>
          <span className="text-red-500 font-semibold">6</span>
        </li>

        <li className="flex justify-between items-center">
          <span className="font-medium">Referral Bonus :</span>
          <span className="text-indigo-600 font-semibold">$250</span>
        </li>
      </ul>
    </div>
  );
};

export default ActiveReferrals;
