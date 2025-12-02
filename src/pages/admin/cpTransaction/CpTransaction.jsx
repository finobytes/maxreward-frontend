import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import Pagination from "../../../components/table/Pagination";
import { useCpTransactionAdmin } from "../../../redux/features/admin/cpTransaction/useCpTransactionAdmin";
import { Eye } from "lucide-react";
import { Link } from "react-router";

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
const transactionTypeMapping = {
  earned: "Earned",
  spent: "Spent",
  transferred: "Transferred",
  refunded: "Refunded",
};

// CP Amount Badge
const renderCpAmountBadge = (amount, transactionType) => {
  const isNegative =
    transactionType === "spent" || transactionType === "transferred";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        isNegative ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
      }`}
    >
      {isNegative ? `-${amount}` : `+${amount}`}
    </span>
  );
};

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
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CpTransaction = () => {
  const { transactions, meta, isLoading, isFetching, error, changePage } =
    useCpTransactionAdmin();

  const currentPage = meta?.currentPage || 1;
  const totalPages = meta?.lastPage || 1;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/admin" },
          { label: "CP Distribution Report" },
        ]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {isFetching && (
            <span className="text-sm text-gray-500">Refreshing...</span>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Source Member</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">CP %</TableHead>
                <TableHead className="text-center">CP Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="10" className="py-6 text-center">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan="10"
                    className="py-6 text-center text-red-500"
                  >
                    {error?.data?.message || "Failed to load transactions."}
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="10" className="py-6 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((item, idx) => {
                  return (
                    <TableRow key={item?.id}>
                      <TableCell>
                        {(currentPage - 1) * meta?.perPage + idx + 1}
                      </TableCell>

                      {/* Date/Time */}
                      <TableCell>{formatDateTime(item?.created_at)}</TableCell>

                      {/* Transaction Type */}
                      <TableCell>
                        {transactionTypeMapping[item?.transaction_type] ?? "-"}
                      </TableCell>

                      {/* Source Member */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {item?.source_member?.name ?? "-"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item?.source_member?.user_name ?? ""}
                          </span>
                        </div>
                      </TableCell>

                      {/* Level */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                          {item?.level ?? "-"}
                        </span>
                      </TableCell>

                      {/* CP Percentage */}
                      <TableCell className="text-center font-medium">
                        {item?.cp_percentage ? `${item.cp_percentage}%` : "-"}
                      </TableCell>

                      {/* CP Amount */}
                      <TableCell className="text-center">
                        {renderCpAmountBadge(
                          item?.cp_amount,
                          item?.transaction_type
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        {renderStatusBadge(item?.status)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Link
                          to={`/admin/cp-transaction/${item?.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500 inline-block transition-colors"
                          title="View transaction details"
                        >
                          <Eye size={18} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
};

export default CpTransaction;
