import React, { useState } from "react";
import { Link } from "react-router";
import { Plus, Check, X, CheckCheck, Eye } from "lucide-react";
import {
  useGetMerchantExchangesQuery,
  useApproveExchangeMutation,
  useRejectExchangeMutation,
  useCompleteExchangeMutation,
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
import CreateExchangeModal from "./CreateExchangeModal";

const EXCHANGE_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const ExchangedOrder = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();

  const { data, isLoading, error } = useGetMerchantExchangesQuery({
    page,
    per_page: 10,
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
  });

  const [approveExchange, { isLoading: isApproving }] =
    useApproveExchangeMutation();
  const [rejectExchange, { isLoading: isRejecting }] =
    useRejectExchangeMutation();
  const [completeExchange, { isLoading: isCompleting }] =
    useCompleteExchangeMutation();

  const [selectedExchange, setSelectedExchange] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const exchanges = data?.data?.data || [];
  const meta = data?.data || {};

  const handleApprove = async (exchange) => {
    if (!exchange?.id) return;
    try {
      await approveExchange(exchange.id).unwrap();
      toast.success("Exchange approved");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve exchange");
    }
  };

  const handleComplete = async (exchange) => {
    if (!exchange?.id) return;
    try {
      await completeExchange(exchange.id).unwrap();
      toast.success("Exchange completed");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to complete exchange");
    }
  };

  const handleRejectClick = (exchange) => {
    setSelectedExchange(exchange);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!selectedExchange?.id) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    try {
      await rejectExchange({
        id: selectedExchange.id,
        rejection_reason: rejectionReason,
      }).unwrap();
      toast.success("Exchange rejected");
      setRejectModalOpen(false);
      setSelectedExchange(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject exchange");
    }
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            Loading...
          </TableCell>
        </TableRow>
      );
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 text-red-500">
            Failed to load exchanges.
          </TableCell>
        </TableRow>
      );
    }
    if (exchanges.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
            No exchange requests found.
          </TableCell>
        </TableRow>
      );
    }

    return exchanges.map((exchange) => (
      <TableRow key={exchange.id}>
        <TableCell className="font-mono text-xs">
          {exchange.exchange_number || exchange.id}
        </TableCell>
        <TableCell className="font-mono text-xs">
          {exchange.order?.order_number ? (
            <Link
              to={`/merchant/orders/view/${exchange.order.order_number}`}
              className="text-brand-600 hover:underline"
            >
              {exchange.order.order_number}
            </Link>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {exchange.old_item?.product_name || "Item"}
            </span>
            <span className="text-xs text-gray-500">
              {exchange.exchange_type}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {exchange.order?.member?.name || "Guest"}
            </span>
            <span className="text-xs text-gray-500">
              {exchange.order?.member?.phone}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <StatusBadge status={exchange.status} />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {exchange.order?.order_number && (
              <Link
                to={`/merchant/orders/view/${exchange.order.order_number}`}
                className="p-1.5 hover:bg-gray-50 text-gray-600 rounded border border-gray-200"
                title="View Order Details"
              >
                <Eye size={14} />
              </Link>
            )}
            {exchange.status === "pending" && (
              <>
                <button
                  onClick={() => handleApprove(exchange)}
                  className="p-1.5 hover:bg-green-50 text-green-600 rounded border border-green-200"
                  title="Approve"
                  disabled={isApproving}
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => handleRejectClick(exchange)}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded border border-red-200"
                  title="Reject"
                >
                  <X size={14} />
                </button>
              </>
            )}
            {exchange.status === "approved" && (
              <button
                onClick={() => handleComplete(exchange)}
                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded border border-blue-200"
                title="Complete"
                disabled={isCompleting}
              >
                <CheckCheck size={14} />
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Exchange Management
        </h1>
        <PrimaryButton
          className="flex items-center gap-2"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus size={16} /> New Exchange
        </PrimaryButton>
      </div>

      <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            placeholder="Search request..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <div className="flex flex-wrap items-center gap-3">
            <DropdownSelect
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              options={EXCHANGE_STATUS_OPTIONS}
            />
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exchange ID</TableHead>
                <TableHead>Order Order</TableHead>
                <TableHead>New Item / Type</TableHead>
                <TableHead>Member</TableHead>
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

      <CreateExchangeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {}}
      />

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Exchange Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this exchange request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full border rounded-md p-2 text-sm"
              rows={3}
              placeholder="Rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              onClick={submitReject}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Reject Exchange"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExchangedOrder;
