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
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { useCpUnlockHistoryMember } from "../../../redux/features/member/cpUnlockHistory/useCpUnlockHistoryMember";
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

// CP Amount Badge
const renderCpAmountBadge = (amount) => {
  return (
    <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-600">
      +{amount}
    </span>
  );
};

const CpUnlockHistory = () => {
  const { data: memberProfile, isLoading: memberLoading } = useVerifyMeQuery();
  const memberId = pickMemberId(memberProfile);

  console.log("memberId", memberId);

  const { unlockHistories, meta, isLoading, isFetching, error, changePage } =
    useCpUnlockHistoryMember(memberId);

  const loading = isLoading || memberLoading;
  const currentPage = meta?.currentPage || 1;
  const totalPages = meta?.lastPage || 1;

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "CP Unlock History" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                <TableHead className="text-center">Previous Referrals</TableHead>
                <TableHead className="text-center">New Referrals</TableHead>
                <TableHead className="text-center">Previous Level</TableHead>
                <TableHead className="text-center">New Level</TableHead>
                <TableHead className="text-center">Released CP Amount</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="8" className="py-6 text-center">
                    Loading unlock history...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan="8"
                    className="py-6 text-center text-red-500"
                  >
                    {error?.data?.message || "Failed to load unlock history."}
                  </TableCell>
                </TableRow>
              ) : unlockHistories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="8" className="py-6 text-center">
                    No unlock history found.
                  </TableCell>
                </TableRow>
              ) : (
                unlockHistories.map((item, idx) => {
                  return (
                    <TableRow key={item?.id}>
                      <TableCell>
                        {(currentPage - 1) * meta?.perPage + idx + 1}
                      </TableCell>

                      {/* Date/Time */}
                      <TableCell>{formatDateTime(item?.created_at)}</TableCell>

                      {/* Previous Referrals */}
                      <TableCell className="text-center font-medium">
                        {item?.previous_referrals ?? "-"}
                      </TableCell>

                      {/* New Referrals */}
                      <TableCell className="text-center font-medium">
                        {item?.new_referrals ?? "-"}
                      </TableCell>

                      {/* Previous Level */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-semibold">
                          {item?.previous_unlocked_level ?? "-"}
                        </span>
                      </TableCell>

                      {/* New Level */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                          {item?.new_unlocked_level ?? "-"}
                        </span>
                      </TableCell>

                      {/* Released CP Amount */}
                      <TableCell className="text-center">
                        {renderCpAmountBadge(item?.released_cp_amount)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Link
                          to={`/member/cp-unlock-history/${item?.id}`}
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500 inline-block transition-colors"
                          title="View unlock history details"
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

export default CpUnlockHistory;
