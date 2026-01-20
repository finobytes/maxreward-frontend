import React, { useState } from "react";
import { Eye, XCircle, RotateCcw } from "lucide-react"; // Icons
import {
  useGetMyOrdersQuery,
  useGetMemberOrderDetailsQuery,
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
import StatusBadge from "../../../components/table/StatusBadge"; // Verify path
import Pagination from "../../../components/table/Pagination"; // Verify path
import PrimaryButton from "../../../components/ui/PrimaryButton"; // Verify path

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

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

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

const Orders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading, error } = useGetMyOrdersQuery({
    page,
    per_page: 10,
    ...(statusFilter ? { status: statusFilter } : {}),
  });
  const [cancelOrder, { isLoading: isCancelling }] =
    useCancelMemberOrderMutation();
  const [requestReturn, { isLoading: isReturning }] =
    useRequestReturnOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsOrderNumber, setDetailsOrderNumber] = useState(null);
  const [reasonType, setReasonType] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");

  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useGetMemberOrderDetailsQuery(detailsOrderNumber, {
    skip: !detailsOrderNumber,
  });

  const orders = data?.data?.data || [];
  const meta = data?.data || {};
  const orderDetails = detailsData?.data?.order;

  const resetActionState = () => {
    setSelectedOrder(null);
    setReasonType("");
    setReasonDetails("");
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setReasonType(CANCEL_REASONS[0].value);
    setReasonDetails("");
    setCancelModalOpen(true);
  };

  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setReasonType(RETURN_REASONS[0].value);
    setReasonDetails("");
    setReturnModalOpen(true);
  };

  const handleDetailsClick = (order) => {
    setDetailsOrderNumber(order.order_number);
    setDetailsModalOpen(true);
  };

  const handleCancelModalChange = (open) => {
    setCancelModalOpen(open);
    if (!open) resetActionState();
  };

  const handleReturnModalChange = (open) => {
    setReturnModalOpen(open);
    if (!open) resetActionState();
  };

  const handleDetailsModalChange = (open) => {
    setDetailsModalOpen(open);
    if (!open) setDetailsOrderNumber(null);
  };

  const submitCancel = async () => {
    if (!selectedOrder?.order_number) {
      toast.error("Please select an order to cancel.");
      return;
    }
    if (!reasonType) {
      toast.error("Please select a cancellation reason.");
      return;
    }
    try {
      await cancelOrder({
        orderNumber: selectedOrder.order_number, // Ensure backend expects order_number path param
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
    if (!selectedOrder?.order_number) {
      toast.error("Please select an order to return.");
      return;
    }
    if (!reasonType) {
      toast.error("Please select a return reason.");
      return;
    }
    try {
      await requestReturn({
        orderNumber: selectedOrder.order_number,
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
        {/* Filters - Simplified for now as API mainly filters by Status */}
        <div className="flex gap-2">
          {["", "pending", "completed", "cancelled", "returned"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
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
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>{order.merchant?.name || "N/A"}</TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {order.total_amount_display ||
                          `${order.total_points} pts`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDetailsClick(order)}
                          className="p-2 hover:bg-gray-50 text-gray-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-gray-200"
                          title="View Details"
                        >
                          <Eye size={14} /> View
                        </button>

                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancelClick(order)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-red-200"
                            title="Cancel Order"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                        {order.status === "completed" && (
                          <button
                            onClick={() => handleReturnClick(order)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-blue-200"
                            title="Request Return"
                          >
                            <RotateCcw size={14} /> Return
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end">
          <Pagination
            currentPage={meta.current_page || 1}
            totalPages={meta.last_page || 1}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={handleDetailsModalChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Order Details{" "}
              {detailsOrderNumber ? `#${detailsOrderNumber}` : ""}
            </DialogTitle>
            <DialogDescription>
              Review order information, items, and status.
            </DialogDescription>
          </DialogHeader>
          {isDetailsLoading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : detailsError ? (
            <div className="py-10 text-center text-red-500">
              Failed to load order details.
            </div>
          ) : !orderDetails ? (
            <div className="py-10 text-center text-gray-500">
              No order details found.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  label="Order Number"
                  value={orderDetails.order_number || "-"}
                  mono
                />
                <DetailItem
                  label="Status"
                  value={<StatusBadge status={orderDetails.status} />}
                />
                <DetailItem
                  label="Placed On"
                  value={formatDateTime(orderDetails.created_at)}
                />
                <DetailItem
                  label="Merchant"
                  value={orderDetails.merchant?.name || "-"}
                />
                <DetailItem
                  label="Tracking Number"
                  value={orderDetails.tracking_number || "-"}
                  mono
                />
                <DetailItem
                  label="Total"
                  value={
                    orderDetails.total_amount_display ||
                    (orderDetails.total_points != null
                      ? `${orderDetails.total_points} pts`
                      : "-")
                  }
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">Items</h3>
                {orderDetails.items?.length ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Variation</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetails.items.map((item, index) => {
                          const name =
                            item?.product?.name ||
                            item?.product_name ||
                            item?.name ||
                            "Item";
                          const variation =
                            item?.productVariation?.name ||
                            item?.product_variation?.name ||
                            item?.variation?.name ||
                            "-";
                          const quantity = item?.quantity ?? item?.qty ?? "-";
                          const total =
                            item?.total_points ??
                            item?.points ??
                            item?.total_amount_display ??
                            "-";
                          return (
                            <TableRow key={item?.id || index}>
                              <TableCell className="font-medium">
                                {name}
                              </TableCell>
                              <TableCell>{variation}</TableCell>
                              <TableCell>{quantity}</TableCell>
                              <TableCell>
                                {typeof total === "number"
                                  ? `${total} pts`
                                  : total}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No items found.</div>
                )}
              </div>

              {orderDetails.cancelReason && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Return/Cancellation Reason
                  </h3>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Type:</span>{" "}
                      {orderDetails.cancelReason.reason_type
                        ?.replace(/_/g, " ")
                        ?.toUpperCase() || "-"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Details:</span>{" "}
                      {orderDetails.cancelReason.reason_details || "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => handleDetailsModalChange(false)}
            >
              Close
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
              Are you sure you want to cancel this order? This action cannot be
              undone. Points will be refunded.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={reasonType}
                onChange={(e) => setReasonType(e.target.value)}
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
                Additional Details
              </label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                placeholder="Please provide more details..."
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => handleCancelModalChange(false)}
            >
              None, Keep Order
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              onClick={submitCancel}
              disabled={isCancelling || !selectedOrder?.order_number}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={returnModalOpen} onOpenChange={handleReturnModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Request Return for #{selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription>
              Submit a return request. If approved or processed, points will be
              refunded.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={reasonType}
                onChange={(e) => setReasonType(e.target.value)}
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
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
                placeholder="Please explain why you are returning..."
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => handleReturnModalChange(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              onClick={submitReturn}
              disabled={isReturning || !selectedOrder?.order_number}
            >
              {isReturning ? "Submitting..." : "Submit Return"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DetailItem = ({ label, value, mono = false }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <div
      className={
        mono ? "font-mono text-sm text-gray-900" : "text-sm text-gray-900"
      }
    >
      {value ?? "-"}
    </div>
  </div>
);

export default Orders;
