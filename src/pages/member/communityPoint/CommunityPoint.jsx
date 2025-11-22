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
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { useCommunityPointMember } from "../../../redux/features/member/communityPoint/useCommunityPointMember";
import { Lock, Unlock } from "lucide-react";

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
const renderCpBadge = (amount, type) => {
  const colors = {
    total: "bg-blue-100 text-blue-600",
    available: "bg-green-100 text-green-600",
    onhold: "bg-yellow-100 text-yellow-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        colors[type] || "bg-gray-100 text-gray-600"
      }`}
    >
      {amount}
    </span>
  );
};

// Lock Status Badge
const renderLockStatusBadge = (isLocked) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
        isLocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
      }`}
    >
      {isLocked ? (
        <>
          <Lock size={14} /> Locked
        </>
      ) : (
        <>
          <Unlock size={14} /> Unlocked
        </>
      )}
    </span>
  );
};

const CommunityPoint = () => {
  const { data: memberProfile, isLoading: memberLoading } = useVerifyMeQuery();
  const memberId = pickMemberId(memberProfile);

  const { communityPoints, meta, isLoading, error } = useCommunityPointMember(memberId);

  console.log("communityPoints:::-------", communityPoints);

  const loading = isLoading || memberLoading;


  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "My Community Point" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {loading && (
            <span className="text-sm text-gray-500">Loading...</span>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Member</TableHead> */}
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">Total CP</TableHead>
                <TableHead className="text-center">Available CP</TableHead>
                <TableHead className="text-center">On-Hold CP</TableHead>
                <TableHead className="text-center">Lock Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="6" className="py-6 text-center">
                    Loading community points...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="py-6 text-center text-red-500"
                  >
                    {error?.data?.message || "Failed to load community points."}
                  </TableCell>
                </TableRow>
              ) : communityPoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="py-6 text-center">
                    No community points found.
                  </TableCell>
                </TableRow>
              ) : (
                communityPoints.map((item) => (
                  <TableRow key={item?.id}>
                    {/* Level */}
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                        {item?.level ?? "-"}
                      </span>
                    </TableCell>

                    {/* Total CP */}
                    <TableCell className="text-center">
                      {renderCpBadge(item?.total_cp, "total")}
                    </TableCell>

                    {/* Available CP */}
                    <TableCell className="text-center">
                      {renderCpBadge(item?.available_cp, "available")}
                    </TableCell>

                    {/* On-Hold CP */}
                    <TableCell className="text-center">
                      {renderCpBadge(item?.onhold_cp, "onhold")}
                    </TableCell>

                    {/* Lock Status */}
                    <TableCell className="text-center">
                      {renderLockStatusBadge(item?.is_locked)}
                    </TableCell>

                    {/* Created At */}
                    <TableCell>{formatDateTime(item?.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CommunityPoint;
