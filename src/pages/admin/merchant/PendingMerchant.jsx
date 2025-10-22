import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Eye, Plus } from "lucide-react";
import StatusBadge from "../../../components/table/StatusBadge";
import Pagination from "../../../components/table/Pagination";
import BulkActionBar from "./components/BulkActionBar";

import {
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

const PendingMerchant = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [selected, setSelected] = useState([]);

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

  const handleApprove = async (id) => {
    try {
      await updateMerchant({ id, status: "active" }).unwrap();
      toast.success("Merchant approved successfully ");
      refetch();
    } catch (error) {
      console.error("Approve failed:", error);
      toast.error("Failed to approve merchant ");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateMerchant({ id, status: "rejected" }).unwrap();
      toast.success("Merchant rejected successfully");
      refetch();
    } catch (error) {
      console.error("Reject failed:", error);
      toast.error("Failed to reject merchant");
    }
  };

  // Search Debounce Effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, currentPage]);

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

  const bulkUpdateStatus = (newStatus) => {
    toast(`Bulk update to ${newStatus} (not implemented yet)`, { icon: "ℹ️" });
  };

  const bulkDelete = () => {
    toast("Bulk delete (not implemented yet)", { icon: "🗑️" });
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
            placeholder="Search by name, email, phone..."
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <PrimaryButton
              variant="primary"
              size="md"
              to="/admin/merchant/merchant-registration"
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
            onSetActive={() => bulkUpdateStatus("Active")}
            onSetBlocked={() => bulkUpdateStatus("Blocked")}
            onSetSuspended={() => bulkUpdateStatus("Suspended")}
            onDelete={bulkDelete}
          />
        )}

        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          <Table className="w-full min-w-[1000px] text-sm text-center text-gray-500">
            <TableHeader className="text-xs text-gray-700 uppercase bg-gray-50">
              <TableRow>
                <TableHead className="p-4">
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
                <TableHead className="py-3">Merchant ID</TableHead>
                <TableHead className="py-3">Business Name</TableHead>
                <TableHead className="py-3">Business Type</TableHead>
                <TableHead className="py-3">Owner Name</TableHead>
                <TableHead className="py-3">Phone</TableHead>
                <TableHead className="py-3">Email</TableHead>
                <TableHead className="py-3">Status</TableHead>
                <TableHead className="py-3">Created At</TableHead>
                <TableHead className="py-3">Action</TableHead>
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
                merchants.map((merchant) => (
                  <TableRow
                    key={merchant.id}
                    className="bg-white border-b hover:bg-gray-50 transition"
                  >
                    <TableCell className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(merchant.id)}
                        onChange={() => toggleSelect(merchant.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell className="py-4 font-medium text-gray-700">
                      {merchant.unique_number}
                    </TableCell>
                    <TableCell className="py-4">
                      {merchant.business_name}
                    </TableCell>
                    <TableCell className="py-4">
                      {merchant.business_type}
                    </TableCell>
                    <TableCell className="py-4">
                      {merchant.owner_name}
                    </TableCell>
                    <TableCell className="py-4">{merchant.phone}</TableCell>
                    <TableCell className="py-4">{merchant.email}</TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={merchant.status} />
                    </TableCell>
                    <TableCell className="py-4">
                      {new Date(merchant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleApprove(merchant.id)}
                        disabled={isUpdating}
                        className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500 disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(merchant.id)}
                        disabled={isUpdating}
                        className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
};

export default PendingMerchant;
