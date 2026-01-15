import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMerchantMutation } from "@/redux/features/admin/merchantManagement/merchantManagementApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Dropzone from "@/components/form/form-elements/Dropzone";
import { toast } from "sonner";
import { useGetAllBusinessTypesQuery } from "@/redux/features/admin/businessType/businessTypeApi";
import { merchantSchema } from "../../../schemas/merchantSchema";
import { useSelector } from "react-redux";
import { companyLogoPlaceholder } from "../../../assets/assets";
import { Eye, EyeOff } from "lucide-react";

// Referral imports
import SkeletonField from "@/components/skeleton/SkeletonField";
import { useGetMemberByReferralQuery } from "@/redux/features/admin/memberManagement/memberManagementApi";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { useGetCorporateMemberReferralCodeQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";
import { useGetCountriesQuery } from "../../../redux/features/countries/countriesApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const MerchantApplication = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const [businessLogo, setBusinessLogo] = useState(null);
  const [createMerchant, { isLoading: isCreating }] =
    useCreateMerchantMutation();

  const {
    data: businessTypes,
    isLoading: isBusinessTypeLoading,
    isError: isBusinessTypeError,
  } = useGetAllBusinessTypesQuery();

  const { data: corporateReferralCode } =
    useGetCorporateMemberReferralCodeQuery();

  const { data: countries, isLoading: countriesLoading } =
    useGetCountriesQuery();

  // -----------------------------
  // REFERRAL STATE + DEBOUNCE LOGIC
  // -----------------------------
  const [referralInput, setReferralInput] = useState("");
  const [PhoneInputValue, setPhoneInputValue] = useState("");
  const [debouncedReferral, setDebouncedReferral] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReferral(referralInput.trim());
    }, 600);

    return () => clearTimeout(timer);
  }, [referralInput]);

  // Fetch referral info
  const {
    data: memberData,
    isFetching,
    isError,
  } = useGetMemberByReferralQuery(debouncedReferral, {
    skip: !debouncedReferral || debouncedReferral.length < 3,
  });
  // Fetch current user's referral code
  const { data, isLoading } = useVerifyMeQuery();

  // -----------------------------
  // FORM HANDLING WITH REACT-HOOK-FORM + ZOD
  // -----------------------------
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      status: "pending",
      referralCode: "",
      town: "",
      country_code: "",
    },
  });

  // Clear referral field if invalid
  useEffect(() => {
    if (isError || !debouncedReferral) {
      resetField("referralCode");
    }
  }, [isError, debouncedReferral]);

  const annualSalesTurnover = watch("annual_sales_turnover");

  useEffect(() => {
    const turnover = Number(annualSalesTurnover);

    if (turnover >= 1000000) {
      const corpRef = corporateReferralCode?.data?.referral_code;
      if (corpRef) {
        setReferralInput(corpRef);
        setValue("referralCode", corpRef); // <-- THIS FIXES IT 100%
      }
      const corPhone = corporateReferralCode?.data?.phone;
      if (corPhone) {
        setPhoneInputValue(corPhone);
        setValue("phone", corPhone); // <-- THIS FIXES IT 100%
      }
    }
  }, [annualSalesTurnover, corporateReferralCode, setValue]);

  // Prefill referral code when verifyMeQuery loads
  useEffect(() => {
    if (data?.phone) {
      setReferralInput(data.phone); // this will show it in input
      setValue("referralCode", data.phone);
      setPhoneInputValue(data.phone); // this will show it in input
    }
  }, [data?.phone, setValue]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      data.merchant_created_by = role === "admin" ? "admin" : "general_member";

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      if (businessLogo) {
        formData.append("business_logo", businessLogo);
      }

      // Add referral sponsor ID if exists
      if (!isError && memberData) {
        formData.append("member_id", memberData?.id);
      }

      // gather other form fields as necessary

      await createMerchant(formData).unwrap();

      toast.success("Merchant application submitted successfully!");

      reset();
      setReferralInput("");
    } catch (err) {
      console.error("Create Error:", err);

      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages.join(", ")}`);
        });
      } else {
        toast.error(err?.data?.message || "Failed to create merchant!");
      }
    }
  };
  console.log(data?.referral_code);

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Application Form" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* MAIN BUSINESS INFO */}
        <ComponentCard title="Business Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  {...register("business_name")}
                  placeholder="Business name"
                />
                {errors.business_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Company Address</Label>
                <Input {...register("address")} placeholder="Company Address" />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label>State</Label>
                <Input {...register("state")} placeholder="State" />
              </div>

              <div>
                <Label>Town</Label>
                <Input {...register("town")} placeholder="Town" />
              </div>

              <div>
                <Label>Product/Service</Label>
                {isBusinessTypeLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : isBusinessTypeError ? (
                  <p className="text-red-500 text-sm">
                    Failed to load product/service type
                  </p>
                ) : (
                  <Select
                    defaultValue=""
                    {...register("business_type_id")}
                    options={[
                      ...(businessTypes?.data?.business_types?.map((type) => ({
                        value: type.id,
                        label: type.name,
                      })) || []),
                    ]}
                    placeholder="Select Product/Service Type"
                  />
                )}

                {errors.business_type_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_type_id.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Annual Sales Turnover</Label>
                <Input
                  {...register("annual_sales_turnover")}
                  placeholder="Annual Sales Turnover"
                />
              </div>

              <div>
                <Label>Reward Budget (%)</Label>
                <Input
                  {...register("reward_budget")}
                  placeholder="Reward Budget (%)"
                />
              </div>

              {/* <div>
                <Label>Password</Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("merchant_password")}
                    placeholder="Password"
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.merchant_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.merchant_password.message}
                  </p>
                )}
              </div> */}
            </div>

            {/* LOGO */}
            <div className="md:col-span-1">
              <Label>Upload Company Logo</Label>
              <Dropzone
                multiple={false}
                maxFileSizeMB={5}
                required
                placeholderImage={companyLogoPlaceholder}
                onFilesChange={(file) => setBusinessLogo(file ?? null)}
              />
            </div>
          </div>
        </ComponentCard>

        {/* Authorized Person Info */}
        <div className="mt-6">
          <ComponentCard title="Authorized Person Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Authorized Person Name</Label>
                <Input
                  {...register("authorized_person_name")}
                  placeholder="Name"
                />
              </div>

              <div>
                <Label>Designation</Label>
                <Input {...register("designation")} placeholder="Designation" />
              </div>

              <div>
                <Label>
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
                    name: "phone",
                    required: true,
                  }}
                  countryCodeEditable={false}
                  enableSearch={true}
                  autocompleteSearch={true}
                  searchPlaceholder="search"
                  prefix=""
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Email Address</Label>
                <Input {...register("email")} placeholder="Email Address" />
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* REFERRAL INFORMATION SECTION */}
        <div className="mt-8">
          <ComponentCard title="Nominate Referral">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Referral Input */}
              <div>
                <Label htmlFor="referralCode">
                  {/* Referral Code / Phone Number  */}
                  Phone Number (<span className="text-red-500">*</span>)
                </Label>
                {isLoading ? (
                  <SkeletonField />
                ) : (
                  <Input
                    id="referralCode"
                    // placeholder="Enter referral code / Phone Number"
                    placeholder="Enter Phone Number"
                    {...register("referralCode")}
                    // value={referralInput}
                    value={referralInput}
                    onChange={(e) => {
                      if (Number(annualSalesTurnover) < 1000000) {
                        setReferralInput(e.target.value);
                        setValue("referralCode", e.target.value, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    readOnly={Number(annualSalesTurnover) >= 1000000}
                    className={
                      Number(annualSalesTurnover) >= 1000000
                        ? "bg-gray-100"
                        : ""
                    }
                    error={!!errors.referralCode}
                    hint={errors.referralCode?.message}
                  />
                )}

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

              {/* Sponsor Name */}
              <div>
                <Label>Referred By</Label>
                {isFetching ? (
                  <SkeletonField />
                ) : (
                  <Input
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
                <Label>Referral Status</Label>
                {isFetching ? (
                  <SkeletonField />
                ) : (
                  <Input
                    disabled
                    readOnly
                    value={isError ? "Invalid" : memberData?.status || ""}
                  />
                )}
              </div> */}
            </div>

            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={isCreating}>
                {isCreating ? "Submitting..." : "Submit"}
              </PrimaryButton>

              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => {
                  reset();
                  setReferralInput("");
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

export default MerchantApplication;
