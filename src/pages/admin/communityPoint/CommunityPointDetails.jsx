import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Lock, Unlock, ArrowLeft } from "lucide-react";
import { useGetMemberCommunityPointDetailsMutation } from "../../../redux/features/admin/communityPoint/communityPointAdminApi";

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

const CommunityPointDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [getMemberDetails, { data: memberDetails, isLoading, error }] =
    useGetMemberCommunityPointDetailsMutation();

  useEffect(() => {
    if (memberId) {
      getMemberDetails(memberId);
    }
  }, [memberId, getMemberDetails]);

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/admin" },
          { label: "Memberwise CP", to: "/admin/community-point" },
          { label: "Memberwise CP Details" },
        ]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          {/* <h2 className="text-xl font-semibold text-gray-900">
            Member Community Point Details
          </h2> */}
          <button
            onClick={() => navigate("/admin/community-point")}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {memberDetails?.data[0]?.member?.name ??
                memberDetails?.data[0]?.member?.name}
            </h3>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">Loading details...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">
            {error?.data?.message || "Failed to load member details."}
          </div>
        ) : memberDetails?.data && memberDetails.data.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
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
                {memberDetails.data.map((item, idx) => (
                  <TableRow key={item?.id || idx}>
                    <TableCell>{idx + 1}</TableCell>

                    {/* Member */}
                    {/* <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {item?.member?.name ?? "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item?.member?.user_name ?? ""}
                        </span>
                      </div>
                    </TableCell> */}

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
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            No data found for this member.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPointDetails;
