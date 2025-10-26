import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import SearchInput from "@/components/form/form-elements/SearchInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Eye, Loader, PencilLine, Trash2Icon } from "lucide-react";
import DropdownSelect from "@/components/ui/dropdown/DropdownSelect";
import Pagination from "@/components/table/Pagination";
import { useMerchantManagement } from "../../../redux/features/admin/merchantManagement/useMerchantManagement";
import { Link } from "react-router";
import { useDeleteMerchantMutation } from "../../../redux/features/admin/merchantManagement/merchantManagementApi";
import { useGetAllBusinessTypesQuery } from "../../../redux/features/admin/businessType/businessTypeApi";

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
      refetch();
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
                variant="secondary"
                size="md"
                onClick={() => {
                  clearFilters();
                  setSelected("");
                }}
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
                label: "Suspend",
                variant: "warning",
                onClick: () => bulkUpdateStatus("suspended"),
              },
              { label: "Delete", variant: "danger", onClick: bulkDelete },
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
                merchants.map((m) => (
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
                    <TableCell>{m?.id}</TableCell>
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
                      {m?.authorized_person || <span>N/A</span>}
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
                      <img
                        src={memberQR}
                        alt="QR Code"
                        className="w-12 h-12 object-contain"
                      />
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
                        {/* <button className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                          <Trash2Icon size={16} />
                        </button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
};

export default AllMerchant;
