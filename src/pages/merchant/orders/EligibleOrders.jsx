import React, { useMemo, useState } from "react";
import { Loader, Eye, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Link } from "react-router";
import {
  useGetEligibleOrdersQuery,
  useAutoCompleteOrdersMutation,
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

import Pagination from "../../../components/table/Pagination";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import {
  PER_PAGE_OPTIONS,
  SORT_OPTIONS,
  filterOrders,
  formatDate,
  getOrderTotalDisplay,
  sortOrders,
} from "./orderTableUtils";

const EligibleOrders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [perPage, setPerPage] = useState(10);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [errorDetailsModalOpen, setErrorDetailsModalOpen] = useState(false);
  const [autoCompleteErrors, setAutoCompleteErrors] = useState(null);

  // Fetch eligible orders
  const { data, isLoading, isFetching, error } = useGetEligibleOrdersQuery();

  // Auto-complete mutation
  const [autoCompleteOrders, { isLoading: isCompleting }] =
    useAutoCompleteOrdersMutation();

  const trimmedSearch = search.trim();
  const allOrders = useMemo(() => data?.data?.orders || [], [data]);
  const totalEligible = data?.data?.total_eligible || 0;

  // Client-side filtering and pagination since API returns all eligible orders
  const { paginatedOrders, totalPages } = useMemo(() => {
    // 1. Filter
    const filtered = filterOrders(allOrders, {
      search: trimmedSearch,
      dateFilter: "all",
    });

    // 2. Sort
    const sorted = sortOrders(filtered, sortBy);

    // 3. Paginate
    const total = sorted.length;
    const pages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const slice = sorted.slice(start, end);

    return { paginatedOrders: slice, totalPages: pages };
  }, [allOrders, trimmedSearch, sortBy, page, perPage]);

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("newest");
    setPerPage(10);
    setPage(1);
  };

  const handleAutoComplete = async () => {
    try {
      const result = await autoCompleteOrders().unwrap();

      if (result?.success) {
        const successCount = result?.data?.success || 0;
        const failedCount = result?.data?.failed || 0;

        // Use backend message if available, otherwise fallback
        const message =
          result?.message ||
          `Successfully auto-completed ${successCount} orders.`;

        toast.success(message);
        setConfirmModalOpen(false);

        // If there were any failures, show them
        if (failedCount > 0 && result?.data?.errors?.length > 0) {
          setAutoCompleteErrors(result.data);
          setErrorDetailsModalOpen(true);
        }
      } else {
        // Handle case where status is 200 but success is false
        const failedCount = result?.data?.failed || 0;
        const errorData = result?.data;

        toast.error(
          result?.message ||
            "Failed to auto-complete orders. Please try again.",
        );

        // Show detailed errors if available
        if (errorData?.errors?.length > 0) {
          setAutoCompleteErrors(errorData);
          setErrorDetailsModalOpen(true);
        }

        setConfirmModalOpen(false);
      }
    } catch (err) {
      console.error("Auto-completion error:", err);

      const errorData = err?.data?.data;
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to auto-complete orders. Please try again.";

      toast.error(errorMessage);

      // Show detailed errors if available in the error response
      if (errorData?.errors?.length > 0) {
        setAutoCompleteErrors(errorData);
        setErrorDetailsModalOpen(true);
      }

      setConfirmModalOpen(false);
    }
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <Loader className="animate-spin text-gray-400" size={20} />
              <span>Loading eligible orders...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    if (error) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to load eligible orders. Please try again later.";
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-red-500">
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertCircle size={24} />
              <p>{errorMessage}</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    if (paginatedOrders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
            {trimmedSearch
              ? "No orders match your search."
              : "No eligible orders found for auto-completion."}
          </TableCell>
        </TableRow>
      );
    }

    return paginatedOrders.map((order) => (
      <TableRow key={order.order_id}>
        <TableCell className="font-medium">
          <Link
            to={`/merchant/orders/view/${order.order_number}`}
            className="font-mono text-xs sm:text-sm text-brand-600 hover:underline"
          >
            {order.order_number}
          </Link>
        </TableCell>
        <TableCell>{formatDate(order.shipped_at)}</TableCell>
        <TableCell>{formatDate(order.auto_release_at)}</TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{order.member_name || "Guest"}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-semibold">{getOrderTotalDisplay(order)}</span>
        </TableCell>
        <TableCell>
          <div className="flex justify-end gap-2">
            <Link
              to={`/merchant/orders/view/${order.order_number}`}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-gray-200"
              title="View Details"
            >
              <Eye size={14} /> View
            </Link>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eligible Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Orders eligible for auto-completion (shipped &gt; 14 days ago)
          </p>
        </div>
        <PrimaryButton
          onClick={() => setConfirmModalOpen(true)}
          disabled={totalEligible === 0 || isLoading}
        >
          <CheckCircle2 size={18} />
          Auto Complete All ({totalEligible})
        </PrimaryButton>
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

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Shipped Date</TableHead>
                <TableHead>Auto Release Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auto-Complete Orders</DialogTitle>
            <DialogDescription>
              Are you sure you want to auto-complete {totalEligible} eligible
              orders? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm">
            <p>
              This will mark all eligible shipped orders as completed. Points
              will be released to the merchant account.
            </p>
          </div>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => setConfirmModalOpen(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              onClick={handleAutoComplete}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Processing...
                </>
              ) : (
                "Confirm Auto-Complete"
              )}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Details Modal */}
      <Dialog
        open={errorDetailsModalOpen}
        onOpenChange={setErrorDetailsModalOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle size={24} />
              Auto-Completion Errors
            </DialogTitle>
            <DialogDescription>
              {autoCompleteErrors?.failed || 0} order(s) could not be completed.
              {autoCompleteErrors?.success > 0 && (
                <span className="text-green-600 font-medium">
                  {" "}
                  {autoCompleteErrors.success} order(s) were successfully
                  completed.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {autoCompleteErrors?.errors &&
            autoCompleteErrors.errors.length > 0 ? (
              <div className="space-y-3">
                {autoCompleteErrors.errors.map((error, index) => (
                  <div
                    key={error.order_id || index}
                    className="border border-red-200 bg-red-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle
                            size={16}
                            className="text-red-600 flex-shrink-0"
                          />
                          <Link
                            to={`/merchant/orders/view/${error.order_number}`}
                            className="font-mono text-sm font-semibold text-brand-600 hover:underline"
                          >
                            {error.order_number}
                          </Link>
                        </div>
                        <p className="text-sm text-red-800">
                          {error.error || "Unknown error occurred"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No error details available.
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                setErrorDetailsModalOpen(false);
                setAutoCompleteErrors(null);
              }}
            >
              Close
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EligibleOrders;
