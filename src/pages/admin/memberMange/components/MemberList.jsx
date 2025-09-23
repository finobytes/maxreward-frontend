import {
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  Trash,
  Trash2Icon,
  View,
  X,
} from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { userImage } from "../../../../assets/assets";

const MemberList = () => {
  return (
    <div className=" bg-white shadow-md rounded-2xl p-4">
      <div className="flex justify-between">
        <h3>All Member List</h3>
        <div className="flex justify-between gap-4">
          <div className="">
            <form>
              <div className="relative">
                <button className="absolute -translate-y-1/2 left-4 top-1/2">
                  <svg
                    className="fill-gray-500 "
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
                      fill=""
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search Here ..."
                  className=" h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
                />

                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 ">
                  <X />
                </button>
              </div>
            </form>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <Plus aria-hidden="true" className="-ml-0.5 size-5" />
            Register New Member
          </button>
          <div className="grid grid-cols-1">
            <select
              id="sort"
              name="sort"
              defaultValue="Status"
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-brand-25 text-white py-1.5 pr-8 pl-3 text-base outline-1 -outline-offset-1 outline-brand-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 sm:text-sm/6 "
            >
              <option>Status</option>
              <option>Available Points</option>
              <option>Referrals</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-white sm:size-4 "
            />
          </div>
        </div>
      </div>
      <div className="mt-4 relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm 
                  focus:ring-blue-500
                   focus:ring-2 "
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Member ID
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Referrals
              </th>
              <th scope="col" className="px-6 py-3">
                Available Points
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Purchased (RM)
              </th>
              <th scope="col" className="px-6 py-3">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 ">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm 
                  focus:ring-blue-500 
                   focus:ring-2 "
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <td className="py-4 flex">
                <div>
                  <img src={userImage} alt="user" />
                </div>
                <div className="">
                  <p>AyaanKhan92</p>
                  <p className="text-xs">4 Star Member</p>
                </div>
              </td>
              <td className="px-6 py-4">MAX-4325865</td>
              <td className="px-6 py-4">+60 12-345 6789</td>
              <td className="px-6 py-4">49</td>
              <td className="px-6 py-4"> 65742</td>
              <td>Active</td>
              <td>4938</td>
              <td>Oct 12 2024</td>
              <td className="text-right flex gap-2">
                <Eye size={16} className=" text-indigo-500" />
                <Pencil size={16} className=" text-blue-500" />
                <Trash2Icon size={16} className=" text-red-500" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500  mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing <span className="font-semibold text-gray-900 ">1-10</span>{" "}
            of <span className="font-semibold text-gray-900 ">1000</span>
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <Link
                to="#"
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight 
              text-gray-500 bg-white border border-gray-300 rounded-s-lg 
              hover:bg-gray-100 hover:text-gray-700 "
              >
                Previous
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center justify-center px-3 h-8 leading-tight 
              text-gray-500 bg-white border border-gray-300 
              hover:bg-gray-100 hover:text-gray-700 e"
              >
                1
              </Link>
            </li>
            <li>
              <Link
                to="#"
                aria-current="page"
                className="flex items-center justify-center px-3 h-8 text-white
              border border-gray-300 bg-brand-50 hover:bg-orange-200 hover:text-brand-700 
              "
              >
                2
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center justify-center px-3 h-8 leading-tight 
              text-gray-500 bg-white border border-gray-300 rounded-e-lg 
              hover:bg-gray-100 hover:text-gray-700 "
              >
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MemberList;
