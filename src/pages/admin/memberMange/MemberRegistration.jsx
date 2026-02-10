import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SearchableSelect from "@/components/form/SearchableSelect";

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
  console.log(memberData?.referral_code, "memberData referral_code");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    resetField,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminMemberRegistrationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      country_id: "84",
      country_code: "",
      referralCode: "",
    },
  });
  useEffect(() => {
    if (!countriesLoading && countries?.data?.length > 0) {
      const malaysia = countries.data.find((c) => c.id === 84);
      if (malaysia) {
        setValue("country_id", String(malaysia.id));
      }
    }
  }, [countriesLoading, countries, setValue]);
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
      // Admin logic: must have a valid referral code and member data
      if (!memberData || isError) {
        toast.error("Invalid referral code — member not found!");
        setError("referralCode", {
          type: "manual",
          message: "Please enter a valid referral code",
        });
        return;
      }

      // Prepare payload with referral_code from memberData (API response)
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        country_id: formData.country_id,
        country_code: formData.country_code,
        referral_code: memberData?.referral_code, // Use referral_code from API response
      };

      const res = await handleRefer(payload);
      toast.success(res?.message || "Member referred successfully!");
      navigate("/admin/member-manage");
      reset();
      setReferralInput("");
      resetState();
    } catch (err) {
      console.error("Member registration error:", err);

      const backendErrors = err?.data?.errors;
      const message = err?.data?.message || "Failed to refer member";

      // Handle validation errors from backend
      if (backendErrors && typeof backendErrors === "object") {
        // Map backend field names to form field names
        const fieldMapping = {
          phone: "phone",
          email: "email",
          name: "name",
          country_id: "country_id",
          country_code: "country_code",
          referral: "referralCode",
          referral_code: "referralCode",
        };

        let errorCount = 0;
        const errorMessages = [];

        // Set errors on form fields and collect messages
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const mappedField = fieldMapping[field] || field;
          const errorMessage = Array.isArray(messages) ? messages[0] : messages;

          // Set error on the form field
          setError(mappedField, {
            type: "server",
            message: errorMessage,
          });

          errorMessages.push(errorMessage);
          errorCount++;
        });

        // Show comprehensive toast notification
        if (errorCount === 1) {
          toast.error(errorMessages[0]);
        } else if (errorCount > 1) {
          toast.error(`${message}: ${errorCount} validation error(s) found`, {
            description: errorMessages.join(", "),
            duration: 5000,
          });
        }
      } else if (message) {
        // Handle general error messages
        toast.error(message, {
          description:
            err?.data?.error || "Please check your input and try again",
        });
      } else {
        // Handle unexpected errors
        toast.error("An unexpected error occurred", {
          description:
            "Please try again or contact support if the issue persists",
        });
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
            {/* Citizenship */}
            <div>
              <Label htmlFor="citizenship">
                Citizenship <span className="text-red-500">*</span>
              </Label>

              {countriesLoading ? (
                <div className="animate-pulse h-11 bg-gray-200 rounded-lg"></div>
              ) : (
                <Controller
                  name="country_id"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      {...field}
                      onChange={(val) => field.onChange(String(val))}
                      options={
                        countries?.data?.map((item) => ({
                          label: item.country,
                          value: item.id,
                        })) ?? []
                      }
                    />
                  )}
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
                      isError ? "Referral Not Found" : memberData?.name || ""
                    }
                  />
                )}
              </div>

              {/* Referral Status */}
              {/* <div>
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
              </div> */}
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
