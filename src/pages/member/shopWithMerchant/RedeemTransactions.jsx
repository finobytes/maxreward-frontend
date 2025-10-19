import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye } from "lucide-react";
import { Link } from "react-router";
import {
  setSearch,
  setStatus,
  setPage,
  resetFilters,
} from "../../../redux/features/admin/memberManagement/memberManagementSlice";
import { useMembers } from "../../../redux/features/admin/memberManagement/useMembers";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const RedeemTransactions = () => {
  const dispatch = useDispatch();
  const { search, status } = useSelector((s) => s.memberManagement);

  // local input for immediate typing (debounced into redux search)
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  useEffect(() => {
    // update redux search only when debounced value changes
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const { members, meta, isLoading, isError } = useMembers();

  console.log("Members:", members, "Meta:", meta);

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Shop With Merchant", to: "/member/shop-with-merchant" },
          { label: "Redeem Transactions" },
        ]}
      />

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">All Redeem History</h3>

          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name, phone, username..."
            />
            <DropdownSelect
              value={status}
              onChange={(val) => dispatch(setStatus(val))}
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
                { label: "Suspended", value: "suspended" },
              ]}
            />

            <PrimaryButton
              variant="secondary"
              onClick={() => dispatch(resetFilters())}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          {/* Overlay spinner on interactions */}
          {/* {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )} */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </TableHead>

                <TableHead>Redemption ID</TableHead>
                <TableHead>Merchant Name</TableHead>
                <TableHead>Merchant ID</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>RM Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Redemption Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton Loading */}
              {isLoading && !members?.length ? (
                [...Array(6)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-red-500">
                    Failed to load members.
                  </TableCell>
                </TableRow>
              ) : members?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500">
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((m) => (
                  <TableRow
                    key={m.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="p-4">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                    </TableCell>
                    <TableCell>{m?.user_name}</TableCell>
                    <TableCell className="py-3">
                      <div className="font-medium text-gray-900">{m?.name}</div>
                    </TableCell>

                    <TableCell>{m?.phone}</TableCell>
                    <TableCell>{m?.wallet?.total_referrals ?? "N/A"}</TableCell>
                    <TableCell>{m?.wallet?.total_referrals ?? "N/A"}</TableCell>
                    <TableCell>
                      <StatusBadge status={m?.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(m?.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          to="#"
                          className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (server) */}
        <div className="mt-4">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </div>
      </div>
    </div>
  );
};

export default RedeemTransactions;
