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
import { toast } from "sonner";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";
import { useAdminStaff } from "../../../redux/features/admin/adminStaff/useAdminStaff";
import { useDeleteAdminStaffMutation } from "../../../redux/features/admin/adminStaff/adminStaffApi";

const StaffManage = () => {
  const {
    staffs,
    pagination,
    isLoading,
    error,
    actions: { setSearch, setStatus, setCurrentPage, resetFilters },
    filters: { debouncedSearch, status },
  } = useAdminStaff();

  const [deleteStaff, { isLoading: isDeleting }] =
    useDeleteAdminStaffMutation();
  const [selected, setSelected] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
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
        items={[{ label: "Home", to: "/" }, { label: "Staff" }]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            All Staff List
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <SearchInput
              placeholder="Search staff..."
              value={debouncedSearch}
              onChange={(e) => setSearch(e.target.value)}
            />

            <DropdownSelect
              value={status}
              onChange={(val) => setStatus(val)}
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
              to="/admin/staff-manage/create"
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
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Staff ID
                </TableHead>
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
                  Designation
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Last Login
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Join Date
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <MerchantStaffSkeleton rows={8} cols={7} />
              ) : staffs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    No staff found
                  </TableCell>
                </TableRow>
              ) : (
                staffs.map((staff) => (
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
                    <TableCell>{staff.id}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>
                      {staff?.designation || (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={staff.status} />
                    </TableCell>
                    <TableCell>
                      {staff?.lastLogin ? (
                        <span>
                          {new Date(staff.lastLogin).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {staff?.created_at ? (
                        <span>
                          {new Date(staff.created_at).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Link
                          to={`/admin/staff-manage/details/${staff.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={20} />
                        </Link>

                        <Link
                          to={`/admin/staff-manage/update/${staff.id}`}
                          className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500"
                        >
                          <PencilLine size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(staff.id)}
                          disabled={deletingId === staff.id}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500 flex items-center gap-1"
                        >
                          {deletingId === staff.id ? (
                            <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2Icon size={16} />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffManage;
