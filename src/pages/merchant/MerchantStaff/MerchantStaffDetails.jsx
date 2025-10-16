import React from "react";
import { useParams } from "react-router";
import { useGetStaffByIdQuery } from "../../../redux/features/merchant/merchantStaff/merchantStaffApi";
import { Skeleton } from "@/components/ui/skeleton";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import StatusBadge from "../../../components/table/StatusBadge";
import { profileCover, userProfile } from "../../../assets/assets";

const MerchantStaffDetails = () => {
  const { id } = useParams();
  const {
    data: staffData,
    isLoading,
    isError,
  } = useGetStaffByIdQuery(id, {
    skip: !id,
  });

  const staff = staffData?.data || staffData;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Staff", to: "/merchant/merchant-staff" },
          { label: "Staff Details" },
        ]}
      />

      {/* Card */}
      <div className="max-w-[600px] h-auto rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-md" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-6">
            Failed to load staff details.
          </div>
        ) : !staff ? (
          <div className="text-center text-gray-500 py-6">No staff found.</div>
        ) : (
          <div className="max-w-[600px] h-auto">
            <div className="relative w-full">
              {/* Cover */}
              <img
                src={profileCover}
                alt="Profile Cover"
                className="w-full h-40 object-cover"
              />
              {/* Profile */}
              <img
                src={userProfile}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white absolute left-6 -bottom-12 shadow-lg"
              />
            </div>
            <div className="p-6 mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {staff.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Staff ID: {staff.id}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{staff.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{staff.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{staff.gender_type}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={staff.status} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {new Date(staff.created_at).toLocaleString()}
                  </p>
                </div>

                {staff.address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{staff.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantStaffDetails;
