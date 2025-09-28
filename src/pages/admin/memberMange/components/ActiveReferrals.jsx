import React from "react";
import { Link } from "react-router";
import {
  plusButton,
  user1,
  user2,
  user3,
  user4,
  user5,
} from "../../../../assets/assets";
const people = [
  {
    name: "Henry Philips",
    icon: user1,
  },
  {
    name: "Henry Morgan",
    icon: user2,
  },
  {
    name: "Aurora Reed",
    icon: user3,
  },
  {
    name: "Leo Philips",
    icon: user4,
  },
  {
    name: "Ava Taylor",
    icon: user5,
  },
];
const ActiveReferrals = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 ">
          Active Referrals
        </h3>
        <div>
          <Link to="" className="text-sm text-gray-400">
            View All
          </Link>
        </div>
      </div>

      <div className="mt-2 flow-root w-full border-t border-gray-300"></div>
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative min-w-full divide-y divide-gray-200">
              <ul className="divide-y divide-gray-200">
                {people.map((person) => (
                  <li
                    className="flex justify-between items-center"
                    key={person.email}
                  >
                    <div className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0 flex items-center gap-2">
                      <img src={person.icon} alt={person.name} />
                      <span>{person.name}</span>
                    </div>
                    <p className="pr-3 md:pr-0 py-4 text-sm whitespace-nowrap text-gray-900">
                      <img src={plusButton} alt={person.name} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveReferrals;
