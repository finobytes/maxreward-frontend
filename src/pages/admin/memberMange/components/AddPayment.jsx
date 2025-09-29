import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { memberSchema } from "../../../../schemas/memberSchema";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import Dropzone from "../../../../components/form/form-elements/Dropzone";

const AddPayment = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState([]);

  // ✅ setup react-hook-form with zod
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
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    console.log("Profile Picture:", profilePic);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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

          {/* Gender */}
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              name="gender"
              placeholder="Select Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              {...register("gender")}
            />
            {errors.gender && (
              <p className="text-xs text-error-500 mt-1.5">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Full Address</Label>
            <Input
              type="text"
              id="address"
              placeholder="Enter Full Address"
              {...register("address")}
              error={!!errors.address}
              hint={errors.address?.message}
            />
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              placeholder="Enter City"
              {...register("city")}
              error={!!errors.city}
              hint={errors.city?.message}
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

          {/* Password */}
          <div>
            <Label>
              Password (<span className="text-red-500">*</span>)
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                error={!!errors.password}
                hint={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Dropzones */}
        <div className=" mt-4">
          <div>
            <Label>Profile Picture</Label>
            <Dropzone
              onFilesChange={setProfilePic}
              multiple={false}
              maxFiles={1}
            />
          </div>
        </div>

        {/* Referral */}
        <div className="mt-8">
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
            <div>
              <Label htmlFor="referralCode">
                Referral Code (<span className="text-red-500">*</span>)
              </Label>
              <Select
                id="referralCode"
                name="referralCode"
                placeholder="Referral Code"
                options={[
                  { value: "MAX-1001", label: "MAX-1001" },
                  { value: "MAX-1002", label: "MAX-1002" },
                  { value: "MAX-1003", label: "MAX-1003" },
                ]}
                {...register("referralCode")}
              />
              {errors.referralCode && (
                <p className="text-xs text-error-500 mt-1.5">
                  {errors.referralCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="referredBy">Referred By</Label>
              <Input type="text" id="referredBy" disabled />
            </div>
            <div>
              <Label htmlFor="referralStatus">Referral Status</Label>
              <Input type="text" id="referralStatus" disabled />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit">Submit</PrimaryButton>
            <PrimaryButton variant="secondary" type="button">
              Back
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;
