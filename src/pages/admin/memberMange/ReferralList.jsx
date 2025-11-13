import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { Link, useParams } from "react-router";
import { Eye } from "lucide-react";
import { useGetReferralMemberListQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const ReferralList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const params = useParams();
  const memberId = params.id;

  // FIXED API CALL
  const { data, isLoading, isError } = useGetReferralMemberListQuery({
    memberId,
    page: currentPage,
    search,
    status: statusFilter === "All" ? "" : statusFilter,
  });

  const members = data?.members || [];
  const pagination = data?.meta || {};

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(members.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  const handleSearchClear = () => {
    setSearch("");
    setStatusFilter("All");
    setSelected([]);
    setCurrentPage(1);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error fetching data</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Member Management", to: "/admin/member-manage" },
          { label: "Referred Member List" },
        ]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
          />

          <div className="flex gap-3 items-center">
            <DropdownSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspend", value: "suspend" },
              ]}
            />

            <PrimaryButton
              variant="secondary"
              size="md"
              onClick={handleSearchClear}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Export",
                icon: "export",
                variant: "success",
                onClick: () => bulkUpdateStatus("active"),
              },
            ]}
          />
        )}

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={
                      members.length > 0 && selected.length === members.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Available Points</TableHead>
                <TableHead className="text-center">
                  LifeTime Purchases
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(member.id)}
                        onChange={() => toggleSelect(member.id)}
                      />
                    </TableCell>

                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.email}</TableCell>

                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>

                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-center">
                      {member.wallet?.available_points ?? "N/A"}
                    </TableCell>

                    <TableCell className="text-center">
                      {member.wallet?.total_pp ?? "N/A"}
                    </TableCell>

                    <TableCell className="text-center">
                      <Link className="p-2 bg-indigo-100 rounded-md inline-block">
                        <Eye size={18} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Fix */}
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralList;
