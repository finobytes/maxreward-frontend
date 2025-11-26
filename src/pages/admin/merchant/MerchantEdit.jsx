import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { merchantEditSchema } from "@/schemas/merchantEditSchema";
import {
  useGetMerchantByIdQuery,
  useUpdateMerchantMutation,
} from "@/redux/features/admin/merchantManagement/merchantManagementApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Dropzone from "@/components/form/form-elements/Dropzone";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { companyLogoPlaceholder } from "../../../assets/assets";
import SkeletonField from "../../../components/skeleton/SkeletonField";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const MerchantEdit = () => {
  const [businessLogo, setBusinessLogo] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Load existing merchant data by ID
  const { data: merchantData } = useGetMerchantByIdQuery(id, {
    skip: !id,
  });

  const [updateMerchant, { isLoading }] = useUpdateMerchantMutation();
  console.log(
    "merchant data:",
    merchantData?.data?.merchant?.corporate_member?.referral_code
  );
  const {
    data: memberData,
    isFetching,
    isError,
  } = useGetMemberByReferralQuery(
    merchantData?.data?.merchant?.corporate_member?.referral_code,
    {
      skip: !merchantData?.data?.merchant?.corporate_member?.referral_code,
    }
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantEditSchema),
  });

  // Populate existing merchant data into form
  useEffect(() => {
    if (merchantData?.data?.merchant) {
      reset(merchantData.data.merchant);
    }
  }, [merchantData, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };

      if (!payload.merchant_password) {
        delete payload.merchant_password;
      }
      if (businessLogo) {
        register("business_logo", businessLogo);
      }

      await updateMerchant({ id, ...payload }).unwrap();

      toast.success("Merchant updated successfully!");
      navigate("/admin/merchant/all-merchant");
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update merchant!");
    }
  };

  if (isFetching)
    return (
      <div className="p-6 space-y-4">
        {/* Skeleton for breadcrumb */}
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>

        {/* Skeleton for cards */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
          { label: "Merchant", to: "/admin/merchant/all-merchant" },
          { label: "Edit Merchant" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Business Information */}
        <ComponentCard title="Business Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  {...register("business_name")}
                  placeholder="Company name"
                />
                {errors.business_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Company Address</Label>
                <Input {...register("address")} placeholder="Company Address" />
              </div>
              <div>
                <Label>State</Label>
                <Input {...register("state")} placeholder="State" />
              </div>
              <div>
                <Label>Product/Service</Label>
                <Select
                  {...register("business_type")}
                  options={[
                    { value: "Retail", label: "Retail" },
                    { value: "Service", label: "Service" },
                    { value: "Super Shop", label: "Super Shop" },
                  ]}
                />
                {errors.business_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_type.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Annual Sales Turnover</Label>
                <Input
                  {...register("annual_sales_turnover")}
                  placeholder="Annual Sales Turnover"
                />
              </div>
              <div>
                <Label>Reward Budget (%)</Label>
                <Input
                  {...register("reward_budget")}
                  placeholder="Reward Budget (%)"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label>Upload Company Logo</Label>
              <Dropzone
                multiple={false}
                maxFileSizeMB={5}
                required
                validationMessage="Company logo is required"
                placeholderImage={companyLogoPlaceholder}
                initialFiles={
                  merchantData?.data?.business_logo
                    ? [merchantData.data.business_logo]
                    : []
                }
                onFilesChange={(file) => setBusinessLogo(file ?? null)}
              />
            </div>
          </div>
        </ComponentCard>

        {/* Authorized Person Information */}
        <div className="mt-6">
          <ComponentCard title="Authorized Person Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Authorized Person Name</Label>
                <Input
                  {...register("authorized_person_name")}
                  placeholder="Authorized Person Name"
                />
              </div>
              <div>
                <Label>Designation</Label>
                <Input {...register("designation")} placeholder="Designation" />
              </div>
              <div>
                <Label>
                  Phone Number (<span className="text-red-500">*</span>)
                </Label>
                <Input {...register("phone")} placeholder="Phone Number" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input {...register("email")} placeholder="Email Address" />
              </div>
            </div>
          </ComponentCard>
        </div>

        <ComponentCard className="mt-6" title="Referral Information">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Referral Code</Label>
                <SkeletonField />
              </div>
              <div>
                <Label>Referred By</Label>
                <SkeletonField />
              </div>
              <div>
                <Label>Referral Status</Label>
                <SkeletonField />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Referral Code</Label>
                <Input
                  disabled
                  value={
                    merchantData?.data?.merchant?.corporate_member
                      ?.referral_code || ""
                  }
                  readOnly
                />
              </div>
              <div>
                <Label>Referred By</Label>
                <Input
                  disabled
                  value={
                    memberData?.sponsored_member_info?.sponsor_member?.name ||
                    ""
                  }
                  readOnly
                />
              </div>
              <div>
                <Label>Referral Status</Label>
                <Input
                  disabled
                  value={
                    memberData?.sponsored_member_info?.sponsor_member?.status ||
                    ""
                  }
                  readOnly
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Merchant"}
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
      </form>
    </div>
  );
};

export default MerchantEdit;
