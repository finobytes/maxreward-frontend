import React from "react";
import { Eye, Loader2 } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "../../../redux/features/merchant/transactions/useTransaction";
import { Link } from "react-router";

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const currency = (value) =>
  `RM ${Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "—";

const AllTransactions = () => {
  const {
    transactions,
    meta,
    isLoading,
    isFetching,
    error,
    searchValue,
    setSearchValue,
    status,
    setStatus,
    perPage,
    setPerPage,
    setPage,
    refresh,
  } = useTransactions("all");

  const handleSearchChange = (eventOrValue) => {
    const nextValue =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue?.target?.value ?? "";
    setSearchValue(nextValue);
  };

  const handlePerPageChange = (event) => {
    const value = Number(event.target.value) || 10;
    setPerPage(value);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Transactions" },
          { label: "All Transactions" },
        ]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by transaction ID, member or merchant"
          />

          <div className="flex flex-wrap items-center gap-3">
            <DropdownSelect
              value={status}
              onChange={(value) => setStatus(value)}
              options={statusOptions}
            />

            <label className="text-sm text-gray-600 flex items-center gap-2">
              Rows per page
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <PrimaryButton
              variant="secondary"
              onClick={refresh}
              disabled={isFetching}
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing
                </>
              ) : (
                "Refresh"
              )}
            </PrimaryButton>
          </div>
        </div>

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
                <TableHead className="">Phone Number</TableHead>
                <TableHead className="">Total Transaction</TableHead>
                <TableHead className="">Points Redeemed</TableHead>
                <TableHead>Balance Paid</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {Array.from({ length: 9 }).map((__, colIdx) => (
                      <TableCell key={colIdx}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-red-500"
                  >
                    {error?.data?.message || "Failed to load transactions."}
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-gray-500"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium text-gray-900">
                      {txn.transaction_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {txn.member?.name || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell> {txn.member?.phone || "—"}</TableCell>
                    <TableCell className="">
                      {currency(txn.transaction_amount)}
                    </TableCell>
                    <TableCell className="">
                      {currency(txn.redeem_amount)}
                    </TableCell>
                    <TableCell className="">
                      {currency(txn.cash_redeem_amount)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {txn.payment_method || "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={txn.status}>
                        {txn.status}
                      </StatusBadge>
                    </TableCell>
                    {/* <TableCell>{formatDateTime(txn.created_at)}</TableCell> */}
                    <TableCell className="text-right flex items-center gap-2">
                      <Link
                        to=""
                        className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200 inline-block"
                      >
                        <Eye size={16} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            Showing page {meta.currentPage} of {meta.lastPage} · Total{" "}
            {meta.total} records
          </p>
          <Pagination
            currentPage={meta.currentPage}
            totalPages={Math.max(meta.lastPage, 1)}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;
