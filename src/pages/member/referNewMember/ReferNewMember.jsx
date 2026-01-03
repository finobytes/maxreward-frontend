import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SearchableSelect from "@/components/form/SearchableSelect";
import { useReferNewMember } from "../../../redux/features/member/referNewMember/useReferNewMember";
import { referNewMemberSchema } from "../../../schemas/referNewMember.schema";
import { useEffect, useState } from "react";
import ReferSuccessDialog from "./components/ReferSuccessDialog";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import SkeletonField from "../../../components/skeleton/SkeletonField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useGetCountriesQuery } from "../../../redux/features/countries/countriesApi";

const ReferNewMember = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const { handleRefer, loading, success, error, resetState } =
    useReferNewMember();

  const { data, isLoading } = useVerifyMeQuery();
  const user = data || {};
  const { data: countries, isLoading: countriesLoading } =
    useGetCountriesQuery();

  console.log("countries", countries);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referNewMemberSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country_id: "84", // country_id
      country_code: "", // phoneInput
    },
  });
  useEffect(() => {
    if (!countriesLoading && countries?.data?.length > 0) {
      const malaysia = countries.data.find((c) => c.id === 84);
      if (malaysia) {
        setValue("country_id", String(malaysia.id));
      }
    }
  }, [countriesLoading, countries]);

  const onSubmit = async (data) => {
    console.log("form data", data);
    try {
      const res = await handleRefer(data);
      setResponse(res);
      setDialogOpen(true);
      // toast.success(res.message || "Member referred successfully!");
      reset();
    } catch (err) {
      if (err?.data?.errors) {
        Object.keys(err.data.errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: err.data.errors[key][0],
          });
        });
        toast.error("Validation failed. Please check the form.");
      } else {
        toast.error(err?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Refer New Member" }]}
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
              {/* <div>
                <Label>Referral Status</Label>
                <SkeletonField />
              </div> */}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Referral Code</Label>
                <Input disabled value={user?.referral_code || ""} readOnly />
              </div>
              <div>
                <Label>Referred By</Label>
                <Input disabled value={user?.name || ""} readOnly />
              </div>
              {/* <div>
                <Label>Referral Status</Label>
                <Input disabled value={user?.status || ""} readOnly />
              </div> */}
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
export default ReferNewMember;
