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
import Select from "@/components/form/Select";

import { useReferNewMember } from "../../../redux/features/member/referNewMember/useReferNewMember";
import { useGetMemberByReferralQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";
import ReferSuccessDialog from "../../member/referNewMember/components/ReferSuccessDialog";
import { z } from "zod";
import SkeletonField from "../../../components/skeleton/SkeletonField";
// import { useSelector } from "react-redux";
import { useGetCountriesQuery } from "../../../redux/features/countries/countriesApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { referNewMemberSchema } from "../../../schemas/referNewMember.schema";
import { useNavigate } from "react-router";

// Extend the shared schema to include referralCode
const adminMemberRegistrationSchema = referNewMemberSchema.extend({
  referralCode: z.string().min(3, {
    message: "Referral code is required and must be at least 3 characters",
  }),
});

const MemberRegistration = () => {
  const [referralInput, setReferralInput] = useState("");
  const [debouncedReferral, setDebouncedReferral] = useState("");
  // const { user } = useSelector((state) => state.auth); // Unused

  const navigate = useNavigate();
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

  const { data: countries, isLoading: countriesLoading } =
    useGetCountriesQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminMemberRegistrationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      country_id: "",
      country_code: "",
      referralCode: "",
    },
  });

  // Sync referralInput with form state
  useEffect(() => {
    setValue("referralCode", referralInput);
    if (referralInput === "") {
      resetField("referralCode");
    }
  }, [referralInput, setValue, resetField]);

  useEffect(() => {
    if (isError || !debouncedReferral) {
      // If error or empty, we might want to clear related fields or just let the user know
    }
  }, [isError, debouncedReferral]);

  // On form submit
  const onSubmit = async (formData) => {
    try {
      const payload = { ...formData };

      // Admin logic: must have a valid member_id from the referral lookup
      if (memberData && memberData.id && !isError) {
        payload.member_id = memberData.id;
      } else {
        toast.error("Invalid referral — member not found!");
        return;
      }

      const res = await handleRefer(payload);
      toast.success(res?.message || "Member referred successfully!");
      navigate("/admin/member-manage");
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
              ? "phone" // Schema uses 'phone'
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
            {/* Nationality */}
            <div>
              <Label htmlFor="citizenship">
                Citizenship <span className="text-red-500">*</span>
              </Label>

              {countriesLoading ? (
                <div className="animate-pulse h-11 bg-gray-200 rounded-lg"></div>
              ) : (
                <Select
                  id="citizenship"
                  placeholder="Select Citizenship"
                  error={errors.country_id}
                  {...register("country_id")}
                  options={
                    countries?.data?.map((item) => ({
                      label: item.country,
                      value: item.id,
                    })) ?? []
                  }
                />
              )}

              {errors.country_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country_id.message}
                </p>
              )}
            </div>
            {/* Updated Phone Number */}
            <div>
              <Label htmlFor="phoneNumber">
                Phone Number (<span className="text-red-500">*</span>)
              </Label>
              <PhoneInput
                country={"my"}
                value={watch("phone")}
                onChange={(phone, countryData) => {
                  const numeric = phone.replace("+", "");
                  setValue("phone", numeric);
                  setValue("country_code", countryData?.dialCode);
                }}
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                }}
                countryCodeEditable={false}
                // Demo-style
                enableSearch={true}
                autocompleteSearch={true}
                searchPlaceholder="search"
                // Remove + sign
                prefix=""
                // Demo-style
                inputStyle={{ width: "100%" }}
                buttonStyle={{}}
                dropdownStyle={{ maxHeight: "250px" }}
                searchStyle={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">
                Full Name (<span className="text-red-500">*</span>)
              </Label>
              <Input
                id="fullName"
                placeholder="Enter member full name"
                {...register("name")}
                error={!!errors.name}
                hint={errors.name?.message}
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
                  // We handle value via state and sync it to form, but we can also register it for validation
                  // However, since we have a custom onChange for debounce, we need to be careful.
                  // Best approach: Bind value to state, and in useEffect set value in form.
                  // We still register it to track errors.
                  {...register("referralCode")}
                  value={referralInput}
                  onChange={(e) => {
                    setReferralInput(e.target.value);
                    // setValue("referralCode", e.target.value, { shouldValidate: true }); // Handled in useEffect
                  }}
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
                    Invalid referral — please check the code or phone number.
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
    </div>
  );
};

export default MemberRegistration;
