import React, { useEffect, useState } from "react";
import { Link } from "react-router";
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
import { Skeleton } from "@/components/ui/skeleton";

const PendingMerchant = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [selected, setSelected] = useState([]);

  // Mount এ global filters ঠিক করে দাও
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

  // Render States
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load merchants. Please try again.
      </p>
    );

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Management", to: "/admin/merchant" },
          { label: "Pending Merchant" },
        ]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Pending Merchant List
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
            />

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
          <table className="w-full min-w-[1000px] text-sm text-center text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={
                      merchants.length > 0 &&
                      selected.length === merchants.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </th>
                <th className="py-3">Merchant ID</th>
                <th className="py-3">Business Name</th>
                <th className="py-3">Business Type</th>
                <th className="py-3">Owner Name</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Email</th>
                <th className="py-3">Status</th>
                <th className="py-3">Created At</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading || isFetching || isUpdating ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="py-3">
                        <Skeleton className="h-4 w-full mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : merchants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-gray-500">
                    No pending merchants found
                  </td>
                </tr>
              ) : (
                merchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className="bg-white border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(merchant.id)}
                        onChange={() => toggleSelect(merchant.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="py-4 font-medium text-gray-700">
                      {merchant.unique_number}
                    </td>
                    <td className="py-4">{merchant.business_name}</td>
                    <td className="py-4">{merchant.business_type}</td>
                    <td className="py-4">{merchant.owner_name}</td>
                    <td className="py-4">{merchant.phone}</td>
                    <td className="py-4">{merchant.email}</td>
                    <td className="py-4">
                      <StatusBadge status={merchant.status} />
                    </td>
                    <td className="py-4">
                      {new Date(merchant.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 flex gap-2 justify-center">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
