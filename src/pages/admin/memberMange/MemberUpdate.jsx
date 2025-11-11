import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Skeleton } from "../../../components/ui/skeleton";

import {
  useGetMemberByIdQuery,
  useGetMemberByReferralQuery,
  useUpdateMemberMutation,
} from "../../../redux/features/admin/memberManagement/memberManagementApi";

import { updateMemberSchema } from "../../../schemas/memberUpdateSchema";

const MemberUpdate = () => {
  const [referralInput, setReferralInput] = useState("");
  const [debouncedReferral, setDebouncedReferral] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const {
    data: existingMember,
    isLoading: isMemberLoading,
    isError: isMemberError,
  } = useGetMemberByIdQuery(id);

  // Debounce referral search
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
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      referralCode: "",
    },
  });

  // Prefill existing data
  useEffect(() => {
    if (existingMember) {
      reset({
        fullName: existingMember.name || "",
        phoneNumber: existingMember.phone || "",
        email: existingMember.email || "",
        referralCode: existingMember.referral_code || "",
      });
      setReferralInput(existingMember.referral_code || "");
    }
  }, [existingMember, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.fullName);
      formData.append("phone", data.phoneNumber);
      formData.append("email", data.email);
      formData.append("referral_code", data.referralCode);
      formData.append("status", "active");

      const response = await updateMember({ id, formData }).unwrap();
      toast.success(response?.message || "Member updated successfully!");
      navigate("/admin/member-manage");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Update failed!");
    }
  };

  // Loading skeleton
  if (isMemberLoading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Member Manage", to: "/admin/member-manage" },
            { label: "Member Update" },
          ]}
        />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (isMemberError)
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load member data.
      </div>
    );

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Member Manage", to: "/admin/member-manage" },
          { label: "Member Update" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Member Info */}
        <ComponentCard title="Member Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              id="fullName"
              label="Full Name"
              required
              register={register}
              error={errors.fullName}
              placeholder="Enter member full name"
            />

            <FormInput
              id="phoneNumber"
              label="Phone Number"
              required
              register={register}
              error={errors.phoneNumber}
              placeholder="Enter phone number"
            />

            <FormInput
              id="email"
              label="Email Address"
              register={register}
              error={errors.email}
              placeholder="Enter email address"
              type="email"
            />
          </div>
        </ComponentCard>

        {/* Referral Info */}
        <div className="mt-8">
          <ComponentCard title="Referral Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
                id="referralCode"
                label="Referral Code"
                required
                register={register}
                error={errors.referralCode}
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="Enter referral code"
                readOnly
              />

              <div>
                <Label>Referred By</Label>
                {isFetching ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching...</span>
                  </div>
                ) : (
                  <Input
                    value={
                      isError
                        ? "Referral Not Found"
                        : memberData?.sponsored_member_info?.sponsor_member
                            ?.name ?? ""
                    }
                    readOnly
                  />
                )}
              </div>

              <FormInput
                id="referralStatus"
                label="Referral Status"
                readOnly
                value={
                  isError
                    ? "Invalid"
                    : memberData?.sponsored_member_info?.sponsor_member
                        ?.status ?? ""
                }
              />
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </span>
                ) : (
                  "Update Member"
                )}
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => navigate("/admin/member-manage")}
              >
                Back
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>
    </div>
  );
};

/* ---------- Reusable UI helper ---------- */
const FormInput = ({
  id,
  label,
  placeholder,
  type = "text",
  register,
  error,
  required,
  ...props
}) => (
  <div>
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      {...(register ? register(id) : {})}
      {...props}
      error={!!error}
      hint={error?.message}
    />
  </div>
);

export default MemberUpdate;
