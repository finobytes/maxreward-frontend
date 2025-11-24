import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Dropzone from "@/components/form/form-elements/Dropzone";
import { useGetAllBusinessTypesQuery } from "@/redux/features/admin/businessType/businessTypeApi";
import { useCreateMerchantMutation } from "@/redux/features/admin/merchantManagement/merchantManagementApi";
import { companyLogoPlaceholder } from "../../../assets/assets";
import { merchantSchema } from "../../../schemas/merchantSchema";
import SkeletonField from "../../../components/skeleton/SkeletonField";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const merchantRegistrationSchema = merchantSchema.extend({
  referralCode: z.string().min(3, {
    message: "Referral code is required and must be at least 3 characters",
  }),
});

const MerchantRegistrationForm = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const [referralInput, setReferralInput] = useState("");
  const [debouncedReferral, setDebouncedReferral] = useState("");
  // Debounce referral input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReferral(referralInput.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [referralInput]);

  // Fetch member info by referral code
  const {
    data: memberData,
    isFetching,
    isError,
  } = useGetMemberByReferralQuery(debouncedReferral, {
    skip: !debouncedReferral || debouncedReferral.length < 3,
  });

  const [businessLogo, setBusinessLogo] = useState(null);

  const [createMerchant, { isLoading: isCreating }] =
    useCreateMerchantMutation();
  const navigate = useNavigate();
  const {
    data: businessTypes,
    isLoading: isBusinessTypeLoading,
    isError: isBusinessTypeError,
  } = useGetAllBusinessTypesQuery();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantRegistrationSchema),
    defaultValues: {
      status: "approved",
      referralCode: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (!memberData?.id || isError) {
        setError("referralCode", {
          type: "manual",
          message: "Valid referral is required to register a merchant",
        });
        toast.error("Please provide a valid referral code or phone number.");
        return;
      }

      const referralValue = referralInput.trim();
      const payload = {
        ...data,
        referralCode: referralValue || data.referralCode,
        merchant_created_by: role === "admin" ? "admin" : "general_member",
        member_id: memberData.id,
      };
      const formData = new FormData();

      //  Append all text fields
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, payload[key]);
        }
      });

      //  File append
      if (businessLogo) {
        formData.append("business_logo", businessLogo);
      }

      await createMerchant(formData).unwrap();

      toast.success("Merchant created successfully!");
      reset();
      setReferralInput("");
      setDebouncedReferral("");
      navigate("/admin/merchant/pending-merchant");
    } catch (err) {
      console.error("Create Error:", err);

      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages.join(", ")}`);
        });
      } else {
        toast.error(err?.data?.message || "Failed to create merchant!");
      }
    }
  };

  const [searchParams] = useSearchParams();
  const from = searchParams.get("from"); // pending OR all

  const breadcrumbItems = [
    { label: "Home", to: "/" },

    from === "pending"
      ? { label: "Pending Merchant", to: "/admin/merchant/pending-merchant" }
      : { label: "All Merchant", to: "/admin/merchant/all-merchant" },

    { label: "Merchant Registration" },
  ];

  return (
    <div>
      <PageBreadcrumb items={breadcrumbItems} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Member Information */}
        <ComponentCard title="Business Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  {...register("business_name")}
                  placeholder="Business name"
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
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <Label>State</Label>
                <Input {...register("state")} placeholder="State" />
              </div>
              <div>
                <Label>Product/Service</Label>

                {isBusinessTypeLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : isBusinessTypeError ? (
                  <p className="text-red-500 text-sm">
                    Failed to load product/service type
                  </p>
                ) : (
                  <Select
                    defaultValue=""
                    {...register("business_type_id")}
                    options={[
                      ...(businessTypes?.data?.business_types?.map((type) => ({
                        value: type.id,
                        label: type.name,
                      })) || []),
                    ]}
                    placeholder="Select Product/Service Type"
                  />
                )}

                {errors.business_type_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_type_id.message}
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
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("merchant_password")}
                  placeholder="Password"
                />
                {errors.merchant_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.merchant_password.message}
                  </p>
                )}
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
                onFilesChange={(file) => setBusinessLogo(file ?? null)}
              />
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
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Email Address</Label>
                <Input {...register("email")} placeholder="Email Address" />
              </div>
            </div>
          </ComponentCard>
        </div>
        {/* Referral Info */}
        <div className="mt-8">
          <ComponentCard title="Referral Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Referral Code */}
              <div>
                <Label htmlFor="referralCode">
                  Referral Code / Phone Number (
                  <span className="text-red-500">*</span>)
                </Label>
                <Input
                  id="referralCode"
                  placeholder="Enter referral code / Phone Number"
                  {...register("referralCode")}
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  error={!!errors.referralCode}
                  hint={errors.referralCode?.message}
                />
                {referralInput && referralInput.length < 3 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Type at least 3 characters...
                  </p>
                )}
                {isError && (
                  <p className="text-xs text-red-500 mt-1">
                    Invalid referral - please check the code or phone number.
                  </p>
                )}
              </div>

              {/* Referred By */}
              <div>
                <Label htmlFor="referredBy">Referred By</Label>
                {isFetching ? (
                  <>
                    <SkeletonField />
                  </>
                ) : (
                  <Input
                    id="referredBy"
                    disabled
                    readOnly
                    value={
                      isError
                        ? "Referral Not Found"
                        : memberData?.sponsored_member_info?.sponsor_member
                            ?.name || ""
                    }
                  />
                )}
              </div>

              {/* Referral Status */}
              <div>
                <Label htmlFor="referralStatus">Referral Status</Label>
                {isFetching ? (
                  <SkeletonField />
                ) : (
                  <Input
                    id="referralStatus"
                    disabled
                    readOnly
                    value={
                      isError
                        ? "Invalid"
                        : memberData?.sponsored_member_info?.sponsor_member
                            ?.status || ""
                    }
                  />
                )}
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={isCreating}>
                {isCreating ? "Submitting..." : "Submit"}
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => reset()}
              >
                Reset
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>
    </div>
  );
};

export default MerchantRegistrationForm;
