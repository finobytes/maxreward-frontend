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
import { usePointStatementMember } from "../../../../redux/features/member/pointStatement/usePointStatementMember";

const Statements = ({ member }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [search, setSearch] = useState("");

  // Fetch API Data
  const { transactions, meta, isLoading, error, changePage } =
    usePointStatementMember(member?.id);

  const wallet = member?.wallet;

  // Search Filter (API DATA)
  const filteredData =
    transactions?.filter((item) => {
      const text = search.toLowerCase();
      return (
        item?.transaction_type?.toLowerCase().includes(text) ||
        item?.points_type?.toLowerCase().includes(text) ||
        item?.created_at?.toLowerCase().includes(text)
      );
    }) || [];
  // Transaction Type Full Form
  const typeMapping = {
    pp: "Personal Points",
    rp: "Referral Points",
    cp: "Community Points",
    cr: "Company Reserve",
    dp: "Deducted Points",
    ap: "Added Points",
    vrp: "Voucher Referral Points",
    vap: "Voucher Available Points",
  };

  return (
    <div>
      {/* 🟦 Stats Section */}
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

      {/* 🟧 User Statement */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  S/N
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
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-red-500">
                    {error?.data?.message || "Failed to load transactions."}
                  </td>
                </tr>
              ) : filteredData?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center">
                    No data found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const isNegative = item?.points_type === "debited";

                  return (
                    <tr
                      key={item?.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {/* S/N */}
                      <td className="py-3 px-4 text-xs text-gray-900">
                        {(currentPage - 1) * Number(entriesPerPage) +
                          (index + 1)}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-xs text-gray-900">
                        {new Date(item?.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Point Type */}
                      <td className="py-3 px-4 text-xs text-gray-900">
                        {typeMapping[item?.transaction_type] ||
                          item?.transaction_type?.toUpperCase() ||
                          "-"}
                      </td>

                      {/* Total Points */}
                      <td
                        className={`py-3 px-4 text-xs font-medium ${
                          isNegative ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isNegative
                          ? `-${item?.transaction_points}`
                          : `+${item?.transaction_points}`}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <Badge
                          className={`text-xs ${
                            item.points_type === "debited"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.points_type}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={meta?.current_page || 1}
          totalPages={meta?.last_page || 1}
          onPageChange={(page) => {
            setCurrentPage(page);
            changePage(page);
          }}
        />
      </div>
    </div>
  );
};

export default Statements;
