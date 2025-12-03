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
                <TableHead>Transaction ID</TableHead>
                <TableHead>CP Source</TableHead>
                <TableHead className="text-center">Total CP Amount</TableHead>
                <TableHead className="text-center">Distribution Pool</TableHead>
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

                      {/* Transaction ID */}
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {item?.transaction_id ?? "-"}
                        </span>
                      </TableCell>

                      {/* CP Source (Member Info) */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {item?.member?.name ?? "-"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item?.member?.phone ?? ""}
                          </span>
                        </div>
                      </TableCell>

                      {/* Total CP Amount */}
                      <TableCell className="text-center">
                        <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-600">
                          {item?.total_cp_amount ?? 0}
                        </span>
                      </TableCell>

                      {/* Distribution Pool (Total Transaction Amount) */}
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
