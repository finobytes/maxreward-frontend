import React, { useMemo, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Eye, PencilLine, Plus, Trash2Icon } from "lucide-react";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import { Link } from "react-router";
import Pagination from "../../../components/table/Pagination";
import BulkActionBar from "./components/BulkActionBar";

const dummyMerchants = Array.from({ length: 35 }).map((_, i) => ({
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

const ActiveMerchant = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Active Merchant" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                All Merchant List
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                {/* Search */}
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                />
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
            <div className="mt-4 relative overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm text-center text-gray-500 custom-scrollbar">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={
                          paginatedData.length > 0 &&
                          selected.length === paginatedData.length
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    <th className="py-3">Merchant ID</th>
                    <th className="py-3">Merchant Name</th>
                    <th className="py-3">Email Address</th>
                    <th className="py-3">Phone Number</th>
                    <th className="py-3">Gender</th>
                    <th className="py-3">Business Type</th>
                    <th className="py-3">Sales</th>
                    <th className="py-3">Redeemed</th>
                    <th className="py-3">Balance</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Date Created</th>
                    <th className="py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((merchant) => (
                    <tr
                      key={merchant.id}
                      className="bg-white border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(merchant.id)}
                          onChange={() => toggleSelect(merchant.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="py-4">{merchant.merchantId}</td>
                      <td className="py-4">
                        <div>
                          <p className="">{merchant.merchantName}</p>
                        </div>
                      </td>
                      <td className="py-4">{merchant.email}</td>
                      <td className="py-4">{merchant.phone}</td>
                      <td className="py-4">Gender</td>
                      <td className="py-4">{merchant.businessType}</td>
                      <td className="py-4">183,594</td>
                      <td className="py-4">231,234</td>
                      <td className="py-4">231,234</td>
                      <td className="py-4">
                        <StatusBadge status={merchant.status} />
                      </td>
                      <td className="py-4">{merchant.created}</td>
                      <td className="py-4 flex gap-2">
                        <Link
                          to=""
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500">
                          <PencilLine size={16} />
                        </button>
                        <button className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500">
                          <Trash2Icon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMerchant;
