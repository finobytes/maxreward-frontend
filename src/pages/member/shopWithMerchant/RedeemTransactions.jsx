import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye } from "lucide-react";
import { Link } from "react-router";
import {
  resetFilters,
  setPage,
  setSearch,
  setStatus,
} from "../../../redux/features/member/shopWithMerchant/purchaseManagementSlice";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemberPurchases } from "../../../redux/features/member/shopWithMerchant/useMemberPurchases";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const RedeemTransactions = () => {
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const {
    search = "",
    status = "all",
    page = 1,
  } = useSelector((s) => s.purchaseManagement || {});

  // local input for immediate typing (debounced into redux search)
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    setLocalSearch(search || "");
  }, [search]);

  const { purchases, pagination, isLoading, isError } = useMemberPurchases();

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const currentPage = pagination?.currentPage || page || 1;
  const totalPages = pagination?.lastPage || 1;

  const formatCurrency = (value) => `RM ${Number(value || 0).toFixed(2)}`;
  const formatPoints = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "-";

  const handleClear = () => {
    setLocalSearch("");
    dispatch(resetFilters());
    setSelected([]);
  };
  const toggleSelectAll = (checked) => {
    setSelected(checked ? purchases.map((v) => v.id) : []);
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
        items={[
          { label: "Home", to: "/" },
          { label: "Shop At Merchant", to: "/member/shop-with-merchant" },
          { label: "Redeem Transactions" },
        ]}
      />

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">All Redeem History</h3>

          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by transaction or merchant..."
            />
            <DropdownSelect
              value={status}
              onChange={(val) => dispatch(setStatus(val))}
              options={statusOptions}
            />

            <PrimaryButton variant="secondary" onClick={handleClear}>
              Clear
            </PrimaryButton>
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
        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4">
                  <input
                    type="checkbox"
                    checked={
                      purchases.length > 0 &&
                      selected.length === purchases.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </TableHead>

                <TableHead>Redemption ID</TableHead>
                <TableHead>Merchant Name</TableHead>
                <TableHead>Merchant ID</TableHead>
                <TableHead>Transaction Amount</TableHead>
                <TableHead>Redeem Points</TableHead>
                <TableHead>RM Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Redemption Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton Loading */}
              {isLoading && !purchases?.length ? (
                [...Array(6)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(9)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-red-500">
                    Failed to load purchases.
                  </TableCell>
                </TableRow>
              ) : purchases?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500">
                    No purchases found.
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => (
                  <TableRow
                    key={purchase?.id || purchase?.transaction_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(purchase.id)}
                        onChange={() => toggleSelect(purchase.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      {purchase?.transaction_id || `#${purchase?.id}`}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="font-medium text-gray-900">
                        {purchase?.merchant?.business_name || "N/A"}
                      </div>
                    </TableCell>

                    <TableCell>
                      {purchase?.merchant?.unique_number ||
                        purchase?.merchant_id ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(purchase?.transaction_amount)}
                    </TableCell>
                    <TableCell>
                      {formatPoints(purchase?.redeem_amount)} pts
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        purchase?.cash_redeem_amount ??
                          purchase?.transaction_amount
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={purchase?.status}>
                        {purchase?.status || "N/A"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{formatDate(purchase?.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          to="#"
                          className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (server) */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </div>
      </div>
    </div>
  );
};

export default RedeemTransactions;
