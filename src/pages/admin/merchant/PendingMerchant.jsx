import React, { useMemo, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Eye } from "lucide-react";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import BulkActionBar from "../memberMange/components/BulkActionBar";
import StatusBadge from "../../../components/table/StatusBadge";
import { Link } from "react-router";
import Pagination from "../../../components/table/Pagination";
import { kebabMenu } from "../../../assets/assets";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";

const dummyMerchants = Array.from({ length: 55 }).map((_, i) => ({
  id: i + 1,
  applicationId: `MAX-${1000 + i}`,
  merchantId: `MAX-${4325000 + i}`,
  merchantName: `Merchant ${i + 1}`,
  phone: `+60 12-345 ${6780 + i}`,
  email: `merchant${i + 1}@mail.com`,
  businessName: `Business ${i + 1}`,
  businessType: i % 2 === 0 ? "Retail" : "Service",
  submittedDocs: i % 3 === 0 ? "Submitted" : "Pending",
  applicationDate: `Oct ${Math.floor(Math.random() * 28) + 1}, 2024`,
  status: ["Active", "Blocked", "Suspended"][Math.floor(Math.random() * 3)],
  created: `Oct ${Math.floor(Math.random() * 28) + 1}, 2024`,
}));

const PendingMerchant = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [members, setMembers] = useState(dummyMerchants);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.merchantName.toLowerCase().includes(search.toLowerCase()) ||
        m.merchantId.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, members]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  // Bulk Actions
  const bulkUpdateStatus = (newStatus) => {
    setMembers((prev) =>
      prev.map((m) =>
        selected.includes(m.id) ? { ...m, status: newStatus } : m
      )
    );
    setSelected([]);
  };

  const bulkDelete = () => {
    setMembers((prev) => prev.filter((m) => !selected.includes(m.id)));
    setSelected([]);
  };

  function toggleDropdown(id) {
    setOpenDropdownId(openDropdownId === id ? null : id);
  }

  function closeDropdown() {
    setOpenDropdownId(null);
  }
  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Pending Merchant" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                All Merchant Pending List
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                />

                <div className="flex justify-between items-center gap-4 md:px-2">
                  {/* Sort Dropdown */}
                  <DropdownSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { label: "Short By", value: "All" },
                      { label: "Active", value: "Active" },
                      { label: "Blocked", value: "Blocked" },
                      { label: "Suspended", value: "Suspended" },
                    ]}
                  />
                  <PrimaryButton variant="secondary" size="md">
                    Clear
                  </PrimaryButton>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <BulkActionBar
                selectedCount={selected.length}
                onSetActive={() => bulkUpdateStatus("Active")}
                onSetBlocked={() => bulkUpdateStatus("Blocked")}
                onSetSuspended={() => bulkUpdateStatus("Suspended")}
                onDelete={bulkDelete}
              />
            )}

            {/* Table */}
            <div className="mt-4 relative overflow-x-auto"></div>
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingMerchant;
