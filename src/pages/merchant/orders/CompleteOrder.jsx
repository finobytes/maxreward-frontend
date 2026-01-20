import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  useGetMerchantOrdersQuery,
  useAcceptReturnOrderMutation,
} from "../../../redux/features/merchant/orders/merchantOrderApi";
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

const CompleteOrder = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetMerchantOrdersQuery({
    page,
    status: "completed",
    per_page: 10,
  });
  const [acceptReturn, { isLoading: isProcessing }] =
    useAcceptReturnOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reasonType, setReasonType] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");

  const orders = data?.data?.data || [];
  const meta = data?.data || {};

  const resetModalState = () => {
    setSelectedOrder(null);
    setReasonType("");
    setReasonDetails("");
  };

  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setReasonType(RETURN_REASONS[0].value);
    setReasonDetails("");
    setModalOpen(true);
  };

  const handleModalChange = (open) => {
    setModalOpen(open);
    if (!open) resetModalState();
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
      await acceptReturn({
        orderNumber: selectedOrder.order_number,
        reason_type: reasonType,
        ...(reasonDetails?.trim()
          ? { reason_details: reasonDetails.trim() }
          : {}),
      }).unwrap();
      toast.success("Return processed successfully");
      setModalOpen(false);
      resetModalState();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to process return"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Completed Orders</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-red-500"
                  >
                    Failed to load orders.
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No completed orders found.
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
                      {order.tracking_number ? (
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {order.tracking_number}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
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
                          onClick={() => handleReturnClick(order)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-red-200"
                          title="Process Return"
                        >
                          <RotateCcw size={14} /> Return
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

      {/* Return Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Process Return for #{selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription>
              Process a return for this completed order. This will refund points
              to the member.
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
                Details (Optional)
              </label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                placeholder="Additional notes about this return..."
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
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
              variant="danger"
              onClick={submitReturn}
              disabled={isProcessing || !selectedOrder?.order_number}
            >
              {isProcessing ? "Processing..." : "Process Refund"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompleteOrder;
