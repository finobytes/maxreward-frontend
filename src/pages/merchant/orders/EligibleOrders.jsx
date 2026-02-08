import React, { useMemo, useState } from "react";
import { Loader, Eye, CheckCircle2 } from "lucide-react";
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
import StatusBadge from "../../../components/table/StatusBadge";
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

  // Fetch eligible orders
  const { data, isLoading, isFetching, error } = useGetEligibleOrdersQuery();

  // Auto-complete mutation
  const [autoCompleteOrders, { isLoading: isCompleting }] =
    useAutoCompleteOrdersMutation();

  const trimmedSearch = search.trim();
  const allOrders = data?.data?.orders || [];
  const totalEligible = data?.data?.total_eligible || 0;

  // Client-side filtering and pagination since API returns all eligible orders
  const { paginatedOrders, totalPages } = useMemo(() => {
    // 1. Filter
    const filtered = filterOrders(allOrders, {
      search: trimmedSearch,
      dateFilter: "all",
      isFlatStructure: true, // New flag to handle flat order object
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
      const successCount = result?.data?.success || 0;
      toast.success(`Successfully auto-completed ${successCount} orders.`);
      setConfirmModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to auto-complete orders.");
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
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-red-500">
            Failed to load eligible orders.
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
    </div>
  );
};

export default EligibleOrders;
