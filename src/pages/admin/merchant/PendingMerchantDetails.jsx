import React from "react";
import {
  useGetMerchantByIdQuery,
  useUpdateMerchantMutation,
} from "@/redux/features/admin/merchantManagement/merchantManagementApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

const PendingMerchantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load existing merchant data by ID
  const {
    data: merchantResponse,
    isFetching,
    isError,
  } = useGetMerchantByIdQuery(id, {
    skip: !id,
  });

  const [updateMerchant, { isLoading }] = useUpdateMerchantMutation();

  // Extract merchant data from API response
  const merchant = merchantResponse?.data?.merchant;
  const staffs = merchantResponse?.data?.staffs?.data || [];

  const handleApprove = async () => {
    try {
      await updateMerchant({
        id,
        body: { status: "approved" },
      }).unwrap();

      toast.success("Merchant approved successfully!");
      navigate("/admin/merchant/pending-merchant");
    } catch (err) {
      console.error("Approve Error:", err);
      toast.error(err?.data?.message || "Failed to approve merchant!");
    }
  };

  const handleReject = async () => {
    try {
      await updateMerchant({
        id,
        body: { status: "rejected" },
      }).unwrap();

      toast.success("Merchant rejected successfully!");
      navigate("/admin/merchant/pending-merchant");
    } catch (err) {
      console.error("Reject Error:", err);
      toast.error(err?.data?.message || "Failed to reject merchant!");
    }
  };

  if (isFetching)
    return (
      <div className="p-6 space-y-4">
        {/* Skeleton for breadcrumb */}
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>

        {/* Skeleton for cards */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded shadow">
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div
                    key={j}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return <p className="p-6 text-red-500">Failed to load merchant data.</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Pending Merchant", to: "/admin/merchant/pending-merchant" },
          { label: "Merchant Details" },
        ]}
      />

      {/* Business Information */}
      <ComponentCard title="Business Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div>
              <Label>Unique Number</Label>
              <Input
                value={merchant?.unique_number || "N/A"}
                placeholder="Unique Number"
                readOnly
              />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input
                value={merchant?.business_name || "N/A"}
                placeholder="Business name"
                readOnly
              />
            </div>
            <div>
              <Label>Company Address</Label>
              <Input
                value={merchant?.company_address || merchant?.address || "N/A"}
                placeholder="Company Address"
                readOnly
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={merchant?.state || "N/A"}
                placeholder="State"
                readOnly
              />
            </div>
            <div>
              <Label>Town</Label>
              <Input
                value={merchant?.town || "N/A"}
                placeholder="Town"
                readOnly
              />
            </div>
            {/* <div>
              <Label>Country</Label>
              <Input
                value={merchant?.country || "N/A"}
                placeholder="Country"
                readOnly
              />
            </div> */}
            <div>
              <Label>Product / Service</Label>
              <Input
                value={merchant?.business_type?.name || "N/A"}
                placeholder="Business Type"
                readOnly
              />
            </div>
            {/* <div>
              <Label>Business Description</Label>
              <Input
                value={merchant?.business_description || "N/A"}
                placeholder="Business Description"
                readOnly
              />
            </div> */}
            <div>
              <Label>Annual Sales Turnover</Label>
              <Input
                value={merchant?.annual_sales_turnover || "N/A"}
                placeholder="Annual Sales Turnover"
                readOnly
              />
            </div>
            <div>
              <Label>Reward Budget (%)</Label>
              <Input
                value={merchant?.reward_budget || "N/A"}
                placeholder="Reward Budget"
                readOnly
              />
            </div>
            <div>
              <Label>Status</Label>
              <Input
                value={merchant?.status || "N/A"}
                placeholder="Status"
                readOnly
                className={`${
                  merchant?.status === "pending"
                    ? "text-yellow-600"
                    : merchant?.status === "approved"
                      ? "text-green-600"
                      : merchant?.status === "rejected"
                        ? "text-red-600"
                        : ""
                }`}
              />
            </div>
            <div>
              <Label>Merchant Created By</Label>
              <Input
                value={merchant?.merchant_created_by || "N/A"}
                placeholder="Created By"
                readOnly
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <Label>Company Logo</Label>
            {merchant?.business_logo ? (
              <div className="border rounded-lg p-2 h-48 flex items-center justify-center bg-gray-50">
                <img
                  src={merchant.business_logo}
                  alt="Business Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="border rounded-lg p-2 h-48 flex items-center justify-center bg-gray-50 text-gray-400">
                No logo uploaded
              </div>
            )}
          </div>
        </div>
      </ComponentCard>

      {/* Authorized Person Information */}
      <div className="mt-6">
        <ComponentCard title="Authorized Person Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Authorized Person Name</Label>
              <Input
                value={merchant?.authorized_person_name || "N/A"}
                placeholder="Name"
                readOnly
              />
            </div>
            <div>
              <Label>Designation</Label>
              <Input
                value={merchant?.designation || "N/A"}
                placeholder="Designation"
                readOnly
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={
                  merchant?.phone
                    ? `+${merchant.country_code} ${merchant.phone}`
                    : "N/A"
                }
                placeholder="Phone"
                readOnly
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                value={merchant?.email || "N/A"}
                placeholder="Email"
                readOnly
              />
            </div>
            {/* <div>
              <Label>Gender</Label>
              <Input
                value={merchant?.gender || "N/A"}
                placeholder="Gender"
                readOnly
              />
            </div> */}
            {/* <div>
              <Label>Owner Name</Label>
              <Input
                value={merchant?.owner_name || "N/A"}
                placeholder="Owner Name"
                readOnly
              />
            </div> */}
          </div>
        </ComponentCard>
      </div>

      {/* Payment Information */}
      {/* <div className="mt-6">
        <ComponentCard title="Payment Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Preferred Payment Method</Label>
              <Input
                value={merchant?.preferred_payment_method || "N/A"}
                placeholder="Payment Method"
                readOnly
              />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input
                value={merchant?.bank_name || "N/A"}
                placeholder="Bank Name"
                readOnly
              />
            </div>
            <div>
              <Label>Account Holder Name</Label>
              <Input
                value={merchant?.account_holder_name || "N/A"}
                placeholder="Account Holder"
                readOnly
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                value={merchant?.account_number || "N/A"}
                placeholder="Account Number"
                readOnly
              />
            </div>
            <div>
              <Label>Routing Number</Label>
              <Input
                value={merchant?.routing_number || "N/A"}
                placeholder="Routing Number"
                readOnly
              />
            </div>
            <div>
              <Label>SWIFT Code</Label>
              <Input
                value={merchant?.swift_code || "N/A"}
                placeholder="SWIFT Code"
                readOnly
              />
            </div>
          </div>
        </ComponentCard>
      </div> */}

      {/* Wallet Information */}
      {/* <div className="mt-6">
        <ComponentCard title="Wallet Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Total Points</Label>
              <Input
                value={merchant?.wallet?.total_points || "0"}
                placeholder="Total Points"
                readOnly
              />
            </div>
            <div>
              <Label>Community Members</Label>
              <Input
                value={merchant?.community_members || "0"}
                placeholder="Community Members"
                readOnly
              />
            </div>
          </div>
        </ComponentCard>
      </div> */}

      {/* Corporate Member Information */}
      {merchant?.corporate_member && (
        <div className="mt-6">
          <ComponentCard title="Corporate Member Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Username</Label>
                <Input
                  value={merchant.corporate_member.user_name || "N/A"}
                  placeholder="Username"
                  readOnly
                />
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={merchant.corporate_member.name || "N/A"}
                  placeholder="Name"
                  readOnly
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={merchant.corporate_member.phone || "N/A"}
                  placeholder="Phone"
                  readOnly
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={merchant.corporate_member.email || "N/A"}
                  placeholder="Email"
                  readOnly
                />
              </div>
              <div>
                <Label>Member Type</Label>
                <Input
                  value={merchant.corporate_member.member_type || "N/A"}
                  placeholder="Member Type"
                  readOnly
                />
              </div>
              <div>
                <Label>Status</Label>
                <Input
                  value={merchant.corporate_member.status || "N/A"}
                  placeholder="Status"
                  readOnly
                />
              </div>
              <div>
                <Label>Referral Code</Label>
                <Input
                  value={merchant.corporate_member.referral_code || "N/A"}
                  placeholder="Referral Code"
                  readOnly
                />
              </div>
              <div>
                <Label>Total Points</Label>
                <Input
                  value={merchant.corporate_member.wallet?.total_points || "0"}
                  placeholder="Total Points"
                  readOnly
                />
              </div>
              <div>
                <Label>Available Points</Label>
                <Input
                  value={
                    merchant.corporate_member.wallet?.available_points || "0"
                  }
                  placeholder="Available Points"
                  readOnly
                />
              </div>
            </div>
          </ComponentCard>
        </div>
      )}

      {/* Staff Information */}
      {staffs.length > 0 && (
        <div className="mt-6">
          <ComponentCard title="Staff Information">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffs.map((staff) => (
                    <tr key={staff.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.user_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.designation || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.type || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            staff.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {staff.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6">
        <ComponentCard>
          <div className="flex gap-4">
            <PrimaryButton
              variant="success"
              type="button"
              onClick={handleApprove}
              disabled={isLoading || merchant?.status !== "pending"}
            >
              {isLoading ? "Approving..." : "Approve"}
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              type="button"
              onClick={handleReject}
              disabled={isLoading || merchant?.status !== "pending"}
            >
              {isLoading ? "Rejecting..." : "Reject"}
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              Back
            </PrimaryButton>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default PendingMerchantDetails;
