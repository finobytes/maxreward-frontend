import React from "react";
import { Link } from "react-router";
import { plusButton, user1 } from "../../../../assets/assets"; // user1 = dummy image

const ActiveReferrals = ({ member }) => {
  const referdMembers = member?.active_referrals?.data || [];

  // Slice max 5 items
  const topFive = referdMembers.slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Active Referrals
        </h3>
        <Link
          to={`/admin/member-manage/referrals/${member.id}`}
          className="text-sm text-gray-400"
        >
          View All
        </Link>
      </div>

      <div className="mt-2 flow-root w-full border-t border-gray-300"></div>

      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative min-w-full divide-y divide-gray-200">
              <ul className="divide-y divide-gray-200">
                {topFive.length > 0 ? (
                  topFive.map((ref) => (
                    <li
                      className="flex justify-between items-center"
                      key={ref.id}
                    >
                      <div className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0 flex items-center gap-2">
                        <img
                          src={
                            ref.image
                              ? ref.image
                              : "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                          }
                          alt={ref.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{ref.name}</span>
                      </div>

                      <p className="pr-3 md:pr-0 py-4 text-sm whitespace-nowrap text-gray-900">
                        <img src={plusButton} alt="add" />
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4 text-center">
                    No active referrals found
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveReferrals;
