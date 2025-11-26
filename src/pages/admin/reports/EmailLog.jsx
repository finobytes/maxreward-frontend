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
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { useGetAllEmailLogsQuery } from "../../../redux/features/admin/reports/EmailLog/emailLogApi";

const useDebounced = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const EmailLog = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search, 500);

  const { data, isLoading, isFetching, isError } = useGetAllEmailLogsQuery({
    page,
    search: debouncedSearch,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || {};

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(logs.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // S/N logic ✔✔
  const currentPage = pagination?.currentPage ?? 1;
  const perPage = pagination?.perPage ?? 15;

  const serialNumber = (idx) => (currentPage - 1) * perPage + (idx + 1);

  const bulkAction = (action) => {
    toast.warning(`Bulk ${action} not implemented yet`);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Email Logs" }]}
      />

      <div className="rounded-xl border bg-white p-4 relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email logs..."
          />
        </div>

        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Export",
                variant: "success",
                icon: "download",
                onClick: () => bulkAction("export"),
              },
            ]}
          />
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading email logs...
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load email logs.
            </div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No email logs found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        logs.length > 0 && selected.length === logs.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>SL</TableHead>
                  <TableHead>Message Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.map((log, idx) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(log.id)}
                        // onChange={() => toggleSelect(log.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>

                    {/* S/N Column ✔✔ */}
                    <TableCell>{serialNumber(idx)}</TableCell>
                    <TableCell>{log.message_type}</TableCell>
                    <TableCell
                      className={`capitalize ${
                        log.status === "sent"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {log.status}
                    </TableCell>

                    <TableCell>
                      {log.sent_by_member ? (
                        <div className="space-y-2">
                          <p className="font-medium">
                            {log.sent_by_member.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.sent_by_member.email || log.sent_by_member.phone}
                          </p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {log.member ? (
                        <div className="space-y-2">
                          <p className="font-medium">{log.member.name}</p>
                          <p className="text-xs text-gray-500">
                            {log.member.email || log.member.phone}
                          </p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {log.sent_at
                        ? new Date(log.sent_at).toLocaleString("en-GB")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

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

export default EmailLog;
