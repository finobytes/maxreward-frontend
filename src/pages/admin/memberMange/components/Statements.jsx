import { useState } from "react";
import { CreditCard, Hand, Users, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Pagination from "./../../../../components/table/Pagination";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import SearchInput from "../../../../components/form/form-elements/SearchInput";

// ✅ Updated mock data
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

const Statements = ({ member }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [search, setSearch] = useState("");

  console.log("Member in Statements:", member?.wallet);
  const wallet = member?.wallet;
  const totalPages = 5;

  // ✅ Filter search
  const filteredData = mockData.filter(
    (item) =>
      item.point_types.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* ✅ Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Available Points</p>
              <p className="text-xl font-semibold text-gray-900">
                {wallet?.available_points || 0}
              </p>
              <p className="text-xs text-green-500 mt-1">+0.00 Increased</p>
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
                {wallet?.onhold_points || 0}
              </p>
              <p className="text-xs text-orange-500 mt-1">+0.00 Increased</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Hand className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Referral Points</p>
              <p className="text-xl font-semibold text-gray-900">
                {wallet?.total_rp || 0}
              </p>
              <p className="text-xs text-green-500 mt-1">+0.00 Increased</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Community Members</p>
              <p className="text-xl font-semibold text-gray-900">
                {member?.community_members || 0}
              </p>
              <p className="text-xs text-green-500 mt-1">+0.00 Increased</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ User Statement Table */}
      <div className="mt-6 p-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="font-semibold text-gray-900">User Statement</h2>
          <div className="flex gap-2 mt-2 lg:mt-0">
            <PrimaryButton>Export as CSV</PrimaryButton>
            <PrimaryButton variant="secondary">Export as PDF</PrimaryButton>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 lg:flex lg:items-center lg:justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative mt-4 lg:mt-0">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by date, type or status..."
            />
          </div>
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Point Type
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Total Points
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-xs text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-900">
                    {transaction.point_types}
                  </td>
                  <td
                    className={`py-3 px-4 text-xs font-medium ${
                      transaction.total_points.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.total_points}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={`text-xs ${
                        transaction.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : transaction.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-700"
                          : transaction.status === "Redeemed"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {transaction.status}
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
