import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Eye, Plus } from "lucide-react";
import Pagination from "../../../components/table/Pagination";

import {
  useBlockMerchantMutation,
  useGetMerchantsQuery,
  useUpdateMerchantMutation,
} from "../../../redux/features/admin/merchantManagement/merchantManagementApi";
import { useDispatch } from "react-redux";
import {
  setStatus,
  setPage,
  setPerPage,
} from "../../../redux/features/admin/merchantManagement/merchantManagementSlice";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";

const initialRejectState = {
  open: false,
  merchant: null,
  reason: "",
  error: "",
};

const PendingMerchant = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [selected, setSelected] = useState([]);
  const [rejectModal, setRejectModal] = useState(initialRejectState);

  // Mount global filters
  useEffect(() => {
    dispatch(setStatus("pending"));
    dispatch(setPage(1));
    dispatch(setPerPage(perPage));

    return () => {
      dispatch(setStatus(""));
      dispatch(setPage(1));
    };
  }, [dispatch]);

  // RTK Query Fetch
  const { data, isLoading, isFetching, isError, refetch } =
    useGetMerchantsQuery({
      page: currentPage,
      per_page: perPage,
      status: "pending",
      search,
    });

  const merchants = data?.merchants || [];
  const pagination = data?.pagination || {};

  // Update Mutation
  const [updateMerchant, { isLoading: isUpdating }] =
    useUpdateMerchantMutation();
  const [blockMerchant, { isLoading: isRejecting }] =
    useBlockMerchantMutation();

  const handleApprove = async (id) => {
    try {
      await updateMerchant({ id, body: { status: "approved" } }).unwrap();
      toast.success("Merchant approved successfully ");
      refetch();
    } catch (error) {
      console.error("Approve failed:", error);
      toast.error("Failed to approve merchant ");
    }
  };

  const openRejectModal = (merchant) => {
    setRejectModal({
      open: true,
      merchant,
      reason: "",
      error: "",
    });
  };

  const closeRejectModal = () => {
    setRejectModal({ ...initialRejectState });
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal.reason.trim()) {
      setRejectModal((prev) => ({
        ...prev,
        error: "Rejection reason is required.",
      }));
      return;
    }

    try {
      await blockMerchant({
        merchantId: rejectModal.merchant.id,
        status: "rejected",
        rejectReason: rejectModal.reason.trim(),
      }).unwrap();
      toast.success("Merchant rejected successfully.");
      closeRejectModal();
      refetch();
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Failed to reject merchant.";
      setRejectModal((prev) => ({
        ...prev,
        error: message,
      }));
    }
  };

  // Search Debounce Effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, currentPage, refetch]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(merchants.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Pending Merchant" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, email, phone..."
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <PrimaryButton
              variant="primary"
              size="md"
              to="/admin/merchant/merchant-registration?from=pending"
            >
              <Plus size={18} />
              Add New Merchant
            </PrimaryButton>

            <PrimaryButton
              variant="secondary"
              size="md"
              onClick={() => {
                setSearch("");
                refetch();
                setSelected([]);
              }}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              // {
              //   label: "Activate",
              //   variant: "success",
              //   onClick: () => bulkUpdateStatus("active"),
              // },
              {
                label: "Approve",
                variant: "success",
                onClick: () => bulkUpdateStatus("Approve"),
              },
              {
                label: "Reject",
                variant: "danger",
                onClick: () => bulkUpdateStatus("Reject"),
              },
              // { label: "Delete", variant: "danger", onClick: bulkDelete },
            ]}
          />
        )}

        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          <Table className="w-full table-auto border-collapse">
            <TableHeader className="text-xs text-gray-700 uppercase bg-gray-50">
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={
                      merchants.length > 0 &&
                      selected.length === merchants.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </TableHead>
                <TableHead>Merchant ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Authorized Person</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Reward Budget</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading || isFetching || isUpdating ? (
                <MerchantStaffSkeleton rows={8} cols={7} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-red-500">
                    Failed to load Merchants.
                  </TableCell>
                </TableRow>
              ) : merchants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-gray-500">
                    No pending merchants found
                  </TableCell>
                </TableRow>
              ) : (
                merchants.map((merchant) => {
                  const isRejected =
                    (merchant?.status || "").toLowerCase() === "rejected";
                  const isCurrentMerchantSubmitting =
                    isRejecting && rejectModal.merchant?.id === merchant?.id;

                  return (
                    <TableRow
                      key={merchant?.id}
                      className="bg-white border-b hover:bg-gray-50 transition"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.includes(merchant?.id)}
                          onChange={() => toggleSelect(merchant?.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {merchant?.staffs?.find(
                          (staff) => staff?.type === "merchant",
                        )?.user_name || "N/A"}
                      </TableCell>
                      <TableCell>{merchant?.business_name}</TableCell>
                      <TableCell>
                        {merchant?.authorized_person_name || (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{merchant?.phone}</TableCell>
                      <TableCell>{merchant?.email}</TableCell>
                      <TableCell>
                        {merchant?.reward_budget || (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(merchant.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4 flex gap-2">
                        <Link
                          to={`/admin/pending-merchant/details/${merchant?.id}`}
                          className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleApprove(merchant.id)}
                          disabled={isUpdating}
                          className="px-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => openRejectModal(merchant)}
                          disabled={isRejected || isCurrentMerchantSubmitting}
                          className="px-2 rounded-md bg-yellow-100 text-gray-700 hover:bg-yellow-200 disabled:opacity-50"
                        >
                          {isCurrentMerchantSubmitting
                            ? "Submitting..."
                            : isRejected
                              ? "Rejected"
                              : "Reject"}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage || 1}
            totalPages={pagination.lastPage || 1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <Dialog
        open={rejectModal.open}
        onOpenChange={(open) => {
          if (!open) closeRejectModal();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Merchant</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting{" "}
              {rejectModal.merchant?.business_name || "this merchant"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="merchant-reject-reason"
              className="text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <textarea
              id="merchant-reject-reason"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              placeholder="Add a brief justification..."
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                  error: "",
                }))
              }
            />
            {rejectModal.error && (
              <p className="text-sm text-red-500">{rejectModal.error}</p>
            )}
          </div>

          <DialogFooter className="gap-3">
            <button
              type="button"
              onClick={closeRejectModal}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={isRejecting}
            >
              Cancel
            </button>
            <PrimaryButton
              variant="danger"
              size="md"
              onClick={handleRejectSubmit}
              disabled={isRejecting}
            >
              {isRejecting ? "Submitting..." : "Reject"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingMerchant;
