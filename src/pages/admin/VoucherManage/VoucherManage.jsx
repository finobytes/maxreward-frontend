import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Eye, Loader } from "lucide-react";
import { Link } from "react-router";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import SearchInput from "@/components/form/form-elements/SearchInput";
import StatusBadge from "@/components/table/StatusBadge";
import Pagination from "@/components/table/Pagination";
import BulkActionBar from "@/components/table/BulkActionBar";
import MerchantStaffSkeleton from "@/components/skeleton/MerchantStaffSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  setMemberId,
  setPaymentMethod,
  setVoucherType,
  setStatus,
  resetFilters,
  setPage,
  setSearch,
} from "../../../redux/features/member/voucherPurchase/voucherSlice";

import { useVouchers } from "../../../redux/features/member/voucherPurchase/useVouchers";
import {
  useApproveVoucherMutation,
  useRejectVoucherMutation,
} from "../../../redux/features/member/voucherPurchase/voucherApi";
import Select from "../../../components/form/Select";

const VoucherManage = () => {
  const dispatch = useDispatch();
  const { member_id, payment_method, voucher_type, search, status } =
    useSelector((state) => state.voucherManagement);

  const { vouchers, meta, isLoading, isFetching, isError, refetch } =
    useVouchers();

  const [selected, setSelected] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const [approveVoucher] = useApproveVoucherMutation();
  const [rejectVoucher] = useRejectVoucherMutation();

  const handleStatusUpdate = async (id, action) => {
    setUpdatingId(id);
    try {
      const apiCall = action === "approved" ? approveVoucher : rejectVoucher;
      const res = await apiCall(id).unwrap();
      toast.success(res?.message || `Voucher updated successfully`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(vouchers?.map((v) => v.id));
    } else {
      setSelected([]);
    }
  };
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  // Bulk actions (placeholder)
  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Voucher Management" }]}
      />

      <div className="relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-10">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <SearchInput
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search vouchers..."
          />
          <div className="flex gap-4 flex-wrap">
            <Select
              value={payment_method}
              onChange={(e) => dispatch(setPaymentMethod(e.target.value))}
              placeholder="Payment Method"
              options={[
                { value: "", label: "All" },
                { value: "manual", label: "Manual" },
                { value: "online", label: "Online" },
              ]}
            />

            <Select
              value={voucher_type}
              onChange={(e) => dispatch(setVoucherType(e.target.value))}
              placeholder="Voucher Type"
              options={[
                { value: "", label: "All" },
                { value: "max", label: "Max" },
                { value: "refer", label: "Refer" },
              ]}
            />

            <Select
              value={status}
              onChange={(e) => dispatch(setStatus(e.target.value))}
              placeholder="Status"
              options={[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
                { value: "success", label: "Success" },
              ]}
            />

            <button
              onClick={() => {
                dispatch(resetFilters());
                setSelected([]);
              }}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
        {/* Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Approve",
                variant: "success",
                onClick: () => bulkUpdateStatus("approve"),
              },
              {
                label: "Reject",
                variant: "danger",
                onClick: () => bulkUpdateStatus("reject"),
              },
            ]}
          />
        )}
        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <MerchantStaffSkeleton rows={8} cols={9} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">Failed to load</div>
          ) : vouchers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No vouchers found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        vouchers?.length > 0 &&
                        selected.length === vouchers?.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>Voucher ID</TableHead>
                  <TableHead>Voucher Type</TableHead>
                  <TableHead>Purchased By</TableHead>
                  <TableHead>Denomination</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vouchers.map((v) => (
                  <TableRow key={v.id} className="hover:bg-gray-50 transition">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(v.id)}
                        onChange={() => toggleSelect(v.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>
                      <StatusBadge status={v.voucher_type}>
                        {v.voucher_type} voucher
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{v?.purchase_by || "N/A"}</TableCell>
                    <TableCell>{v?.denomination?.title}</TableCell>
                    <TableCell>{v.quantity}</TableCell>
                    <TableCell>RM {v.total_amount}</TableCell>
                    <TableCell>
                      {new Date(v.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{v.payment_method}</TableCell>
                    <TableCell>
                      <StatusBadge status={v.status}>{v.status}</StatusBadge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      {v.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(v.id, "approved")}
                            disabled={updatingId === v.id}
                            className="px-3 py-1 bg-green-100 text-green-600 rounded-md"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleStatusUpdate(v.id, "rejected")}
                            disabled={updatingId === v.id}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <Link
                        to={`/admin/vouchers/${v.id}`}
                        className="p-2 bg-indigo-100 rounded-md text-indigo-600"
                      >
                        <Eye size={16} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </div>
      </div>
    </div>
  );
};

export default VoucherManage;
