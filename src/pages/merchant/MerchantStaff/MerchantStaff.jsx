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
import { Skeleton } from "@/components/ui/skeleton";
import { useMerchantStaff } from "../../../redux/features/merchant/merchantStaff/useMerchantStaff";

// Skeleton Loader Component
const TableSkeleton = ({ rows = 10, cols = 6 }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="w-4 h-4 rounded" />
        </TableCell>
        {[...Array(cols)].map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-24" />
          </TableCell>
        ))}
        <TableCell>
          <div className="flex justify-center gap-2">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

const MerchantStaff = () => {
  const {
    staffs,
    pagination,
    isLoading,
    actions: { setDebouncedSearch, setStatus, resetFilters, setCurrentPage },
    filters: { search, status },
  } = useMerchantStaff();

  const [selected, setSelected] = useState([]);

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

  const handleDelete = (id) => {
    // Implement delete functionality here
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Merchant Staff" }]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Merchant Staff List
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <SearchInput
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setDebouncedSearch(e.target.value)}
            />

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
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={8} cols={5} />
              ) : staffs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No staff found
                  </TableCell>
                </TableRow>
              ) : (
                staffs.map((staff) => (
                  <TableRow
                    key={staff.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(staff.id)}
                        onChange={() => toggleSelect(staff.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{staff.staffId || staff.id}</TableCell>
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
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500"
                        >
                          <Trash2Icon size={16} />
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

export default MerchantStaff;
