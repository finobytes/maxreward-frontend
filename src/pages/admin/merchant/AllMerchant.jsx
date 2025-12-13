import React, { useState } from "react";
import QRCode from "react-qr-code";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import SearchInput from "@/components/form/form-elements/SearchInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Eye, Loader, PencilLine, Plus } from "lucide-react";
import DropdownSelect from "@/components/ui/dropdown/DropdownSelect";
import Pagination from "@/components/table/Pagination";
import { useMerchantManagement } from "../../../redux/features/admin/merchantManagement/useMerchantManagement";
import { Link } from "react-router";
import {
  useSuspendMerchantMutation,
  useUpdateMerchantMutation,
} from "../../../redux/features/admin/merchantManagement/merchantManagementApi";
import { useGetAllBusinessTypesQuery } from "../../../redux/features/admin/businessType/businessTypeApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { memberQR } from "../../../assets/assets";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";
import BulkActionBar from "../../../components/table/BulkActionBar";
import StatusBadge from "../../../components/table/StatusBadge";
import { toast } from "sonner";

const initialSuspendState = {
  open: false,
  merchant: null,
  reason: "",
  error: "",
};

const QR_MODAL_INITIAL = { open: false, data: null };

const AllMerchant = () => {
  const {
    data: businessTypes,
    isLoading: isBusinessTypeLoading,
    isError: isBusinessTypeError,
  } = useGetAllBusinessTypesQuery();

  const {
    merchants,
    pagination,
    isFetching,
    isLoading,
    isError,
    refetch,
    filters,
    debouncedSearch,
    actions: {
      setPage,
      setStatus,
      setBusinessType,
      setDebouncedSearch,
      clearFilters,
    },
  } = useMerchantManagement();

  const [suspendMerchant, { isLoading: isSuspending }] =
    useSuspendMerchantMutation();
  const [updateMerchant, { isLoading: isUpdating }] =
    useUpdateMerchantMutation();
  const [selected, setSelected] = useState([]);
  const [suspendModal, setSuspendModal] = useState(initialSuspendState);
  const [qrModal, setQrModal] = useState(QR_MODAL_INITIAL);

  const handleClear = () => {
    clearFilters();
    setDebouncedSearch(""); // Local search input reset
    setSelected([]);
  };

  console.log("Fetched merchants data:", merchants);

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.lastPage || 1;

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(merchants.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openSuspendModal = (merchant) => {
    setSuspendModal({
      open: true,
      merchant,
      reason: "",
      error: "",
    });
  };

  const closeSuspendModal = () => {
    setSuspendModal({ ...initialSuspendState });
  };

  const handleSuspendSubmit = async () => {
    if (!suspendModal.reason.trim()) {
      setSuspendModal((prev) => ({
        ...prev,
        error: "Suspension reason is required.",
      }));
      return;
    }

    try {
      await suspendMerchant({
        merchantId: suspendModal.merchant.id,
        status: "suspended",
        suspendReason: suspendModal.reason.trim(),
      }).unwrap();
      toast.success("Merchant suspended successfully.");
      closeSuspendModal();
      refetch();
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Failed to suspend merchant.";
      setSuspendModal((prev) => ({
        ...prev,
        error: message,
      }));
    }
  };

  const handleUnsuspend = async (id) => {
    try {
      await updateMerchant({ id, body: { status: "approved" } }).unwrap();
      toast.success("Merchant unsuspended successfully.");
      refetch();
    } catch (error) {
      console.error("Unsuspend failed:", error);
      toast.error("Failed to unsuspend merchant.");
    }
  };

  // Bulk actions (placeholder)
  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "All Merchant" }]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            placeholder="Search by company, email, phone..."
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            {/* Debounced Search */}
            <div className="flex justify-between items-center gap-4 md:px-2">
              {/* Status Filter */}
              <DropdownSelect
                value={filters.status}
                onChange={(val) => setStatus(val)}
                options={[
                  { label: "All", value: "" },
                  { label: "Approved", value: "approved" },
                  { label: "Pending", value: "pending" },
                  { label: "Rejected", value: "rejected" },
                ]}
              />

              {/* Business Type Filter */}
              {isBusinessTypeLoading ? (
                <div className="animate-pulse w-32 h-10 bg-gray-100 rounded"></div>
              ) : isBusinessTypeError ? (
                <p className="text-red-500 text-sm">Failed to load types</p>
              ) : (
                <DropdownSelect
                  value={filters.businessType}
                  onChange={(val) => setBusinessType(val)}
                  options={[
                    { label: "All Types", value: "" },
                    ...(businessTypes?.data?.business_types?.map((type) => ({
                      label: type.name,
                      value: type.name,
                    })) || []),
                  ]}
                />
              )}
              <PrimaryButton
                variant="primary"
                size="md"
                to="/admin/merchant/merchant-registration?from=all"
              >
                <Plus size={18} />
                Add New Merchant
              </PrimaryButton>

              <PrimaryButton
                variant="secondary"
                size="md"
                onClick={handleClear}
              >
                Clear
              </PrimaryButton>
            </div>
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
                onClick: () => bulkUpdateStatus("approve"),
              },
              {
                label: "Pending",
                variant: "warning",
                onClick: () => bulkUpdateStatus("pending"),
              },
              {
                label: "Rejected",
                variant: "danger",
                onClick: () => bulkUpdateStatus("rejected"),
              },
            ]}
          />
        )}
        {/* Table */}
        <div className="mt-4 relative overflow-x-auto w-full">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <Loader className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}
          <Table>
            <TableHeader>
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
                <TableHead className="hidden md:table-cell">
                  Phone Number
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Email Address
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Reward Budget
                </TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="hidden md:table-cell">
                  Available Points
                </TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>QR</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton Loading */}
              {isLoading && !merchants?.length ? (
                <MerchantStaffSkeleton />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-red-500">
                    Failed to load Merchants.
                  </TableCell>
                </TableRow>
              ) : merchants?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500">
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                merchants.map((m) => {
                  const isSuspended =
                    (m?.status || "").toLowerCase() === "suspended";
                  const isCurrentMerchantSubmitting =
                    (isSuspending && suspendModal.merchant?.id === m.id) ||
                    (isUpdating && m.id);

                  return (
                    <TableRow
                      key={m.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.includes(m.id)}
                          onChange={() => toggleSelect(m.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {m?.staffs?.find((staff) => staff?.type === "merchant")
                          ?.user_name || "N/A"}
                      </TableCell>
                      {/* Name + Avatar */}
                      <TableCell className="whitespace-normal break-words">
                        {m?.business_name}
                        {/* <div className="flex items-center gap-3">
                        <img
                          src={userImage}
                          alt="user"
                          className="w-10 h-10 rounded-full border"
                        />
                        <div>
                          <div className="font-medium text-gray-900"></div>
                        </div>
                      </div> */}
                      </TableCell>

                      <TableCell>
                        {m?.authorized_person_name || <span>N/A</span>}
                      </TableCell>
                      <TableCell>{m?.phone ?? "N/A"}</TableCell>
                      <TableCell>{m?.email ?? "N/A"}</TableCell>
                      <TableCell>{m?.reward_budget ?? "N/A"}</TableCell>
                      <TableCell>
                        {new Date(m?.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{m?.wallet?.total_points ?? "N/A"}</TableCell>

                      <TableCell>
                        <StatusBadge status={m.status} />
                      </TableCell>
                      <TableCell>
                        <div
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setQrModal({ open: true, data: m })}
                        >
                          <img
                            src={memberQR}
                            alt="QR Code"
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/merchant/details/${m?.id}`}
                            className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/admin/merchant/update/${m?.id}`}
                            className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PencilLine size={16} />
                          </Link>
                          <button
                            onClick={() =>
                              isSuspended
                                ? handleUnsuspend(m.id)
                                : openSuspendModal(m)
                            }
                            disabled={isCurrentMerchantSubmitting}
                            className={`px-2 rounded-md ${
                              isSuspended
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-yellow-100 text-gray-700 hover:bg-yellow-200"
                            } disabled:opacity-50`}
                          >
                            {isCurrentMerchantSubmitting
                              ? "Submitting..."
                              : isSuspended
                              ? "Unsuspend"
                              : "Suspend"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setPage(page)}
        />
      </div>

      <Dialog
        open={suspendModal.open}
        onOpenChange={(open) => {
          if (!open) closeSuspendModal();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Suspend Merchant</DialogTitle>
            <DialogDescription>
              Provide a reason for suspending{" "}
              {suspendModal.merchant?.business_name || "this merchant"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="merchant-action-reason"
              className="text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <textarea
              id="merchant-action-reason"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              placeholder="Add a brief justification..."
              value={suspendModal.reason}
              onChange={(e) =>
                setSuspendModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                  error: "",
                }))
              }
            />
            {suspendModal.error && (
              <p className="text-sm text-red-500">{suspendModal.error}</p>
            )}
          </div>

          <DialogFooter className="gap-3">
            <button
              type="button"
              onClick={closeSuspendModal}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={isSuspending}
            >
              Cancel
            </button>
            <PrimaryButton
              variant="warning"
              size="md"
              onClick={handleSuspendSubmit}
              disabled={isSuspending}
            >
              {isSuspending ? "Submitting..." : "Suspend"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={qrModal.open}
        onOpenChange={(open) => {
          if (!open) setQrModal(QR_MODAL_INITIAL);
        }}
      >
        <DialogContent className="sm:max-w-sm flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              {qrModal.data?.business_name}'s QR Code
            </DialogTitle>
            <DialogDescription className="text-center">
              Scan to view details
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            {(() => {
              const userName = qrModal.data?.staffs?.find(
                (staff) => staff?.type === "merchant"
              )?.user_name;

              return userName ? (
                <QRCode
                  value={userName}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                  No user_name found
                </div>
              );
            })()}
          </div>
          <p className="text-sm font-medium text-gray-500 mt-2">
            {
              qrModal.data?.staffs?.find((staff) => staff?.type === "merchant")
                ?.user_name
            }
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllMerchant;
