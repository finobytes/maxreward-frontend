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
import { Link } from "react-router";
import { Eye } from "lucide-react";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { useGetPointStatementQuery } from "../../../redux/features/member/pointStatement/pointStatementMemberApi";


const PointStatement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);


  const {data: memberData} = useVerifyMeQuery();

  // const memberId = memberData?.id
  const memberId = 1


  console.log("memberId", memberId);

  // ✅ Fetch data from backend with pagination params
  const { data, isLoading, isError } = useGetPointStatementQuery(memberId);



  const pointStatementData = data?.data?.data || [];
  // const pagination = data?.data?.sponsored;
  const pagination = [];


    console.log("dataa:::", data);

    const members = [];

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(pointStatementData.map((m) => m.id));
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

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p className="text-red-500">Error fetching data</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Point Statement" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        {/* 🔍 Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
         <div>
          <h1 className="text-xl font-semibold text-gray-900">My Points Transaction History</h1>
         </div>

          <div className="flex gap-3 items-center">

            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
            />

            <DropdownSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Status", value: "Status" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
              ]}
            />

            <DropdownSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Txn Type", value: "tnx_type" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
              ]}
            />


            <DropdownSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "User Type", value: "user_type" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
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

        {/* ⚙️ Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Active",
                variant: "success",
                onClick: () => bulkUpdateStatus("active"),
              },
              {
                label: "Inactive",
                variant: "warning",
                onClick: () => bulkUpdateStatus("inactive"),
              },
              {
                label: "Suspend",
                variant: "danger",
                onClick: () => bulkUpdateStatus("suspend"),
              },
            ]}
          />
        )}

        {/* 📋 Table */}
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={
                      pointStatementData.length > 0 && selected.length === pointStatementData.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Point Type</TableHead>
                <TableHead className="text-center">Balance</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pointStatementData.length > 0 ? (
                pointStatementData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        // checked={selected.includes(member.id)}
                        // onChange={() => toggleSelect(member.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item?.transaction_type}</TableCell>
                    <TableCell>
                      {/* {member?.member_type} */} Member
                    </TableCell>
                    <TableCell>{item?.member?.name}</TableCell>
                    <TableCell className="text-center">
                       {
                        item?.points_type == "debited" ? (
                          <div className="bg-red-100 rounded-2xl">
                            {item?.transaction_points }
                          </div>
                        ) : (
                          <div className="bg-green-100 rounded-2xl">
                            {item?.transaction_points }
                          </div>
                        )
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>


                    <TableCell className="text-center">
                      {
                        item?.points_type == "debited" ? (
                          <div className="bg-red-100 rounded-2xl">
                            {item?.points_type }
                          </div>
                        ) : (
                          <div className="bg-green-100 rounded-2xl">
                            {item?.points_type }
                          </div>
                        )
                      }
                    </TableCell>

                    <TableCell className="text-center">
                      {item?.member?.wallet?.available_points}
                    </TableCell>

                    
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        <Link
                          to="#"
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
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

export default PointStatement;
