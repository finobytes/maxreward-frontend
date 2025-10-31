import React, { useMemo, useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import { Eye, Plus, Loader } from "lucide-react";
import Pagination from "../../../components/table/Pagination";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVouchersQuery } from "../../../redux/features/member/voucherPurchase/voucherApi";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton"; // ✅ same skeleton reused

const PurchaseVoucher = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch vouchers
  const {
    data: vouchers = [],
    isLoading,
    isFetching,
    isError,
  } = useGetVouchersQuery();

  const rowsPerPage = 10;

  // ✅ Filter logic
  const filteredData = useMemo(() => {
    return vouchers.filter((v) => {
      const type = v.voucher_type?.toLowerCase() || "";
      const payment = v.payment_method?.toLowerCase() || "";
      const matchesSearch =
        type.includes(search.toLowerCase()) ||
        payment.includes(search.toLowerCase()) ||
        v.id.toString().includes(search);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : v.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, vouchers]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(paginatedData.map((v) => v.id));
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
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Voucher Purchase" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm relative">
        {/* ✅ Overlay loader like MemberManage */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, type, payment"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <PrimaryButton variant="primary" size="md" to="/member/add">
                <Plus size={18} />
                Add Voucher
              </PrimaryButton>
              <div className="flex items-center gap-4">
                <DropdownSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: "All", value: "All" },
                    { label: "Pending", value: "Pending" },
                    { label: "Approved", value: "Approved" },
                    { label: "Rejected", value: "Rejected" },
                  ]}
                />
                <PrimaryButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setSelected([]);
                  }}
                >
                  Clear
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* ✅ Bulk Actions */}
          {selected.length > 0 && (
            <BulkActionBar
              selectedCount={selected.length}
              actions={[
                {
                  label: "Export",
                  variant: "success",
                  onClick: () => bulkUpdateStatus("export"),
                },
              ]}
            />
          )}

          {/* ✅ Table & States */}
          <div className="mt-4 relative overflow-x-auto w-full custom-scrollbar">
            {isLoading ? (
              <MerchantStaffSkeleton rows={8} cols={9} /> // ✅ Skeleton placeholder
            ) : isError ? (
              <div className="p-6 text-center text-red-500">
                Failed to load vouchers.
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No vouchers found.
              </div>
            ) : (
              <Table className="w-full table-auto border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        checked={
                          paginatedData.length > 0 &&
                          selected.length === paginatedData.length
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Denomination</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((v) => (
                    <TableRow
                      key={v.id}
                      className="hover:bg-gray-50 transition"
                    >
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
                          {v.voucher_type}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{v?.denomination?.title}</TableCell>
                      <TableCell>{v.quantity}</TableCell>
                      <TableCell>RM {v.total_amount}</TableCell>
                      <TableCell>{v.payment_method}</TableCell>
                      <TableCell>
                        <StatusBadge status={v.status}>{v.status}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        {new Date(v.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center">
                          <Link
                            to="#"
                            className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseVoucher;
