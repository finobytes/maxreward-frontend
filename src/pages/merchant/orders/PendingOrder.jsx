import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { Truck, XCircle, Loader, Eye } from "lucide-react";
import {
  useGetMerchantOrdersQuery,
  useShipOrderMutation,
  useCancelOrderMutation,
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

const CANCEL_REASONS = [
  { label: "Out of stock", value: "out_of_stock" },
  { label: "Customer request", value: "customer_request" },
  { label: "Address issue", value: "address_issue" },
  { label: "Other", value: "other" },
];

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

  const [shipOrder, { isLoading: isShipping }] = useShipOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cancelReasonType, setCancelReasonType] = useState(
    CANCEL_REASONS[0].value,
  );
  const [cancelReasonDetails, setCancelReasonDetails] = useState("");

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
    setCancelReasonType(CANCEL_REASONS[0].value);
    setCancelReasonDetails("");
  };

  const handleShipClick = (order) => {
    setSelectedOrder(order);
    setTrackingNumber("");
    setShipModalOpen(true);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelReasonType(CANCEL_REASONS[0].value);
    setCancelReasonDetails("");
    setCancelModalOpen(true);
  };

  const handleShipModalChange = (open) => {
    setShipModalOpen(open);
    if (!open) resetModalState();
  };

  const handleCancelModalChange = (open) => {
    setCancelModalOpen(open);
    if (!open) resetModalState();
  };

  const submitShip = async () => {
    if (!selectedOrder?.order_number) return;
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    try {
      await shipOrder({
        orderNumber: selectedOrder.order_number,
        tracking_number: trackingNumber.trim(),
      }).unwrap();
      toast.success("Order shipped successfully");
      setShipModalOpen(false);
      resetModalState();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to ship order"));
    }
  };

  const submitCancel = async () => {
    if (!selectedOrder?.order_number) return;
    try {
      await cancelOrder({
        orderNumber: selectedOrder.order_number,
        reason_type: cancelReasonType,
        reason_details: cancelReasonDetails,
      }).unwrap();
      toast.success("Order cancelled successfully");
      setCancelModalOpen(false);
      resetModalState();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to cancel order"));
    }
  };

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
              : "No pending orders found."}
          </TableCell>
        </TableRow>
      );
    }

    return filteredOrders.map((order) => (
      <TableRow key={order.id}>
        <TableCell className="font-medium">
          <Link
            to={`/merchant/orders/view/${order.order_number}`}
            className="font-mono text-xs sm:text-sm text-brand-600 hover:underline"
          >
            {order.order_number}
          </Link>
        </TableCell>
        <TableCell>{formatDate(order.created_at)}</TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{order.member?.name || "Guest"}</span>
            <span className="text-xs text-gray-500">{order.member?.phone}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-semibold">{getOrderTotalDisplay(order)}</span>
        </TableCell>
        <TableCell>
          <StatusBadge status={order.status} />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Link
              to={`/merchant/orders/view/${order.order_number}`}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-gray-200"
              title="View Details"
            >
              <Eye size={14} /> View
            </Link>
            <button
              onClick={() => handleCancelClick(order)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-red-200"
              title="Cancel Order"
            >
              <XCircle size={14} /> Cancel
            </button>
            <button
              onClick={() => handleShipClick(order)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-blue-200"
              title="Ship Order"
            >
              <Truck size={14} /> Ship
            </button>
          </div>
        </TableCell>
      </TableRow>
    ));
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
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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

      {/* Ship Modal */}
      <Dialog open={shipModalOpen} onOpenChange={handleShipModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order #{selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Enter the tracking number to mark this order as shipped.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm"
                placeholder="e.g. TRACK123"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => handleShipModalChange(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              onClick={submitShip}
              disabled={isShipping || !trackingNumber.trim()}
            >
              {isShipping ? "Shipping..." : "Confirm Shipment"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={handleCancelModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cancel Order #{selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription>
              Are you sure? This will refund points to the member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={cancelReasonType}
                onChange={(e) => setCancelReasonType(e.target.value)}
              >
                {CANCEL_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Details (Optional)
              </label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                placeholder="Additional details..."
                value={cancelReasonDetails}
                onChange={(e) => setCancelReasonDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => handleCancelModalChange(false)}
            >
              Keep Order
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              onClick={submitCancel}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancel"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingOrder;
