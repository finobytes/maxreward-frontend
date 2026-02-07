import React, { useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { useGetMerchantOrdersQuery } from "../../../redux/features/merchant/orders/merchantOrderApi";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "../../../components/table/StatusBadge";
import Pagination from "../../../components/table/Pagination";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import {
  DATE_FILTER_OPTIONS,
  PER_PAGE_OPTIONS,
  SORT_OPTIONS,
  filterOrders,
  formatDate,
  getOrderTotalDisplay,
  sortOrders,
} from "./orderTableUtils";

const CompleteOrder = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [perPage, setPerPage] = useState(10);

  const trimmedSearch = search.trim();
  const { data, isLoading, isFetching, error } = useGetMerchantOrdersQuery({
    page,
    status: "completed",
    per_page: perPage,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
  });

  const orders = data?.data?.data || [];
  const meta = data?.data || {};

  const filteredOrders = useMemo(() => {
    const filtered = filterOrders(orders, {
      search: trimmedSearch,
      dateFilter,
    });
    return sortOrders(filtered, sortBy);
  }, [orders, trimmedSearch, dateFilter, sortBy]);

  const hasActiveFilters = Boolean(trimmedSearch) || dateFilter !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setDateFilter("all");
    setSortBy("newest");
    setPerPage(10);
    setPage(1);
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            Loading...
          </TableCell>
        </TableRow>
      );
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-red-500">
            Failed to load orders.
          </TableCell>
        </TableRow>
      );
    }
    if (filteredOrders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
            {hasActiveFilters
              ? "No orders match the current filters."
              : "No completed orders found."}
          </TableCell>
        </TableRow>
      );
    }

    return filteredOrders.map((order) => (
      <TableRow key={order.id}>
        <TableCell className="font-medium">
          <span className="font-mono text-xs sm:text-sm">
            {order.order_number}
          </span>
        </TableCell>
        <TableCell>{formatDate(order.created_at)}</TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{order.member?.name || "Guest"}</span>
            <span className="text-xs text-gray-500">{order.member?.phone}</span>
          </div>
        </TableCell>
        <TableCell>
          {order.tracking_number ? (
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {order.tracking_number}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </TableCell>
        <TableCell>
          <span className="font-semibold">{getOrderTotalDisplay(order)}</span>
        </TableCell>
        <TableCell>
          <StatusBadge status={order.status} />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Completed Orders</h1>
      </div>

      <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            placeholder="Search by order ID, member, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <div className="flex flex-wrap items-center gap-3">
            <DropdownSelect
              value={dateFilter}
              onChange={(val) => {
                setDateFilter(val);
                setPage(1);
              }}
              options={DATE_FILTER_OPTIONS}
            />
            <DropdownSelect
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
            />
            <DropdownSelect
              value={perPage}
              onChange={(val) => {
                setPerPage(Number(val));
                setPage(1);
              }}
              options={PER_PAGE_OPTIONS}
            />
            <PrimaryButton
              variant="secondary"
              size="md"
              onClick={handleClearFilters}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {hasActiveFilters && (
          <p className="text-xs text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders on this
            page.
          </p>
        )}

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Pagination
            currentPage={meta.current_page || 1}
            totalPages={meta.last_page || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteOrder;
