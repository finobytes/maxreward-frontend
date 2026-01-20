import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  useGetMerchantOrdersQuery,
  useCompleteOrderMutation,
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

const PendingOrder = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetMerchantOrdersQuery({
    page,
    status: "pending",
    per_page: 10,
  });
  const [completeOrder, { isLoading: isCompleting }] =
    useCompleteOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const orders = data?.data?.data || [];
  const meta = data?.data || {};

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
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
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No pending orders found.
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
