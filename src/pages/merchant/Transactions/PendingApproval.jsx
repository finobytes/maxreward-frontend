import React, { useState } from "react";
import { Link } from "react-router";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { useTransactions } from "../../../redux/features/merchant/transactions/useTransaction";
import { useRejectPurchaseMutation } from "../../../redux/features/merchant/transactions/transactionsApi";

const currency = (value) =>
  `RM ${Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PendingApproval = () => {
  const [updatingId, setUpdatingId] = useState(null);
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    purchase: null,
    reason: "",
    error: "",
  });

  const {
    transactions,
    meta,
    isLoading,
    isFetching,
    error,
    searchValue,
    setSearchValue,
    perPage,
    setPerPage,
    setPage,
    refresh,
    approvePurchase,
    approvingId,
    reset,
  } = useTransactions("pending");

  const [rejectPurchase, { isLoading: rejecting }] =
    useRejectPurchaseMutation();

  // Search
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

  // APPROVE
  const handleApprove = async (purchaseId) => {
    setUpdatingId(purchaseId);
    try {
      const response = await approvePurchase(purchaseId);

      // toast.success(response?.message || "Purchase approved successfully!");
      refresh();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || "Failed to approve purchase. Please try again."
      );
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  // REJECT
  const handleReject = async (purchaseId, reason) => {
    setUpdatingId(purchaseId);
    try {
      const response = await rejectPurchase({
        id: purchaseId,
        status: "rejected",
        reason,
      }).unwrap();

      toast.success(response?.message || "Purchase rejected successfully!");
      refresh();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to reject");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  // Reject Dialog Open/Close
  const openRejectDialog = (purchase) =>
    setRejectDialog({ open: true, purchase, reason: "", error: "" });

  const closeRejectDialog = () =>
    setRejectDialog({ open: false, purchase: null, reason: "", error: "" });

  // Reject Submit
  const submitRejectDialog = async () => {
    const reason = rejectDialog.reason.trim();
    if (!reason) {
      setRejectDialog((prev) => ({ ...prev, error: "Reason is required." }));
      return;
    }

    const purchaseId = rejectDialog.purchase?.id;
    const ok = await handleReject(purchaseId, reason);
    if (ok) closeRejectDialog();
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Transactions" },
          { label: "Pending Approval" },
        ]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by transaction ID or member"
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
              onClick={refresh}
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
                setSearchValue("");
                reset();
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
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((__, idx) => (
                      <TableCell key={idx}>
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
                    {error?.data?.message ||
                      "Failed to load pending transactions."}
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-gray-500"
                  >
                    No pending purchases found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => {
                  const rowUpdating = updatingId === txn.id;

                  return (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.transaction_id}</TableCell>
                      <TableCell>{txn.member?.name || "N/A"}</TableCell>
                      <TableCell>{txn.member?.phone}</TableCell>
                      <TableCell>{currency(txn.transaction_amount)}</TableCell>
                      <TableCell>{currency(txn.redeem_amount)}</TableCell>
                      <TableCell>{currency(txn.cash_redeem_amount)}</TableCell>
                      <TableCell>{txn.payment_method}</TableCell>
                      <TableCell>
                        <StatusBadge status={txn.status}>
                          {txn.status}
                        </StatusBadge>
                      </TableCell>

                      <TableCell className="flex items-center gap-2">
                        <Link className="p-2 rounded-md bg-indigo-100 text-indigo-600">
                          <Eye size={16} />
                        </Link>

                        <PrimaryButton
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(txn.id)}
                          disabled={rowUpdating}
                        >
                          {rowUpdating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />{" "}
                              Approving…
                            </>
                          ) : (
                            "Approve"
                          )}
                        </PrimaryButton>

                        <PrimaryButton
                          variant="danger"
                          size="sm"
                          onClick={() => openRejectDialog(txn)}
                          disabled={rowUpdating || rejecting}
                        >
                          Reject
                        </PrimaryButton>
                      </TableCell>
                    </TableRow>
                  );
                })
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

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(o) => !o && closeRejectDialog()}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Purchase</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting purchase #
              {rejectDialog.purchase?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <textarea
              rows={4}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Explain reason..."
              value={rejectDialog.reason}
              onChange={(e) =>
                setRejectDialog((prev) => ({
                  ...prev,
                  reason: e.target.value,
                  error: "",
                }))
              }
            />
            {rejectDialog.error && (
              <p className="text-sm text-red-500">{rejectDialog.error}</p>
            )}
          </div>

          <DialogFooter className="gap-3">
            <button
              className="px-4 py-2 text-sm rounded-md border text-gray-600"
              onClick={closeRejectDialog}
              disabled={rejecting}
            >
              Cancel
            </button>
            <PrimaryButton
              variant="danger"
              size="md"
              onClick={submitRejectDialog}
              disabled={rejecting}
            >
              {rejecting ? "Submitting..." : "Submit"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingApproval;
