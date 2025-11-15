import React from "react";
import { useGetUpLineMemberQuery } from "../../../../redux/features/admin/memberManagement/memberManagementApi";

const CommunityUplink = ({ member }) => {
  const { data, isLoading, isError } = useGetUpLineMemberQuery(member?.id, {
    skip: !member?.id,
  });

  if (isLoading) return <div className="p-4 text-sm">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500 text-sm">Failed to load data</div>;

  const uplines = data?.data?.upline_members || [];

  return (
    <div className="p-4 bg-white shadow rounded-xl border">
      <h2 className="text-lg font-semibold mb-4">Upline Members</h2>

      {uplines.length === 0 ? (
        <p className="text-sm text-gray-500">No uplink members found.</p>
      ) : (
        <div className="space-y-3">
          {uplines.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div>
                <p className="font-medium">{item?.member?.name || "Unknown"}</p>
                {/* <p className="text-xs text-gray-500">
                  User ID: {item?.member?.user_name}
                </p> */}

                {item?.member?.phone && (
                  <p className="text-xs text-gray-500">
                    Phone: {item.member.phone}
                  </p>
                )}

                {/* {item?.member?.email && (
                  <p className="text-xs text-gray-500">
                    Email: {item.member.email}
                  </p>
                )} */}

                <p className="text-xs text-gray-400 italic">
                  {item?.distance_from_target}
                </p>
              </div>

              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                Level {item?.level}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityUplink;
