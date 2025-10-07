import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { memberSchema } from "../../../schemas/memberSchema";

const ReferNewMemberForm = () => {
  // setup react-hook-form with zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
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
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
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
          </div>
        </ComponentCard>

        {/* Referral */}
        <div className="mt-8">
          <ComponentCard title="Referral Information">
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
              <div>
                <Label htmlFor="referralCode">Referral Code</Label>
                <Input
                  type="text"
                  id="referralCode"
                  value="MAX 6845646"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="referredBy">Referred By</Label>
                <Input
                  type="text"
                  value="Leo Philips"
                  id="referredBy"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="referralStatus">Referral Status</Label>
                <Input
                  type="text"
                  id="referralStatus"
                  value="Active"
                  disabled
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit">Submit & Send Invite</PrimaryButton>
              <PrimaryButton
                variant="secondary"
                type="button"
                to="/member/referred-member"
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

export default ReferNewMemberForm;
