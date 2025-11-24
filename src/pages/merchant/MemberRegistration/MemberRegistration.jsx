import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";

import { useReferNewMember } from "../../../redux/features/member/referNewMember/useReferNewMember";
import { referNewMemberSchema } from "../../../schemas/referNewMember.schema";
import { useState } from "react";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import SkeletonField from "../../../components/skeleton/SkeletonField";
import ReferSuccessDialog from "../../member/referNewMember/components/ReferSuccessDialog";
import { useSelector } from "react-redux";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const MemberRegistration = () => {
  const { user } = useSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const { handleRefer, loading, success, error, resetState } =
    useReferNewMember();

  const { data, isLoading } = useVerifyMeQuery(user?.role);

  const {
    data: memberData,
    isFetching,
    isError,
  } = useGetMemberByReferralQuery(
    data?.merchant?.corporate_member?.referral_code,
    {
      skip: !data?.merchant?.corporate_member?.referral_code,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referNewMemberSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      gender: "male",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await handleRefer(data);
      setResponse(res);
      setDialogOpen(true);
      // toast.success(res.message || "Member referred successfully!");
      reset();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Refer New Member", to: "/member/referred-member" },
          { label: "Refer New Member" },
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
                placeholder="Enter email"
                {...register("email")}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
          </div>
        </ComponentCard>
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
                  value={data?.merchant?.corporate_member?.referral_code || ""}
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
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit & Send Invite"}
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
