import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";

import Select from "@/components/form/Select";
import { merchantStaffSchema } from "../../../schemas/merchantStaffSchema";

const MerchantStaffCreate = () => {
  // setup react-hook-form with zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantStaffSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      gender: "male",
      status: "active",
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
              <Label htmlFor="fullName">Full Name</Label>
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
                Phone Number
                {/*  (<span className="text-red-500">*</span>) */}
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
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="text"
                id="password"
                placeholder="Enter Password"
                {...register("password")}
                error={!!errors.password}
                hint={errors.password?.message}
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                {...register("gender")}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "others", label: "Others" },
                ]}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit">Submit</PrimaryButton>
            <PrimaryButton variant="secondary" type="button">
              Back
            </PrimaryButton>
          </div>
        </ComponentCard>
      </form>
    </div>
  );
};

export default MerchantStaffCreate;
