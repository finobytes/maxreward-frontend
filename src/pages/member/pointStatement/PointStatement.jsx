import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import Pagination from "../../../components/table/Pagination";
import TableRowsSkeleton from "../../../components/skeleton/TableRowsSkeleton";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { usePointStatementMember } from "../../../redux/features/member/pointStatement/usePointStatementMember";
import { Eye } from "lucide-react";
import { Link } from "react-router";

// Pick Member ID
const pickMemberId = (profile) =>
  profile?.member_id ||
  profile?.memberId ||
  profile?.member?.id ||
  profile?.data?.member_id ||
  profile?.data?.member?.id ||
  profile?.data?.id ||
  profile?.id ||
  null;

// Format Date + Time
const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Transaction Type Full Form
const typeMapping = {
  pp: "Personal Points",
  rp: "Referral Points",
  cp: "Community Points",
  cr: "Company Reserve",
  dp: "Deducted Points",
  ap: "Added Points",
  vrp: "Voucher Referral Points",
  vap: "Voucher Available Points",
};

// Total Points Badge
const renderPointsBadge = (value, isDebit) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
      isDebit ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
    }`}
  >
    {isDebit ? `-${value}` : `+${value}`}
  </span>
);

// Status Badge
const renderStatusBadge = (status) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
      status === "debited"
        ? "bg-red-100 text-red-600"
        : "bg-green-100 text-green-600"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const PointStatement = () => {
  const { data: memberProfile, isLoading: memberLoading } = useVerifyMeQuery();
  const memberId = pickMemberId(memberProfile);

  console.log("memberProfile", memberProfile);

  const { transactions, meta, isLoading, isFetching, error, changePage } =
    usePointStatementMember(memberId);

  const loading = isLoading || memberLoading;
  const currentPage = meta?.currentPage || 1;
  const totalPages = meta?.lastPage || 1;

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Point Statement" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
           Transaction History
          </h1>
          {isFetching && (
            <span className="text-sm text-gray-500">Refreshing...</span>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Point Type</TableHead>
                {/* <TableHead>Name</TableHead> */}
                <TableHead className="text-center">Total Points</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-center">BAP</TableHead>
                <TableHead className="text-center">BRP</TableHead>
                <TableHead className="text-center">BOP</TableHead>

                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRowsSkeleton cols={10} />
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan="8"
                    className="py-6 text-center text-red-500"
                  >
                    {error?.data?.message || "Failed to load transactions."}
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="8" className="py-6 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((item, idx) => {
                  const isDebit = item?.points_type === "debited";

                  return (
                    <TableRow key={item?.id}>
                      <TableCell>
                        {(currentPage - 1) * meta?.perPage + idx + 1}
                      </TableCell>

                      {/* Date/Time */}
                      <TableCell>{formatDateTime(item?.created_at)}</TableCell>
                      {/* Full Point Type */}
                      <TableCell>
                        {typeMapping[item?.transaction_type] ?? "-"}
                      </TableCell>

                      {/* Member Name */}
                      {/* <TableCell>{item?.member?.name ?? "-"}</TableCell> */}

                      {/* Total Points */}
                      <TableCell className="text-center">
                        {renderPointsBadge(item?.transaction_points, isDebit)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        {renderStatusBadge(item?.points_type)}
                      </TableCell>

                      {/* Reason */}
                      <TableCell>{item?.transaction_reason ?? "-"}</TableCell>

                      {/*  Balance Available point*/}
                      <TableCell className="text-center">
                        {item?.bap ?? ""}
                      </TableCell>
                      {/*  Balance onhold point*/}
                      <TableCell className="text-center">
                        {item?.brp ?? ""}
                      </TableCell>
                      {/*  Balance referral point*/}
                      <TableCell className="text-center">
                        {item?.bop ?? ""}
                      </TableCell>

                      <TableCell className="text-center">
                        <Link
                          to={`/member/point-statement/${item?.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500 inline-block transition-colors"
                          title="View transaction details"
                        >
                          <Eye size={18} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
};

export default PointStatement;
