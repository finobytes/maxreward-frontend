import React, { useMemo, useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import {
  useGetMerchantOrdersQuery,
  useCompleteOrderMutation,
} from "../../../redux/features/merchant/orders/merchantOrderApi";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const getApiErrorMessage = (err, fallback) => {
  if (err?.data?.message) return err.data.message;
  const errors = err?.data?.errors;
  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstMessage = errors[firstKey]?.[0];
    if (firstMessage) return firstMessage;
  }
  return fallback;
};

const PendingOrder = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [perPage, setPerPage] = useState(10);

  const trimmedSearch = search.trim();
  const { data, isLoading, isFetching, error } = useGetMerchantOrdersQuery({
    page,
    status: "pending",
    per_page: perPage,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
  });
  const [completeOrder, { isLoading: isCompleting }] =
    useCompleteOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

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

  const resetModalState = () => {
    setSelectedOrder(null);
    setTrackingNumber("");
  };

  const handleCompleteClick = (order) => {
    setSelectedOrder(order);
    setTrackingNumber("");
    setModalOpen(true);
  };

  const handleModalChange = (open) => {
    setModalOpen(open);
    if (!open) resetModalState();
  };

  const submitComplete = async () => {
    if (!selectedOrder?.order_number) {
      toast.error("Please select an order to complete.");
      return;
    }
    try {
      const payload = {
        orderNumber: selectedOrder.order_number,
        ...(trackingNumber?.trim()
          ? { tracking_number: trackingNumber.trim() }
          : {}),
      };
      await completeOrder(payload).unwrap();
      toast.success("Order completed successfully");
      setModalOpen(false);
      resetModalState();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to complete order"));
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setDateFilter("all");
    setSortBy("newest");
    setPerPage(10);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
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
            <PrimaryButton variant="secondary" size="md" onClick={handleClearFilters}>
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
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-red-500"
                  >
                    Failed to load orders.
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {hasActiveFilters
                      ? "No orders match the current filters."
                      : "No pending orders found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <span className="font-mono text-xs sm:text-sm">
                        {order.order_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.member?.name || "Guest"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.member?.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {getOrderTotalDisplay(order)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleCompleteClick(order)}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-green-200"
                          title="Complete Order"
                        >
                          <CheckCircle size={14} /> Complete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
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

      {/* Complete Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Complete Order #{selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription>
              Mark this order as fulfilled. You can optionally provide a
              tracking number.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tracking Number (Optional)
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm"
                placeholder="e.g. TRK123456789MY"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => handleModalChange(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              onClick={submitComplete}
              disabled={isCompleting || !selectedOrder?.order_number}
            >
              {isCompleting ? "Completing..." : "Complete Order"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingOrder;
