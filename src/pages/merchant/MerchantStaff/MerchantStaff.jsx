import React, { useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import Pagination from "../../../components/table/Pagination";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Eye, PencilLine, Plus, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMerchantStaff } from "../../../redux/features/merchant/merchantStaff/useMerchantStaff";
import { useDeleteStaffMutation } from "../../../redux/features/merchant/merchantStaff/merchantStaffApi";
import { toast } from "sonner";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";

const MerchantStaff = () => {
  const {
    staffs,
    pagination,
    isLoading,
    actions: { setDebouncedSearch, setStatus, resetFilters, setCurrentPage },
    filters: { search, status },
  } = useMerchantStaff();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [selected, setSelected] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(staffs.map((s) => s.id));
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteStaff(id).unwrap();
      toast.success("Staff deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete staff");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Merchant Staff List" }]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setDebouncedSearch(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <DropdownSelect
              value={status}
              onChange={setStatus}
              options={[
                { label: "All", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />

            <PrimaryButton variant="secondary" size="md" onClick={resetFilters}>
              Clear
            </PrimaryButton>

            <PrimaryButton
              variant="primary"
              size="md"
              to="/merchant/merchant-staff/create"
            >
              <Plus size={18} /> Add New Staff
            </PrimaryButton>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4 relative overflow-x-auto w-full">
          <Table className="w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      staffs.length > 0 && selected.length === staffs.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </TableHead>
                <TableHead className="text-gray-700 font-medium">S/N</TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Full Name
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Phone Number
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Email
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <MerchantStaffSkeleton rows={8} cols={5} />
              ) : staffs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No staff found
                  </TableCell>
                </TableRow>
              ) : (
                staffs.map((staff, idx) => (
                  <TableRow
                    key={staff.id}
                    className={`transition ${
                      deletingId === staff.id
                        ? "opacity-50 pointer-events-none"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(staff.id)}
                        onChange={() => toggleSelect(staff.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      {(pagination?.current_page
                        ? pagination.current_page - 1
                        : 0) *
                        (pagination?.per_page || staffs.length) +
                        (idx + 1)}
                    </TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>
                      <StatusBadge status={staff.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Link
                          to={`/merchant/merchant-staff/${staff.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={20} />
                        </Link>

                        <Link
                          to={`/merchant/merchant-staff/update/${staff.id}`}
                          className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500"
                        >
                          <PencilLine size={16} />
                        </Link>

                        {/* <button
                          onClick={() => handleDelete(staff.id)}
                          disabled={deletingId === staff.id}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500 flex items-center gap-1"
                        >
                          {deletingId === staff.id ? (
                            <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2Icon size={16} />
                          )}
                        </button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={pagination?.current_page}
            totalPages={pagination?.last_page}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default MerchantStaff;
