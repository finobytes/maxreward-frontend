import React, { useMemo, useState } from "react";
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
import { DateRangePicker } from "../../../components/shared/DateRangePicker";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import { useGetReferredMembersQuery } from "../../../redux/features/member/referNewMember/referNewMemberApi";

const ReferredMemberList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useGetReferredMembersQuery();

  const members = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data.map((item) => {
      const m = item.child_member;
      return {
        id: m.id,
        fullName: m.name,
        memberId: `MAX-${4000000 + m.id}`,
        phone: m.phone,
        created: new Date(m.created_at).toLocaleDateString("en-GB"),
        status: m.status === "active" ? "Active" : "Inactive",
        availablePoints: m.wallet?.available_points || 0,
        lifetimePurchases: m.wallet?.total_pp || 0,
      };
    });
  }, [data]);

  const filteredData = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.memberId.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : m.status === statusFilter;
      const memberDate = new Date(m.created);
      const matchesDate =
        (!dateRange.from && !dateRange.to) ||
        (dateRange.from && !dateRange.to && memberDate >= dateRange.from) ||
        (dateRange.to && !dateRange.from && memberDate <= dateRange.to) ||
        (dateRange.from &&
          dateRange.to &&
          memberDate >= dateRange.from &&
          memberDate <= dateRange.to);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, members, dateRange]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(paginatedData.map((m) => m.id));
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
    console.log("Bulk update status to:", newStatus);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error fetching data</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Referred Member List" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <div className="flex gap-3 items-center">
            {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}
            <DropdownSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "All", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
            <PrimaryButton
              variant="secondary"
              size="md"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      selected.length === paginatedData.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Purchases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(member.id)}
                      onChange={() => toggleSelect(member.id)}
                      className="w-4 h-4 rounded"
                    />
                  </TableCell>
                  <TableCell>{member.memberId}</TableCell>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.created}</TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {member.availablePoints}
                  </TableCell>
                  <TableCell className="text-center">
                    {member.lifetimePurchases}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferredMemberList;
