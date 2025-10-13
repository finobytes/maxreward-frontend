// src/pages/admin/memberMange/MemberManage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  PencilLine,
  Trash2Icon,
  Plus,
  ChevronUp,
  ChevronDown,
  Loader,
} from "lucide-react";
import { Link } from "react-router";
import {
  setSearch,
  setStatus,
  setPage,
  setPerPage,
  setSort,
  resetFilters,
} from "../../../redux/features/admin/memberManagement/memberManagementSlice";
import { useMembers } from "../../../redux/features/admin/memberManagement/useMembers";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { userImage } from "../../../assets/assets";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const SortIcon = ({ active, order }) => {
  if (!active) return <span className="opacity-30">↕</span>;
  return order === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
};

const MemberManage = () => {
  const dispatch = useDispatch();
  const { search, status, page, perPage, sortBy, sortOrder } = useSelector(
    (s) => s.memberManagement
  );

  // local input for immediate typing (debounced into redux search)
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  useEffect(() => {
    // update redux search only when debounced value changes
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const { members, meta, isLoading, isError } = useMembers();

  // sync page change events coming from Pagination component
  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const handleSort = (column) => {
    // toggle sort order when clicking same column
    if (sortBy === column) {
      dispatch(
        setSort({
          sortBy: column,
          sortOrder: sortOrder === "asc" ? "desc" : "asc",
        })
      );
    } else {
      dispatch(setSort({ sortBy: column, sortOrder: "desc" }));
    }
  };

  console.log("Members:", members, "Meta:", meta);

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Member Management" }]}
      />

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">All Members</h3>

          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name, phone, username..."
            />
            <PrimaryButton to="/admin/member-registration" variant="primary">
              <Plus size={16} /> Register Member
            </PrimaryButton>
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

            <DropdownSelect
              value={perPage}
              onChange={(val) => handlePerPageChange(Number(val))}
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
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
        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          {/* Overlay spinner on interactions */}
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th
                  className="py-3 px-4 cursor-pointer select-none"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Full Name{" "}
                    <SortIcon active={sortBy === "name"} order={sortOrder} />
                  </div>
                </th>
                <th className="py-3 px-4">Member ID</th>
                <th
                  className="py-3 px-4 cursor-pointer select-none"
                  onClick={() => handleSort("phone")}
                >
                  <div className="flex items-center gap-1">
                    Phone{" "}
                    <SortIcon active={sortBy === "phone"} order={sortOrder} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer select-none"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Created{" "}
                    <SortIcon
                      active={sortBy === "created_at"}
                      order={sortOrder}
                    />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && !members.length ? (
                // Initial load skeleton shimmer rows
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="bg-white border-b">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500">
                    Failed to load members
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img
                        src={userImage}
                        alt="user"
                        className="w-10 h-10 rounded-full border"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {m.name || m.fullName || m.user_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {m.member_type}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{m.user_name}</td>
                    <td className="py-4 px-4">{m.phone}</td>
                    <td className="py-4 px-4">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <Link
                        to={`/admin/member-manage/${m.id}`}
                        className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                      >
                        <Eye size={16} />
                      </Link>
                      <button className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <PencilLine size={16} />
                      </button>
                      <button className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                        <Trash2Icon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default MemberManage;
