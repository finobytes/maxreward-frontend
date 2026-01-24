import React, { useState } from "react";
import { Link } from "react-router";
import { Eye, XCircle, RotateCcw } from "lucide-react";
import {
  useGetMyOrdersQuery,
  useCancelMemberOrderMutation,
  useRequestReturnOrderMutation,
} from "../../../redux/features/member/orders/memberOrderApi";
import { toast } from "sonner";
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
import SearchInput from "../../../components/form/form-elements/SearchInput";
import {
  formatDate,
  getItemsLabel,
  getMerchantName,
  getOrderShippingDisplay,
  getOrderTotalDisplay,
  normalizeStatus,
} from "./orderUtils";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

const CANCEL_REASONS = [
  { label: "Customer requested cancellation", value: "customer_request" },
  { label: "Wrong order placed", value: "wrong_order" },
  { label: "Duplicate order", value: "duplicate_order" },
  { label: "Other reason", value: "other" },
];

const RETURN_REASONS = [
  { label: "Product is defective/damaged", value: "defective_product" },
  { label: "Received wrong item", value: "wrong_item" },
  { label: "Product not as described", value: "not_as_described" },
  { label: "Customer changed mind", value: "changed_mind" },
  { label: "Quality not satisfactory", value: "quality_issue" },
  { label: "Other reason", value: "other" },
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

const StatusFilterBar = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {STATUS_FILTERS.map((filter) => {
      const isActive = value === filter.value;
      return (
        <button
          key={filter.value || "all"}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isActive
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      );
    })}
  </div>
);

const TableStateRow = ({ colSpan, className = "", children }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className={`text-center py-8 ${className}`}>
      {children}
    </TableCell>
  </TableRow>
);

