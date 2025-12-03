import React from "react";
import { useParams, Link } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useGetCPDistributionPoolDetailsQuery } from "../../../redux/features/admin/cpTransaction/cpTransactionAdminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

// Status Badge
const renderStatusBadge = (status) => {
  const statusColors = {
    available: "bg-green-100 text-green-600",
    locked: "bg-yellow-100 text-yellow-600",
    released: "bg-blue-100 text-blue-600",
    expired: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
    </span>
  );
};

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

const CpTransactionDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCPDistributionPoolDetailsQuery(id);

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/admin" },
            { label: "CP Distribution Report", to: "/admin/cp-transaction" },
            { label: "Details" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/admin" },
            { label: "CP Distribution Report", to: "/admin/cp-transaction" },
            { label: "Details" },
          ]}
        />
        <div className="text-center text-red-500 py-10 bg-white rounded-xl border border-red-200">
          <p className="text-lg font-semibold">
            {isError
              ? "Failed to load transaction details."
              : "No transaction data found."}
          </p>
          <Link
            to="/admin/cp-transaction"
            className="mt-4 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft size={18} />
            Back to CP Transactions
          </Link>
        </div>
      </div>
    );
  }

  const poolInfo = data?.data?.getSingleCpDistributionPool;
  const poolData = data?.data?.getSingleCpDistributionPoolData || [];

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/admin" },
          { label: "CP Distribution Report", to: "/admin/cp-transaction" },
          { label: "Details" },
        ]}
      />

      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/admin/cp-transaction"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to CP Transactions</span>
        </Link>
      </div>

      {/* Distribution Pool Card */}
      {poolInfo && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">
              Distribution Pool
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Date & Time */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">
                {formatDateTime(poolInfo.created_at)}
              </p>
            </div>

            {/* Transaction ID */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
              <p className="font-medium text-gray-900">
                {poolInfo.transaction_id || "-"}
              </p>
            </div>

            {/* Total Transaction Amount */}
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Total Transaction Amount
              </p>
              <p className="font-medium text-blue-600">
                {poolInfo.total_transaction_amount || 0}
              </p>
            </div>

            {/* Total CP Amount */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Total CP Amount</p>
              <p className="font-medium text-green-600">
                {poolInfo.total_cp_amount || 0}
              </p>
            </div>

            {/* CP Source */}
            <div>
              <p className="text-xs text-gray-500 mb-1">CP Source</p>
              <p className="font-medium text-gray-900">
                {poolInfo.member?.name || "-"}
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="font-medium text-gray-900">
                {poolInfo.phone || poolInfo.member?.phone || "-"}
              </p>
            </div>

            {/* No Of Referral */}
            <div>
              <p className="text-xs text-gray-500 mb-1">No Of Referral</p>
              <p className="font-medium text-gray-900">
                {poolInfo.total_referrals || 0}
              </p>
            </div>

            {/* Unlocked Level */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Unlocked Level</p>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                {poolInfo.unlocked_level || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Receiver Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">CP%</TableHead>
                <TableHead className="text-center">CP Amount</TableHead>
                <TableHead className="text-center">Wallet Credited</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {poolData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="py-6 text-center">
                    No distribution data found.
                  </TableCell>
                </TableRow>
              ) : (
                poolData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>

                    {/* Receiver Name */}
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        {item?.receiver_member?.name ?? "-"}
                      </span>
                    </TableCell>

                    {/* Phone Number */}
                    <TableCell>
                      <span className="text-gray-500">
                        {item?.receiver_member?.phone ?? "-"}
                      </span>
                    </TableCell>

                    {/* Level */}
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                        {item?.level ?? "-"}
                      </span>
                    </TableCell>

                    {/* CP% */}
                    <TableCell className="text-center font-medium">
                      {item?.cp_percentage ? `${item.cp_percentage}%` : "-"}
                    </TableCell>

                    {/* CP Amount */}
                    <TableCell className="text-center">
                      <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-600">
                        {item?.cp_amount ?? 0}
                      </span>
                    </TableCell>

                    {/* Wallet Credited (Status) */}
                    <TableCell className="text-center">
                      {renderStatusBadge(item?.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CpTransactionDetails;
