import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Hand, Users, UserCheck } from "lucide-react";

import Pagination from "../../../../components/table/Pagination";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import SearchInput from "../../../../components/form/form-elements/SearchInput";

const mockData = [
  {
    id: 1,
    date: "01-Sept-25",
    point_types: "Voucher",
    total_points: "+1000",
    status: "Available",
  },
  {
    id: 2,
    date: "02-Sept-25",
    point_types: "Referral",
    total_points: "+250",
    status: "On Hold",
  },
  {
    id: 3,
    date: "03-Sept-25",
    point_types: "Personal",
    total_points: "-950",
    status: "Redeemed",
  },
  {
    id: 4,
    date: "04-Sept-25",
    point_types: "Referral",
    total_points: "+250",
    status: "Available",
  },
  {
    id: 5,
    date: "05-Sept-25",
    point_types: "Voucher",
    total_points: "+1000",
    status: "Available",
  },
  {
    id: 6,
    date: "06-Sept-25",
    point_types: "Community",
    total_points: "-1000",
    status: "On Hold",
  },
  {
    id: 7,
    date: "07-Sept-25",
    point_types: "Referral",
    total_points: "+250",
    status: "Available",
  },
  {
    id: 8,
    date: "08-Sept-25",
    point_types: "Personal",
    total_points: "-1000",
    status: "Redeemed",
  },
  {
    id: 9,
    date: "09-Sept-25",
    point_types: "Community",
    total_points: "-500",
    status: "Redeemed",
  },
  {
    id: 10,
    date: "10-Sept-25",
    point_types: "Referral",
    total_points: "+250",
    status: "Referred",
  },
];

const Statements = ({ merchantData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [search, setSearch] = useState("");

  console.log("Merchant Data:", merchantData?.corporate_member?.wallet);
  const wallet = merchantData ? merchantData?.corporate_member?.wallet : {};
  const totalPages = 5;

  // Filter by search
  const filteredData = mockData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Available Points</p>
              <p className="text-xl font-semibold text-gray-900">
                {wallet?.available_points}
              </p>
              <p className="text-xs text-green-500 mt-1">+0.892 Increased</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">On Hold Points</p>
              <p className="text-xl font-semibold text-gray-900">
                {wallet?.onhold_points}
              </p>
              <p className="text-xs text-orange-500 mt-1">+0.321 Increased</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Hand className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Refer Points</p>
              <p className="text-xl font-semibold text-gray-900">
                {wallet?.total_rp}
              </p>
              <p className="text-xs text-green-500 mt-1">+1.245 Increased</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Community Member</p>
              <p className="text-xl font-semibold text-gray-900">
                {merchantData?.community_members}
              </p>
              <p className="text-xs text-blue-500 mt-1">+0.892 Increased</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Statement Section */}
      <div className="mt-6 p-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="font-semibold text-gray-900">Merchant Statement</h2>
          <div className="flex gap-2 mt-2 lg:mt-0">
            <PrimaryButton>Export as CSV</PrimaryButton>
            <PrimaryButton variant="secondary">Export as PDF</PrimaryButton>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 lg:flex lg:items-center lg:justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="relative mt-4 lg:mt-0">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-gray-700">
                  Point Types
                </th>
                <th className="text-left py-3 px-4 text-gray-700">
                  Total Points
                </th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-900">{item.id}</td>
                  <td className="py-3 px-4 text-gray-900">{item.date}</td>
                  <td className="py-3 px-4 text-gray-900">
                    {item.point_types}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      item.total_points.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.total_points}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        item.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : item.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Redeemed"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Statements;
