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
import { useGetMemberVouchersQuery } from "../../../redux/features/member/voucherPurchase/voucherApi";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";

const PurchaseVoucher = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vouchers from backend pagination
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetMemberVouchersQuery(currentPage); // ⭐ page passed here
  console.log("response from backend with pagination:", apiResponse);
  const vouchers = apiResponse?.vouchers?.data ?? [];
  const pagination = apiResponse?.vouchers;

  const backendCurrentPage = pagination?.current_page ?? 1;
  const backendTotalPages = pagination?.last_page ?? 1;

  const errorMessage = apiResponse?.message || "Vouchers not found";
  console.log("api response", apiResponse);
  // === Filtering (works only on current page data)
  const filteredData = useMemo(() => {
    return vouchers.filter((v) => {
      const type = v.voucher_type?.toLowerCase() || "";
      const payment = v.payment_method?.toLowerCase() || "";
      const idStr = v.id?.toString() || "";

      const matchesSearch =
        type.includes(search.toLowerCase()) ||
        payment.includes(search.toLowerCase()) ||
        idStr.includes(search);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : v.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, vouchers]);

  // Backend pagination — filtered data does NOT affect pagination
  const paginatedData = filteredData; // ⭐ No slicing anymore

  const toggleSelectAll = (checked) => {
    setSelected(checked ? paginatedData.map((v) => v.id) : []);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  // === Render
  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Voucher Purchase" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          {/* Header */}
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
                    { label: "Pending", value: "pending" },
                    { label: "Success", value: "success" },
                    { label: "Failed", value: "failed" },
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

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <BulkActionBar
              selectedCount={selected.length}
              actions={[
                {
                  label: "Export",
                  icon: "export",
                  variant: "success",
                  onClick: () => bulkUpdateStatus("export"),
                },
              ]}
            />
          )}

          {/* Table Section */}
          <div className="mt-4 relative overflow-x-auto w-full custom-scrollbar">
            {isLoading ? (
              <MerchantStaffSkeleton rows={8} cols={10} />
            ) : isError ? (
              <div className="p-6 text-center text-red-500">
                {errorMessage || "Something went wrong"}
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
                    <TableHead>S/N</TableHead>
                    <TableHead>Voucher Type</TableHead>
                    <TableHead>Denomination</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((v, idx) => (
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
                      <TableCell>
                        {(backendCurrentPage - 1) *
                          (pagination?.per_page || 0) +
                          idx +
                          1}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={v.voucher_type}>
                          {v.voucher_type}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {v?.denomination_history?.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.value}, Qty {item.quantity}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{v.quantity}</TableCell>
                      <TableCell>RM {v.total_amount}</TableCell>
                      <TableCell className="capitalize">
                        {v.payment_method}
                      </TableCell>
                      <TableCell>
                        {new Date(v.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={v.status}>{v.status}</StatusBadge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link
                          to={`/member/voucher-details/${v.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500 inline-block"
                        >
                          <Eye size={18} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Manual local pagination */}
            <Pagination
              currentPage={backendCurrentPage}
              totalPages={backendTotalPages}
              onPageChange={(page) => {
                setCurrentPage(page); // ⭐ Backend will fetch next page automatically
                setSelected([]); // Clear selections on page change
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseVoucher;
