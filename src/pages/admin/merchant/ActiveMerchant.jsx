import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import SearchInput from "@/components/form/form-elements/SearchInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Eye, PencilLine, Trash2Icon } from "lucide-react";
import DropdownSelect from "@/components/ui/dropdown/DropdownSelect";
import StatusBadge from "@/components/table/StatusBadge";
import Pagination from "@/components/table/Pagination";
import BulkActionBar from "./components/BulkActionBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMerchantManagement } from "../../../redux/features/admin/merchantManagement/useMerchantManagement";
import { Link } from "react-router";
import {
  useDeleteMerchantMutation,
  useUpdateMerchantMutation,
} from "../../../redux/features/admin/merchantManagement/merchantManagementApi";

const ActiveMerchant = () => {
  const {
    merchants,
    pagination,
    isFetching,
    isLoading,
    isError,
    refetch,
    filters,
    actions: {
      setPage,
      setPerPage,
      setStatus,
      setBusinessType,
      setDebouncedSearch,
      clearFilters,
    },
  } = useMerchantManagement();

  const [deleteMerchant] = useDeleteMerchantMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this merchant?")) {
      await deleteMerchant(id);
      refetch(); // refresh list
    }
  };

  console.log("Fetched merchants data:", merchants);

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.lastPage || 1;

  const [selected, setSelected] = useState([]);

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

  // Bulk actions (placeholder)
  const bulkUpdateStatus = (newStatus) => {
    console.log("Bulk update status to:", newStatus);
  };
  const bulkDelete = () => {
    console.log("Bulk delete selected merchants:", selected);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Active Merchant" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="max-w-full overflow-x-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              All Active Merchants
            </h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              {/* Debounced Search */}
              <SearchInput
                value={filters.search}
                onChange={(e) => setDebouncedSearch(e.target.value)}
                placeholder="Search merchant..."
              />

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
                <DropdownSelect
                  value={filters.businessType}
                  onChange={(val) => setBusinessType(val)}
                  options={[
                    { label: "All Types", value: "" },
                    { label: "Super Shop", value: "Super Shop" },
                    { label: "Retail", value: "Retail" },
                    { label: "Service", value: "Service" },
                  ]}
                />

                <PrimaryButton
                  variant="secondary"
                  size="md"
                  onClick={clearFilters}
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
              onSetActive={() => bulkUpdateStatus("Active")}
              onSetBlocked={() => bulkUpdateStatus("Blocked")}
              onSetSuspended={() => bulkUpdateStatus("Suspended")}
              onDelete={bulkDelete}
            />
          )}

          {/* Table */}
          <div className="mt-4 relative overflow-x-auto">
            <table className="w-full text-sm text-center text-gray-600">
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
                {isFetching ? (
                  // Skeleton Loader (shadcn style)
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
                      No merchants found
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
                      <td className="py-4 flex gap-2">
                        <Link
                          to={`/admin/merchant/details/${merchant.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/merchant/update/${merchant.id}`}
                          className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500"
                        >
                          <PencilLine size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(merchant.id)}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500"
                        >
                          <Trash2Icon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveMerchant;