const OrderRow = ({ order, onCancel, onReturn }) => {
  const normalizedStatus = normalizeStatus(order?.status);
  const shippingDisplay = getOrderShippingDisplay(order);
  const orderNumber = order?.order_number || "";
  const viewPath = orderNumber
    ? `/member/orders/${encodeURIComponent(orderNumber)}`
    : null;
  const viewActionClass =
    "p-2 hover:bg-gray-50 text-gray-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-gray-200";

  return (
    <TableRow>
      <TableCell className="font-medium">
        <span
          className="font-mono text-xs sm:text-sm"
          title={orderNumber ? orderNumber : "Order number unavailable"}
        >
          {orderNumber || "-"}
        </span>
      </TableCell>
      <TableCell>{formatDate(order?.created_at)}</TableCell>
      <TableCell>{getMerchantName(order?.merchant)}</TableCell>
      <TableCell className="text-sm">{getItemsLabel(order)}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-semibold">{getOrderTotalDisplay(order)}</span>
          {shippingDisplay && (
            <span className="text-xs text-gray-500">
              Shipping: {shippingDisplay}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={order?.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {viewPath ? (
            <Link
              to={viewPath}
              className={viewActionClass}
              title="View Details"
            >
              <Eye size={14} /> View
            </Link>
          ) : (
            <span
              className={`${viewActionClass} cursor-not-allowed text-gray-400 bg-gray-50`}
              title="Order number unavailable"
              aria-disabled="true"
            >
              <Eye size={14} /> View
            </span>
          )}

          {normalizedStatus === "pending" && (
            <button
              type="button"
              onClick={() => onCancel(order)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-red-200"
              title="Cancel Order"
            >
              <XCircle size={14} /> Cancel
            </button>
          )}
          {normalizedStatus === "completed" && (
            <button
              type="button"
              onClick={() => onReturn(order)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-blue-200"
              title="Request Return"
            >
              <RotateCcw size={14} /> Return
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

const OrdersTable = ({ orders, isLoading, error, onCancel, onReturn }) => {
  const renderRows = () => {
    if (isLoading) {
      return <TableStateRow colSpan={7}>Loading...</TableStateRow>;
    }

    if (error) {
      return (
        <TableStateRow colSpan={7} className="text-red-500">
          Failed to load orders.
        </TableStateRow>
      );
    }

    if (!orders.length) {
      return (
        <TableStateRow colSpan={7} className="text-gray-500">
          No orders found.
        </TableStateRow>
      );
    }

    return orders.map((order, index) => (
      <OrderRow
        key={order?.id || order?.order_number || index}
        order={order}
        onCancel={onCancel}
        onReturn={onReturn}
      />
    ));
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};

const ReasonModal = ({
  open,
  onOpenChange,
  title,
  description,
  reasons,
  reasonType,
  reasonDetails,
  onReasonTypeChange,
  onReasonDetailsChange,
  confirmLabel,
  confirmLoadingLabel,
  confirmVariant,
  confirmLoading,
  confirmDisabled,
  secondaryLabel,
  textareaPlaceholder,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <select
            className="w-full border rounded-md p-2 text-sm bg-white"
            value={reasonType}
            onChange={(e) => onReasonTypeChange(e.target.value)}
          >
            {reasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Details
          </label>
          <textarea
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
            placeholder={textareaPlaceholder}
            value={reasonDetails}
            onChange={(e) => onReasonDetailsChange(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <PrimaryButton variant="secondary" onClick={() => onOpenChange(false)}>
          {secondaryLabel}
        </PrimaryButton>
        <PrimaryButton
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={confirmLoading || confirmDisabled}
        >
          {confirmLoading ? confirmLoadingLabel : confirmLabel}
        </PrimaryButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const Orders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const { data, isLoading, error } = useGetMyOrdersQuery({
    page,
    per_page: 10,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
  });
  const [cancelOrder, { isLoading: isCancelling }] =
    useCancelMemberOrderMutation();
  const [requestReturn, { isLoading: isReturning }] =
    useRequestReturnOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [reasonType, setReasonType] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");

  const orders = data?.data?.data || [];
  const meta = data?.data || {};
  const selectedOrderNumber = selectedOrder?.order_number || "";

  const resetActionState = () => {
    setSelectedOrder(null);
    setReasonType("");
    setReasonDetails("");
  };

  const handleFilterChange = (nextStatus) => {
    setStatusFilter(nextStatus);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCancelClick = (order) => {
    if (!order?.order_number) return;
    setSelectedOrder(order);
    setReasonType(CANCEL_REASONS[0]?.value || "");
    setReasonDetails("");
    setCancelModalOpen(true);
  };

  const handleReturnClick = (order) => {
    if (!order?.order_number) return;
    setSelectedOrder(order);
    setReasonType(RETURN_REASONS[0]?.value || "");
    setReasonDetails("");
    setReturnModalOpen(true);
  };

  const handleCancelModalChange = (open) => {
    setCancelModalOpen(open);
    if (!open) resetActionState();
  };

  const handleReturnModalChange = (open) => {
    setReturnModalOpen(open);
    if (!open) resetActionState();
  };

  const submitCancel = async () => {
    if (!selectedOrderNumber) {
      toast.error("Please select an order to cancel.");
      return;
    }
    if (!reasonType) {
      toast.error("Please select a cancellation reason.");
      return;
    }
    try {
      await cancelOrder({
        orderNumber: selectedOrderNumber,
        reason_type: reasonType,
        ...(reasonDetails?.trim()
          ? { reason_details: reasonDetails.trim() }
          : {}),
      }).unwrap();
      toast.success("Order cancelled successfully");
      setCancelModalOpen(false);
      resetActionState();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to cancel order"));
    }
  };

  const submitReturn = async () => {
    if (!selectedOrderNumber) {
      toast.error("Please select an order to return.");
      return;
    }
    if (!reasonType) {
      toast.error("Please select a return reason.");
      return;
    }
    try {
      await requestReturn({
        orderNumber: selectedOrderNumber,
        reason_type: reasonType,
        ...(reasonDetails?.trim()
          ? { reason_details: reasonDetails.trim() }
          : {}),
      }).unwrap();
      toast.success("Return requested successfully");
      setReturnModalOpen(false);
      resetActionState();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to request return"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by order number or merchant..."
          />
          <StatusFilterBar value={statusFilter} onChange={handleFilterChange} />
        </div>

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          error={error}
          onCancel={handleCancelClick}
          onReturn={handleReturnClick}
        />

        <div className="">
          <Pagination
            currentPage={meta.current_page || 1}
            totalPages={meta.last_page || 1}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ReasonModal
        open={cancelModalOpen}
        onOpenChange={handleCancelModalChange}
        title={`Cancel Order #${selectedOrderNumber}`}
        description="Are you sure you want to cancel this order? This action cannot be undone. Points will be refunded."
        reasons={CANCEL_REASONS}
        reasonType={reasonType}
        reasonDetails={reasonDetails}
        onReasonTypeChange={setReasonType}
        onReasonDetailsChange={setReasonDetails}
        confirmLabel="Yes, Cancel Order"
        confirmLoadingLabel="Cancelling..."
        confirmVariant="danger"
        confirmLoading={isCancelling}
        confirmDisabled={!selectedOrderNumber}
        secondaryLabel="None, Keep Order"
        textareaPlaceholder="Please provide more details..."
        onConfirm={submitCancel}
      />

      <ReasonModal
        open={returnModalOpen}
        onOpenChange={handleReturnModalChange}
        title={`Request Return for #${selectedOrderNumber}`}
        description="Submit a return request. If approved or processed, points will be refunded."
        reasons={RETURN_REASONS}
        reasonType={reasonType}
        reasonDetails={reasonDetails}
        onReasonTypeChange={setReasonType}
        onReasonDetailsChange={setReasonDetails}
        confirmLabel="Submit Return"
        confirmLoadingLabel="Submitting..."
        confirmVariant="primary"
        confirmLoading={isReturning}
        confirmDisabled={!selectedOrderNumber}
        secondaryLabel="Cancel"
        textareaPlaceholder="Please explain why you are returning..."
        onConfirm={submitReturn}
      />
    </div>
  );
};

export default Orders;
