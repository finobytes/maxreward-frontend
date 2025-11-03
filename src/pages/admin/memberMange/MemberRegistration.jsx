import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";

import { useReferNewMember } from "../../../redux/features/member/referNewMember/useReferNewMember";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";
import ReferSuccessDialog from "../../member/referNewMember/components/ReferSuccessDialog";
import { z } from "zod";
import SkeletonField from "../../../components/skeleton/SkeletonField";
import { useSelector } from "react-redux";

const referNewMemberSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),
  phoneNumber: z.string().regex(/^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8})$/, {
    message: "Invalid Bangladeshi phone number format",
  }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("").transform(() => undefined)), // optional field
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  address: z.string().optional(),
  referralCode: z.string().min(3, {
    message: "Referral code is required and must be at least 3 characters",
  }),
});

const MemberRegistration = () => {
  const [referralInput, setReferralInput] = useState("");
  const [debouncedReferral, setDebouncedReferral] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { handleRefer, loading, resetState } = useReferNewMember();

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

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referNewMemberSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      gender: "male",
      address: "",
      referralCode: "",
    },
  });
  useEffect(() => {
    if (isError || !debouncedReferral) {
      // clear cached referral data
      resetField("referralCode");
    }
  }, [isError, debouncedReferral]);

  // On form submit
  const onSubmit = async (formData) => {
    try {
      const payload = { ...formData };

      if (user?.role === "admin") {
        if (memberData && memberData.id && !isError) {
          payload.member_id = memberData.id;
        } else {
          toast.error("Invalid referral — member not found!");
          return; // stop submit
        }
      } else {
        // non-admin should never send member_id
        delete payload.member_id;
      }

      const res = await handleRefer(payload);
      setResponse(res);
      setDialogOpen(true);
      toast.success(res?.message || "Member referred successfully!");
      reset();
      setReferralInput("");
      resetState();
    } catch (err) {
      const backendErrors = err?.data?.errors;
      const message = err?.data?.message || "Failed to refer member";

      if (backendErrors) {
        // Laravel field mapping fix
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const fieldName =
            field === "phone"
              ? "phoneNumber"
              : field === "referral"
              ? "referralCode"
              : field;

          setError(fieldName, {
            type: "server",
            message: messages[0],
          });
        });

        // Show the first validation message in toast
        const firstError = Object.values(backendErrors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(message);
      }
    }
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
        <ComponentCard title="Member Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">
                Full Name (<span className="text-red-500">*</span>)
              </Label>
              <Input
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
                id="phoneNumber"
                placeholder="Enter phone number"
                {...register("phoneNumber")}
                error={!!errors.phoneNumber}
                hint={errors.phoneNumber?.message}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                {...register("email")}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
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
                  id="referralCode"
                  placeholder="Enter referral code"
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
                    Invalid referral — please check the code.
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
                      isError ? "Referral Not Found" : memberData?.name || ""
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
                    value={isError ? "Invalid" : memberData?.status || ""}
                  />
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit & Send Invite"}
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => {
                  reset();
                  setReferralInput("");
                  resetState();
                }}
              >
                Reset
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>

      <ReferSuccessDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        response={response}
      />
    </div>
  );
};

export default MemberRegistration;
