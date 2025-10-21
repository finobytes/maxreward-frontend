import React, { useMemo, useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import { Eye, Plus } from "lucide-react";
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
import BulkActionBar from "../referNewMember/components/BulkActionBar";
import { DateRangePicker } from "../../../components/shared/DateRangePicker";

// ✅ Dummy voucher data
const dummyVouchers = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  voucherId: `VID-${1000 + i}`,
  type: ["Max Voucher", "Refer Voucher"][Math.floor(Math.random() * 2)],
  denomination: [10, 20, 50, 100][Math.floor(Math.random() * 4)],
  quantity: Math.floor(Math.random() * 5) + 1,
  totalAmount: Math.floor(Math.random() * 1000) + 100,
  points: Math.floor(Math.random() * 5000),
  paymentMethod: ["Online", "Manual"][Math.floor(Math.random() * 2)],
  status: ["Completed", "Pending", "Failed"][Math.floor(Math.random() * 3)],
  created: `Oct ${Math.floor(Math.random() * 28) + 1}, 2024`,
}));

const PurchaseVoucher = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchers, setVouchers] = useState(dummyVouchers);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const rowsPerPage = 10;

  // ✅ Filter logic
  const filteredData = useMemo(() => {
    return vouchers.filter((v) => {
      const matchesSearch =
        v.voucherId.toLowerCase().includes(search.toLowerCase()) ||
        v.type.toLowerCase().includes(search.toLowerCase()) ||
        v.paymentMethod.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, vouchers]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ✅ Selection logic
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

  // ✅ Bulk Actions
  const bulkUpdateStatus = (newStatus) => {
    setVouchers((prev) =>
      prev.map((v) =>
        selected.includes(v.id) ? { ...v, status: newStatus } : v
      )
    );
    setSelected([]);
  };

  const bulkDelete = () => {
    setVouchers((prev) => prev.filter((v) => !selected.includes(v.id)));
    setSelected([]);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Voucher Purchase" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="max-w-full overflow-x-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              My Voucher History
            </h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search here..."
              />
              <DateRangePicker
                value={dateRange}
                onChange={(range) => setDateRange(range)}
              />
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
                    { label: "Completed", value: "Completed" },
                    { label: "Pending", value: "Pending" },
                    { label: "Failed", value: "Failed" },
                  ]}
                />
                <PrimaryButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                >
                  Clear
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selected.length > 0 && (
            <BulkActionBar
              selectedCount={selected.length}
              onSetActive={() => bulkUpdateStatus("Completed")}
              onSetBlocked={() => bulkUpdateStatus("Failed")}
              onSetSuspended={() => bulkUpdateStatus("Pending")}
              onDelete={bulkDelete}
            />
          )}

          {/* ✅ Complete Table */}
          <div className="mt-4 relative overflow-x-auto w-full">
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
                  <TableHead>Voucher ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Denomination</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((v) => (
                  <TableRow key={v.id} className="hover:bg-gray-50 transition">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(v.id)}
                        onChange={() => toggleSelect(v.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{v.voucherId}</TableCell>
                    <TableCell>
                      <StatusBadge status={v.type}>{v.type}</StatusBadge>
                    </TableCell>
                    <TableCell>${v.denomination}</TableCell>
                    <TableCell>{v.quantity}</TableCell>
                    <TableCell>${v.totalAmount}</TableCell>
                    <TableCell>{v.points}</TableCell>
                    <TableCell>{v.paymentMethod}</TableCell>
                    <TableCell>{v.created}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-center items-center">
                        <Link
                          to={``}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={20} />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
