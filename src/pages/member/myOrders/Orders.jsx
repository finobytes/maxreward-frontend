import React, { useState } from "react";
import { Eye, XCircle, RotateCcw } from "lucide-react"; // Icons
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
import StatusBadge from "../../../components/table/StatusBadge"; // Verify path
import Pagination from "../../../components/table/Pagination"; // Verify path
import SearchInput from "../../../components/form/form-elements/SearchInput"; // Verify path
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

const Orders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading, error } = useGetMyOrdersQuery({
    page,
    status: statusFilter,
    per_page: 10,
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

  const submitCancel = async () => {
    try {
      await cancelOrder({
        orderNumber: selectedOrder.order_number, // Ensure backend expects order_number path param
        reason_type: reasonType,
        reason_details: reasonDetails,
      }).unwrap();
      toast.success("Order cancelled successfully");
      setCancelModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };

  const submitReturn = async () => {
    try {
      await requestReturn({
        orderNumber: selectedOrder.order_number,
        reason_type: reasonType,
        reason_details: reasonDetails,
      }).unwrap();
      toast.success("Return requested successfully");
      setReturnModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request return");
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
                      {new Date(order.created_at).toLocaleDateString()}
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
                        {/* View Details - Placeholder for now, could link to a details page */}
                        {/* <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <Eye size={18} />
                        </button> */}

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

      {/* Cancel Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
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
              onClick={() => setCancelModalOpen(false)}
            >
              None, Keep Order
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              onClick={submitCancel}
              loading={isCancelling}
            >
              Yes, Cancel Order
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={returnModalOpen} onOpenChange={setReturnModalOpen}>
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
              onClick={() => setReturnModalOpen(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              onClick={submitReturn}
              loading={isReturning}
            >
              Submit Return
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
