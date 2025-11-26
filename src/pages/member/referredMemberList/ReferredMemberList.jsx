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
import { useGetSponsoredMembersQuery } from "../../../redux/features/member/referNewMember/referNewMemberApi";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { Link } from "react-router";
import { Eye } from "lucide-react";

const ReferredMemberList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch data from backend with pagination params
  const { data, isLoading, isError } = useGetSponsoredMembersQuery({
    page: currentPage,
    search: search,
    status: statusFilter === "All" ? "" : statusFilter,
  });

  const members = data?.data?.sponsored?.data || [];
  const pagination = data?.data?.sponsored;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error fetching data</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Referred Member List" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        {/* 🔍 Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
          />
        </div>

        {/* 📋 Table */}
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-center">No of Referral</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.length > 0 ? (
                members.map((member, idx) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {(pagination?.current_page - 1) *
                        (pagination?.per_page || 0) +
                        idx +
                        1}
                    </TableCell>

                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell className="text-center">
                      {member.wallet?.total_referrals ?? "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" className="text-center py-6">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* 🧭 Pagination */}
          <Pagination
            currentPage={pagination?.current_page || 1}
            totalPages={pagination?.last_page || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferredMemberList;
