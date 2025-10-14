import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Dropzone from "../../../components/form/form-elements/Dropzone";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Select from "../../../components/form/Select";
import { memberSchema } from "../../../schemas/memberSchema";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const MemberRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    error,
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>
          </div>

          {/* Dropzones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Profile Picture</Label>
              <Dropzone
                onFilesChange={setProfilePic}
                multiple={false}
                maxFiles={1}
              />
            </div>
            <div>
              <Label>National ID / Passport</Label>
              <Dropzone
                onFilesChange={setPassportFiles}
                multiple={true}
                maxFiles={2}
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
