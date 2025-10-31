import React, { useMemo, useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import { Eye, Loader } from "lucide-react";
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
import {
  useGetVouchersQuery,
  useApproveVoucherMutation,
} from "../../../redux/features/member/voucherPurchase/voucherApi";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";

const VoucherPurchase = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvingId, setApprovingId] = useState(null); // ✅ local approving ID

  const {
    data: vouchers = [],
    isLoading,
    isFetching,
    isError,
  } = useGetVouchersQuery();

  const [approveVoucher] = useApproveVoucherMutation(); // ✅ no need to destructure isLoading

  const rowsPerPage = 10;

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

  const handleApprove = async (id) => {
    setApprovingId(id); // ✅ only this row loading
    try {
      const res = await approveVoucher(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Voucher approved successfully!");
      } else {
        toast.error("Approval failed.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    } finally {
      setApprovingId(null); // ✅ reset after done
    }
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID"
            />
          </div>

          <div className="mt-4 relative overflow-x-auto w-full custom-scrollbar">
            {isLoading ? (
              <MerchantStaffSkeleton rows={8} cols={9} />
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
                      <TableCell className="py-4 flex gap-2 justify-center">
                        <Link
                          to="#"
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={18} />
                        </Link>

                        {v.status !== "success" && (
                          <button
                            onClick={() => handleApprove(v.id)}
                            disabled={approvingId === v.id}
                            className="px-3 py-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-600 disabled:opacity-50"
                          >
                            {approvingId === v.id ? "Approving..." : "Approve"}
                          </button>
                        )}
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

export default VoucherPurchase;
