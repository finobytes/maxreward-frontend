import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Hand, Users, UserCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Pagination from "../../../../components/table/Pagination";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import SearchInput from "../../../../components/form/form-elements/SearchInput";
import {
  useGetAvailableTransactionsQuery,
  useGetReferTransactionsQuery,
} from "../../../../redux/features/member/pointStatement/pointStatementMemberApi";

// Format Date + Time
const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const Statements = ({ merchantData }) => {
  const memberId = merchantData?.data?.merchant?.corporate_member?.id;

  const [activeTab, setActiveTab] = useState("available");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [search, setSearch] = useState("");
  const perPage = Number(entriesPerPage) || 10;

  const queryArgs = {
    memberId,
    page: currentPage,
    perPage,
  };

  const availableQuery = useGetAvailableTransactionsQuery(queryArgs, {
    skip: !memberId || activeTab !== "available",
  });
  const referQuery = useGetReferTransactionsQuery(queryArgs, {
    skip: !memberId || activeTab !== "refer",
  });
  const activeQuery = activeTab === "available" ? availableQuery : referQuery;

  const transactions = activeQuery?.data?.data?.data ?? [];
  const metaSource = activeQuery?.data?.data ?? {};
  const meta = {
    currentPage: metaSource.current_page ?? currentPage,
    lastPage: metaSource.last_page ?? 1,
    perPage: metaSource.per_page ?? perPage,
    total: metaSource.total ?? transactions.length,
  };
  const isLoading = activeQuery?.isLoading || activeQuery?.isFetching;

  const wallet = merchantData ? merchantData?.corporate_member?.wallet : {};

  // Filter by search
  const filteredTransactions = transactions.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white shadow-sm p-2 rounded-md">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Available Points</p>
              <p className="text-xl font-semibold">
                {wallet?.available_points}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm p-2 rounded-md">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">On Hold Points</p>
              <p className="text-xl font-semibold">{wallet?.onhold_points}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Hand className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm p-2 rounded-md">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Refer Points</p>
              <p className="text-xl font-semibold">{wallet?.total_rp}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm p-2 rounded-md">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Community Members</p>
              <p className="text-xl font-semibold">
                {merchantData?.community_members}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Statement Section */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="font-semibold text-gray-900">Merchant Statement</h2>

          <div className="flex gap-2 mt-2 lg:mt-0">
            <PrimaryButton>Export CSV</PrimaryButton>
            <PrimaryButton variant="secondary">Export PDF</PrimaryButton>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="refer">Refer</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div> */}

          <div className="w-full lg:w-auto">
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
                <th className="py-3 px-4">S/N</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Point Type</th>
                <th className="py-3 px-4">Total Points</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    Loading Transactions...
                  </td>
                </tr>
              ) : activeQuery?.error ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-red-500">
                    {activeQuery?.error?.data?.message || "Failed to load data"}
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item, idx) => {
                  const isDebit = item?.points_type === "debited";

                  return (
                    <tr
                      key={item?.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">
                        {(meta.currentPage - 1) * meta.perPage + idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        {formatDateTime(item?.created_at)}
                      </td>

                      <td className="py-3 px-4">
                        {typeMapping[item?.transaction_type] ?? "-"}
                      </td>

                      <td
                        className={`py-3 px-4 font-medium ${
                          isDebit ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isDebit
                          ? `-${item?.transaction_points}`
                          : `+${item?.transaction_points}`}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          className={
                            item?.points_type === "debited"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {item?.points_type}
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
          currentPage={meta.currentPage}
          totalPages={meta.lastPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Statements;
