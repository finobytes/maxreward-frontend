import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { memberSchema } from "../../../schemas/memberSchema";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const MemberRegistration = () => {
  const [profilePic, setProfilePic] = useState([]);
  const [passportFiles, setPassportFiles] = useState([]);
  const [referralInput, setReferralInput] = useState("");
  const [debouncedReferral, setDebouncedReferral] = useState("");

  // Debounce effect (runs after 600 ms idle)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReferral(referralInput.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [referralInput]);

  // Fetch referral data (only if 3+ chars)
  const {
    data: memberData,
    isFetching,
    isError,
  } = useGetMemberByReferralQuery(debouncedReferral, {
    skip: !debouncedReferral || debouncedReferral.length < 3,
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      gender: "",
      address: "",
      city: "",
      email: "",
      password: "",
      referralCode: "",
      businessType: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    console.log("Profile Picture:", profilePic);
    console.log("Passport Files:", passportFiles);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Member Manage", to: "/admin/member-manage" },
          { label: "Member Registration" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Member Info */}
        <ComponentCard title="Member Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">
                Full Name (<span className="text-red-500">*</span>)
              </Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Enter member full name"
                {...register("fullName")}
                error={!!errors.fullName}
                hint={errors.fullName?.message}
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber">
                Phone Number (<span className="text-red-500">*</span>)
              </Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder="Enter Phone Number"
                {...register("phoneNumber")}
                error={!!errors.phoneNumber}
                hint={errors.phoneNumber?.message}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email Address"
                {...register("email")}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>

            {/* <div>
              <Label htmlFor="businessType">
                Business Type (<span className="text-red-500">*</span>)
              </Label>

              {isBusinessTypeLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : isBusinessTypeError ? (
                <p className="text-red-500 text-sm">
                  Failed to load business types
                </p>
              ) : (
                <Select
                  id="businessType"
                  {...register("businessType")}
                  error={!!errors.businessType}
                  success={!errors.businessType}
                  options={
                    businessTypes?.data?.business_types?.map((type) => ({
                      value: type.id,
                      label: type.name,
                    })) || []
                  }
                  placeholder="Select Business Type"
                />
              )}
            </div> */}
          </div>
        </ComponentCard>

        {/* Referral Info */}
        <div className="mt-8">
          <ComponentCard title="Referral Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Referral Code */}
              <div>
                <Label htmlFor="referralCode">
                  Referral Code (<span className="text-red-500">*</span>)
                </Label>
                <Input
                  type="text"
                  id="referralCode"
                  placeholder="Enter Referral Code"
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
              </div>

              {/* Referred By */}
              <div>
                <Label htmlFor="referredBy">Referred By</Label>
                {isFetching ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching...</span>
                  </div>
                ) : (
                  <Input
                    value={
                      isError ? "Referral Not Found" : memberData?.name ?? ""
                    }
                    readOnly
                    id="referredBy"
                  />
                )}
              </div>

              {/* Referral Status */}
              <div>
                <Label htmlFor="referralStatus">Referral Status</Label>
                <Input
                  value={isError ? "Invalid" : memberData?.status ?? ""}
                  readOnly
                  id="referralStatus"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit">Submit</PrimaryButton>
              <PrimaryButton variant="secondary" type="button">
                Back
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>
    </div>
  );
};

export default MemberRegistration;
