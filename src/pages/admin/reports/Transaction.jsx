import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import SearchInput from "@/components/form/form-elements/SearchInput";
import Pagination from "@/components/table/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";
import { useGetAllTransactionsQuery } from "../../../redux/features/admin/reports/transaction/transactionApi";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";

// 🔁 debounce hook
const useDebounced = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const Transaction = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search, 500);

  const { data, isLoading, isFetching, isError } = useGetAllTransactionsQuery({
    page,
    search: debouncedSearch,
  });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || {};
  const stats = data?.statistics || {};

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(transactions?.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  // Bulk actions (placeholder)
  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Transactions" }]}
      />

      <div className="rounded-xl border bg-white p-4 relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        {/* 🔍 Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
          />
        </div>

        {/* 📊 Stats Summary */}
        {/* {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-700">
            <div className="p-3 rounded-lg border bg-gray-50">
              <p className="font-semibold">Total Transactions</p>
              <p>{stats.total_transactions}</p>
            </div>
            <div className="p-3 rounded-lg border bg-gray-50">
              <p className="font-semibold">Total Credited</p>
              <p>{stats.total_credited}</p>
            </div>
            <div className="p-3 rounded-lg border bg-gray-50">
              <p className="font-semibold">Total Debited</p>
              <p>{stats.total_debited}</p>
            </div>
            <div className="p-3 rounded-lg border bg-gray-50">
              <p className="font-semibold">Personal Points</p>
              <p>{stats.pp_total}</p>
            </div>
          </div>
        )} */}
        {/* Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Export",
                variant: "success",
                icon: "export",
                onClick: () => bulkUpdateStatus("delete"),
              },
            ]}
          />
        )}
        {/* 🧾 Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load transactions.
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        transactions?.length > 0 &&
                        selected.length === transactions?.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Points Type</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(tx.id)}
                        onChange={() => toggleSelect(tx.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>
                      {tx.member ? (
                        <div>
                          <p className="font-medium">{tx.member.name}</p>
                          <p className="text-xs text-gray-500">
                            {tx.member.phone}
                          </p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{tx.transaction_type?.toUpperCase()}</TableCell>
                    <TableCell
                      className={`capitalize ${
                        tx.points_type === "credited"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.points_type}
                    </TableCell>
                    <TableCell>{tx.transaction_points}</TableCell>
                    <TableCell>{tx.transaction_reason}</TableCell>
                    <TableCell>
                      {new Date(tx.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* 🔢 Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default Transaction;
