import {
  ChevronDown,
  Eye,
  Pencil,
  PencilLine,
  Plus,
  Trash2Icon,
  X,
} from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { userImage } from "../../../../assets/assets";

const MemberList = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
      <div className="max-w-full overflow-x-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800">
            All Member List
          </h3>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <form className="relative flex-1 sm:flex-none">
              <button
                type="button"
                className="absolute -translate-y-1/2 left-4 top-1/2 text-gray-500"
              >
                <svg
                  className="fill-gray-500"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search Here ..."
                className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </form>

            {/* Add Member Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-x-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <Plus size={18} />
              Register New Member
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="sort"
                name="sort"
                defaultValue="Status"
                className="appearance-none rounded-md bg-brand-600 text-white py-2.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option>Status</option>
                <option>Available Points</option>
                <option>Referrals</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="p-4">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </th>
                <th className="   py-3">Full Name</th>
                <th className="   py-3">Member ID</th>
                <th className="   py-3">Phone</th>
                <th className="   py-3">Referrals</th>
                <th className="   py-3">Points</th>
                <th className="   py-3">Status</th>
                <th className="   py-3">Purchased (RM)</th>
                <th className="   py-3">Created</th>
                <th className="   py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </td>
                <td className="   py-4 flex items-center gap-3">
                  <img
                    src={userImage}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium text-gray-900">AyaanKhan92</p>
                    <p className="text-xs text-gray-500">4 Star Member</p>
                  </div>
                </td>
                <td className="   py-4">MAX-4325865</td>
                <td className="   py-4">+60 12-345 6789</td>
                <td className="   py-4 text-center">49</td>
                <td className="   py-4">65742</td>
                <td className="   py-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
                <td className="   py-4">4938</td>
                <td className="   py-4">Oct 12 2024</td>
                <td className="   py-4 flex gap-2">
                  <button className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500">
                    <PencilLine size={16} />
                  </button>
                  <button className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500">
                    <Trash2Icon size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing <span className="font-semibold text-gray-900 ">1-10</span>
              of <span className="font-semibold text-gray-900 ">1000</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <Link
                  to="#"
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  Previous
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 e"
                >
                  1
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  aria-current="page"
                  className="flex items-center justify-center px-3 h-8 text-white border border-gray-300 bg-brand-50 hover:bg-orange-200 hover:text-brand-700 "
                >
                  2
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
