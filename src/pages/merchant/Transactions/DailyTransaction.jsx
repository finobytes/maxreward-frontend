import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import PrimaryButton from "../../../components/ui/PrimaryButton";

import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { useGetDailyPurchaseQuery } from "../../../redux/features/merchant/transactions/transactionsApi";

const currency = (value) =>
  `RM ${Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const DailyTransaction = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const { data: userData } = useVerifyMeQuery("merchant");
  const id = userData?.id;

  const {
    data: transactionsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDailyPurchaseQuery(
    { merchantId: id, page, perPage, search },
    { skip: !id }
  );

  const transactions = transactionsData?.rows ?? [];
  const meta = transactionsData?.meta ?? {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Transactions" },
          { label: "Daily Transactions" },
        ]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by transaction ID..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              Rows per page
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </label>

            <PrimaryButton
              variant="secondary"
              onClick={refetch}
              disabled={isFetching}
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </PrimaryButton>

            <PrimaryButton
              variant="secondary"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              disabled={isFetching}
            >
              Clear Filters
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Total Transaction</TableHead>
                <TableHead>Points Redeemed</TableHead>
                <TableHead>Cash Paid Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((__, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-red-500"
                  >
                    {error?.data?.message ||
                      "Failed to load daily transactions."}
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-gray-500"
                  >
                    No daily transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.transaction_id}</TableCell>
                    <TableCell>{txn.member?.name || "N/A"}</TableCell>
                    <TableCell>{currency(txn.transaction_amount)}</TableCell>
                    <TableCell>{txn.redeem_amount}</TableCell>
                    <TableCell>{currency(txn.cash_redeem_amount)}</TableCell>
                    <TableCell className="capitalize">
                      {txn.payment_method}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={txn.status}>
                        {txn.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {new Date(txn.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing page {meta.currentPage} of {meta.lastPage} — Total{" "}
            {meta.total} records
          </p>
          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.lastPage}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyTransaction;
